/**
 * Editor de contenido del panel.
 *
 * De dónde salen los campos
 * -------------------------
 * No hay una lista de campos escrita en ningún lado. El panel se baja el
 * index.html del sitio, lo lee con dc-contenido.js —el mismo archivo que usa
 * el sitio para aplicar lo guardado— y de ahí salen las páginas, las secciones
 * y cada texto e imagen.
 *
 * Esto importa: el día que alguien agregue un párrafo al sitio, aparece solo
 * en el panel. Con una lista escrita a mano habría que acordarse de tocar los
 * dos lados, y el día que uno se olvide nadie se entera.
 *
 * Qué se guarda
 * -------------
 * Solo lo que se cambió. Un texto que quedó igual al del sitio no genera
 * fila: la tabla guarda diferencias, no copias. Y "volver al original" borra
 * la fila, que es lo mismo que decir "acá mandá vos, sitio".
 */
(function () {
  "use strict";

  var API = "https://api.neura.com.py";
  var SCHEMA = "donacompraweb";
  var BUCKET = "donacompraweb";
  var CLAVE_VISTA = "dc.vista.previa";

  var $ = function (id) { return document.getElementById(id); };

  var campos = [];      // todo lo que encontró el recorrido
  var guardado = {};    // clave -> valor que ya está en la base
  var cambios = {};     // clave -> valor nuevo, o null para volver al original
  var paginaActual = "Inicio";
  // A cuántos píxeles de ancho se dibuja el sitio en la vista. No es el ancho
  // del marco: el marco es angosto y, dibujando a ese ancho, el sitio sale a
  // tamaño real y solo se ve un pedazo gigante. Se dibuja al ancho de una
  // computadora o de un teléfono, y se achica entero.
  var ANCHO_COMPU = 1280;
  var ANCHO_TELE = 390;
  var anchoVista = ANCHO_COMPU;
  var seccionActual = null;
  var api = null;       // lo que presta panel.js: pedir(), sesion(), avisar()

  /* --- Utilidades ---------------------------------------------------------- */

  function urlImagen(ruta) {
    if (!ruta) return "";
    if (/^(https?:)?\/\//i.test(ruta)) return ruta;
    if (ruta.indexOf("contenido/") === 0) {
      return API + "/storage/v1/object/public/" + BUCKET + "/" + ruta;
    }
    // Ruta del propio sitio. El panel vive en /admin/, así que sube un nivel.
    return "../" + ruta;
  }

  function cuantosCambios() {
    var n = 0;
    for (var k in cambios) {
      if (Object.prototype.hasOwnProperty.call(cambios, k)) n++;
    }
    return n;
  }

  /** Lo que hoy muestra el sitio para un campo: lo guardado, o lo que trae. */
  function valorVigente(campo) {
    var g = guardado[campo.clave];
    if (campo.tipo === "texto") {
      return g && typeof g.texto === "string" ? g.texto : campo.valor;
    }
    if (campo.tipo === "video") {
      return {
        src: (g && g.src) || campo.valor,
        portada: (g && g.portada) || campo.portada,
      };
    }
    return {
      src: (g && g.src) || campo.valor,
      alt: g && typeof g.alt === "string" ? g.alt : campo.alt,
    };
  }

  function marcarEstado() {
    // Se vuelve a armar el desplegable para que aparezca o desaparezca el
    // punto de "sin guardar". Solo el desplegable: tocar los campos mientras
    // alguien escribe le sacaría el cursor de donde está.
    if ($("seccion").options.length) pintarSecciones(agrupar(visibles()));

    var n = cuantosCambios();
    var b = $("b-guardar-contenido");
    b.disabled = n === 0;
    $("estado-contenido").textContent =
      n === 0 ? "Sin cambios sin guardar." :
      n === 1 ? "1 cambio sin guardar." : n + " cambios sin guardar.";

    // La vista se pone al día sola, un rato después de la última tecla: con
    // cada letra seria recargar la pagina entera veinte veces por palabra.
    refrescarVista();
  }

  /* --- Dibujo -------------------------------------------------------------- */

  function filaTexto(campo) {
    var vigente = valorVigente(campo);
    var fila = document.createElement("div");
    fila.className = "campo";

    var etiqueta = document.createElement("span");
    etiqueta.className = "campo-tipo";
    etiqueta.textContent = campo.etiqueta;

    var caja = document.createElement("textarea");
    caja.value = vigente;
    caja.rows = 1;
    caja.spellcheck = true;

    var pie = document.createElement("div");
    pie.className = "campo-pie";

    var volver = document.createElement("button");
    volver.type = "button";
    volver.className = "b-texto";
    volver.textContent = "Volver al original";
    volver.hidden = vigente === campo.valor;

    function revisar() {
      var v = caja.value;
      if (v === campo.valor) {
        // Igual al sitio: si había algo guardado, se borra; si no, no hay nada
        // que hacer.
        if (guardado[campo.clave]) cambios[campo.clave] = null;
        else delete cambios[campo.clave];
      } else {
        var g = guardado[campo.clave];
        if (g && g.texto === v) delete cambios[campo.clave];
        else cambios[campo.clave] = { texto: v };
      }
      volver.hidden = v === campo.valor;
      fila.classList.toggle("tocado", !!cambios[campo.clave] || cambios[campo.clave] === null);
      marcarEstado();
    }

    // El campo crece con lo que tiene adentro. Se mide al dibujar y en cada
    // tecla: un texto largo cortado a dos lineas se edita a ciegas.
    function ajustar() {
      caja.style.height = "auto";
      caja.style.height = caja.scrollHeight + "px";
    }

    caja.addEventListener("input", function () { ajustar(); revisar(); });
    // El alto no se mide acá: el campo todavía no está en la pantalla y la
    // medida sale cualquier cosa. Lo mide ajustarTodos() cuando ya está todo
    // dibujado.
    caja.ajustarAlto = ajustar;
    volver.addEventListener("click", function () {
      caja.value = campo.valor;
      ajustar();
      revisar();
      caja.focus();
    });

    pie.appendChild(volver);
    fila.appendChild(etiqueta);
    fila.appendChild(caja);
    fila.appendChild(pie);
    return fila;
  }

  function filaImagen(campo) {
    var vigente = valorVigente(campo);
    var fila = document.createElement("div");
    fila.className = "campo campo-imagen";

    var etiqueta = document.createElement("span");
    etiqueta.className = "campo-tipo";
    etiqueta.textContent = "Imagen";

    var vista = document.createElement("img");
    vista.className = "campo-vista";
    vista.src = urlImagen(vigente.src);
    vista.alt = "";
    vista.loading = "lazy";

    var derecha = document.createElement("div");

    var archivo = document.createElement("input");
    archivo.type = "file";
    archivo.accept = "image/jpeg,image/png,image/webp,image/avif";

    var rotuloAlt = document.createElement("span");
    rotuloAlt.className = "campo-tipo campo-tipo-interno";
    rotuloAlt.textContent = "Qué se ve en la imagen";

    var alt = document.createElement("input");
    alt.type = "text";
    alt.value = vigente.alt || "";
    alt.placeholder = "Una despensa de barrio, con la dueña en el mostrador";
    // Lo lee quien no puede ver la foto, y tambien Google.
    alt.setAttribute("aria-label", "Qué se ve en la imagen");

    var nota = document.createElement("span");
    nota.className = "campo-ayuda";
    nota.textContent = "Hasta 8 MB. Entra en el mismo hueco que la de ahora.";

    var volver = document.createElement("button");
    volver.type = "button";
    volver.className = "b-texto";
    volver.textContent = "Volver a la original";
    volver.hidden = !guardado[campo.clave];

    function estado(nuevo) {
      var src = nuevo && nuevo.src ? nuevo.src : vigente.src;
      var a = alt.value;
      if (src === campo.valor && a === campo.alt) {
        if (guardado[campo.clave]) cambios[campo.clave] = null;
        else delete cambios[campo.clave];
      } else {
        cambios[campo.clave] = { src: src, alt: a };
      }
      vigente = { src: src, alt: a };
      vista.src = urlImagen(src);
      volver.hidden = src === campo.valor && a === campo.alt;
      fila.classList.toggle("tocado", campo.clave in cambios);
      marcarEstado();
    }

    alt.addEventListener("input", function () { estado(null); });

    archivo.addEventListener("change", function () {
      var f = archivo.files && archivo.files[0];
      if (!f) return;
      if (f.size > 8 * 1024 * 1024) {
        api.avisar("La imagen pesa más de 8 MB. Probá con una más liviana.", "error");
        archivo.value = "";
        return;
      }
      nota.textContent = "Subiendo…";
      subir(f).then(function (r) {
        if (!r.ok) {
          nota.textContent = "No se pudo subir la imagen.";
          archivo.value = "";
          return;
        }
        nota.textContent = "Lista. Se ve en el sitio cuando guardes.";
        estado({ src: r.ruta });
      });
    });

    volver.addEventListener("click", function () {
      archivo.value = "";
      alt.value = campo.alt || "";
      estado({ src: campo.valor });
    });

    derecha.appendChild(archivo);
    derecha.appendChild(rotuloAlt);
    derecha.appendChild(alt);
    derecha.appendChild(nota);
    derecha.appendChild(volver);

    fila.appendChild(etiqueta);
    fila.appendChild(vista);
    fila.appendChild(derecha);
    return fila;
  }

  function filaVideo(campo) {
    var vigente = valorVigente(campo);
    var fila = document.createElement("div");
    fila.className = "campo campo-imagen";

    var etiqueta = document.createElement("span");
    etiqueta.className = "campo-tipo";
    etiqueta.textContent = "Video";

    // Se muestra la portada, no el video: cargar el video entero para una
    // miniatura seria bajarse varios megas cada vez que se abre la pagina.
    var vista = document.createElement("img");
    vista.className = "campo-vista";
    vista.src = urlImagen(vigente.portada);
    vista.alt = "";
    vista.loading = "lazy";

    var derecha = document.createElement("div");

    var rotuloVid = document.createElement("span");
    rotuloVid.className = "campo-tipo campo-tipo-interno";
    rotuloVid.textContent = "El video";

    var archivo = document.createElement("input");
    archivo.type = "file";
    archivo.accept = "video/mp4";

    var rotuloPort = document.createElement("span");
    rotuloPort.className = "campo-tipo campo-tipo-interno";
    rotuloPort.textContent = "La portada (lo que se ve antes de darle play)";

    var portada = document.createElement("input");
    portada.type = "file";
    portada.accept = "image/jpeg,image/png,image/webp";

    var nota = document.createElement("span");
    nota.className = "campo-ayuda";
    nota.textContent = "El video en mp4, hasta 25 MB. Si pesa mas hay que " +
      "comprimirlo: un minuto en vertical deberia andar entre 5 y 10 MB. " +
      "Si cambias el video, cambia tambien la portada.";

    var volver = document.createElement("button");
    volver.type = "button";
    volver.className = "b-texto";
    volver.textContent = "Volver al original";
    volver.hidden = !guardado[campo.clave];

    function igualAlOriginal(v) {
      return v.src === campo.valor && v.portada === campo.portada;
    }

    function estado(nuevo) {
      var v = {
        src: (nuevo && nuevo.src) || vigente.src,
        portada: (nuevo && nuevo.portada) || vigente.portada,
      };
      if (igualAlOriginal(v)) {
        if (guardado[campo.clave]) cambios[campo.clave] = null;
        else delete cambios[campo.clave];
      } else {
        cambios[campo.clave] = { src: v.src, portada: v.portada };
      }
      vigente = v;
      vista.src = urlImagen(v.portada);
      volver.hidden = igualAlOriginal(v);
      fila.classList.toggle("tocado", campo.clave in cambios);
      marcarEstado();
    }

    function tomar(entrada, tope, que, alSubir) {
      entrada.addEventListener("change", function () {
        var f = entrada.files && entrada.files[0];
        if (!f) return;
        if (f.size > tope * 1024 * 1024) {
          api.avisar(que + " pesa mas de " + tope + " MB.", "error");
          entrada.value = "";
          return;
        }
        nota.textContent = "Subiendo " + que.toLowerCase() + "...";
        subir(f).then(function (r) {
          if (!r.ok) {
            nota.textContent = "No se pudo subir " + que.toLowerCase() + ".";
            entrada.value = "";
            return;
          }
          nota.textContent = "Listo. Se ve en el sitio cuando guardes.";
          alSubir(r.ruta);
        });
      });
    }

    tomar(archivo, 25, "El video", function (ruta) { estado({ src: ruta }); });
    tomar(portada, 8, "La portada", function (ruta) { estado({ portada: ruta }); });

    volver.addEventListener("click", function () {
      archivo.value = "";
      portada.value = "";
      estado({ src: campo.valor, portada: campo.portada });
    });

    derecha.appendChild(rotuloVid);
    derecha.appendChild(archivo);
    derecha.appendChild(rotuloPort);
    derecha.appendChild(portada);
    derecha.appendChild(nota);
    derecha.appendChild(volver);

    fila.appendChild(etiqueta);
    fila.appendChild(vista);
    fila.appendChild(derecha);
    return fila;
  }

  /** Dibuja la página elegida, agrupada por sección. */
  /**
   * Las secciones de la página elegida, en el orden en que están en el sitio.
   *
   * Un texto que el sitio repite tiene una sola clave, así que se muestra un
   * solo campo: al guardarlo cambian todas sus copias.
   */
  function agrupar(lista) {
    var orden = [];
    var por = {};
    var claves = {};
    lista.forEach(function (c) {
      if (claves[c.clave]) return;
      claves[c.clave] = 1;
      if (!por[c.seccion]) { por[c.seccion] = []; orden.push(c.seccion); }
      por[c.seccion].push(c);
    });
    return { orden: orden, por: por };
  }

  /** Los campos de esta página que pasan el buscador y la casilla. */
  function visibles() {
    var filtro = ($("buscar").value || "").toLowerCase().trim();
    var todos = $("ver-todo").checked;
    return campos.filter(function (c) {
      if (c.pagina !== paginaActual) return false;
      // Lo principal de cada sección es su título, su bajada y sus fotos. El
      // resto está, pero detrás de la casilla: si no, para cambiar un título
      // hay que pasar por veinte renglones que nadie toca nunca.
      if (!todos && !c.principal) return false;
      if (!filtro) return true;
      var v = c.tipo === "texto" ? c.valor
        : c.tipo === "video" ? "video " + c.valor
        : c.valor + " " + (c.alt || "");
      return v.toLowerCase().indexOf(filtro) !== -1;
    });
  }

  /** ¿Esta sección tiene algo sin guardar? Se marca en el menú. */
  function tieneCambios(lista) {
    return lista.some(function (c) { return c.clave in cambios; });
  }

  /**
   * El selector de secciones.
   *
   * Antes era una columna de veintidós renglones al costado. Ocupaba el lugar
   * donde ahora se ve el sitio, que es lo que de verdad ayuda a saber qué se
   * está tocando. Un desplegable dice lo mismo y no ocupa nada.
   */
  function pintarSecciones(grupos) {
    var sel = $("seccion");
    sel.innerHTML = "";
    grupos.orden.forEach(function (nombre) {
      var o = document.createElement("option");
      o.value = nombre;
      var n = grupos.por[nombre].length;
      // El punto avisa que ahí hay algo sin guardar, sin tener que entrar.
      o.textContent = (tieneCambios(grupos.por[nombre]) ? "● " : "") +
        nombre + " (" + n + ")";
      sel.appendChild(o);
    });
    sel.value = seccionActual;
    if (window.DC_SELECTOR) window.DC_SELECTOR.refrescar(sel);
  }

  /**
   * Da a cada campo el alto de su texto.
   *
   * Se hace después de dibujar y otra vez cuando terminan de cargar las
   * tipografías: medir antes da alturas disparatadas, porque el campo todavía
   * no tiene su ancho definitivo y el texto se parte en veinte renglones.
   */
  function ajustarTodos() {
    var cajas = $("campos").querySelectorAll("textarea");
    for (var i = 0; i < cajas.length; i++) {
      if (cajas[i].ajustarAlto) cajas[i].ajustarAlto();
    }
  }

  function pintar() {
    var lista = visibles();
    var grupos = agrupar(lista);
    var cont = $("campos");
    cont.innerHTML = "";

    if (!grupos.orden.length) {
      $("seccion").innerHTML = "";
      var vacio = document.createElement("p");
      vacio.className = "intro";
      vacio.textContent = ($("buscar").value || "").trim()
        ? "No hay textos con esas palabras en esta página."
        : "Esta página no tiene textos editables.";
      cont.appendChild(vacio);
      return;
    }

    // Si la sección elegida no está en lo que se ve ahora —se cambió de
    // página, o el buscador la dejó afuera— se pasa a la primera.
    if (grupos.orden.indexOf(seccionActual) === -1) seccionActual = grupos.orden[0];

    pintarSecciones(grupos);

    var titulo = document.createElement("h3");
    titulo.className = "campos-titulo";
    titulo.textContent = seccionActual;
    cont.appendChild(titulo);

    var dela = grupos.por[seccionActual];
    var pie = document.createElement("p");
    pie.className = "campos-cuenta";
    pie.textContent = paginaActual + " · " +
      (dela.length === 1 ? "1 campo" : dela.length + " campos");
    cont.appendChild(pie);

    dela.forEach(function (c) {
      cont.appendChild(
        c.tipo === "imagen" ? filaImagen(c) :
        c.tipo === "video" ? filaVideo(c) : filaTexto(c));
    });

    requestAnimationFrame(ajustarTodos);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(ajustarTodos);
    }
  }

  function pintarPaginas() {
    var sel = $("pagina");
    var vistas = [];
    campos.forEach(function (c) {
      if (vistas.indexOf(c.pagina) === -1) vistas.push(c.pagina);
    });
    sel.innerHTML = "";
    vistas.forEach(function (p) {
      var o = document.createElement("option");
      o.value = p;
      o.textContent = p;
      sel.appendChild(o);
    });
    if (vistas.indexOf(paginaActual) === -1) paginaActual = vistas[0];
    sel.value = paginaActual;
    if (window.DC_SELECTOR) window.DC_SELECTOR.refrescar(sel);
  }

  /* --- La vista del sitio ---------------------------------------------------- */

  /**
   * Da al marco el tamaño de una pantalla y lo achica para que entre.
   *
   * El iframe se dibuja a `anchoVista` píxeles —ahí el sitio cree que está en
   * una computadora o en un teléfono y se arma como corresponde— y después se
   * encoge con una escala. Es la misma página, vista de lejos.
   */
  function ajustarVista() {
    var marco = document.querySelector(".vista-marco");
    var f = $("vista-sitio");
    if (!marco || !f) return;

    var ancho = marco.clientWidth;
    var alto = marco.clientHeight;
    if (!ancho || !alto) return;

    // En teléfono no se agranda: un teléfono de 390 px estirado a 700 se ve
    // peor que de verdad.
    var escala = Math.min(ancho / anchoVista, anchoVista === ANCHO_TELE ? 1 : 10);

    f.style.width = anchoVista + "px";
    f.style.height = Math.round(alto / escala) + "px";
    f.style.transform = "scale(" + escala + ")";
    // Centrado cuando sobra lugar, que es lo que pasa con el teléfono.
    f.style.marginLeft = Math.max(0, Math.round((ancho - anchoVista * escala) / 2)) + "px";
  }

  function verComo(cual) {
    anchoVista = cual === "tele" ? ANCHO_TELE : ANCHO_COMPU;
    $("v-compu").setAttribute("aria-pressed", cual === "tele" ? "false" : "true");
    $("v-tele").setAttribute("aria-pressed", cual === "tele" ? "true" : "false");
    ajustarVista();
    refrescarVista(0);
  }

  /**
   * Lo que tiene que mostrar la vista: lo guardado, con lo de esta sesión
   * encima. Es lo mismo que vería cualquiera si se guardara ahora.
   */
  function loQueSeVeria() {
    var filas = [];
    var puestas = {};
    for (var k in cambios) {
      if (!Object.prototype.hasOwnProperty.call(cambios, k)) continue;
      puestas[k] = 1;
      if (cambios[k] !== null) filas.push({ clave: k, valor: cambios[k] });
    }
    for (var g in guardado) {
      if (!Object.prototype.hasOwnProperty.call(guardado, g)) continue;
      if (!puestas[g]) filas.push({ clave: g, valor: guardado[g] });
    }
    return {
      config: api.config ? api.config() : null,
      contenido: filas,
      anuncios: api.anuncios ? api.anuncios() : null,
    };
  }

  /**
   * Lleva la vista hasta la sección que se está editando.
   *
   * Se busca por el título, que es lo único que existe igual en la plantilla
   * y en la página ya dibujada. Las portadas son el principio de la página,
   * así que para esas alcanza con ir arriba.
   */
  function llevarA(doc, seccion) {
    try {
      if (/^Portada /.test(seccion)) {
        doc.defaultView.scrollTo(0, 0);
        return;
      }
      var destino = null;
      if (seccion === "Cinta de beneficios") {
        destino = doc.querySelector(".dcx-cinta");
      } else {
        // El título puede venir cortado con puntos suspensivos.
        var busca = seccion.replace(/…$/, "").slice(0, 46);
        var titulos = doc.querySelectorAll("h1, h2");
        for (var i = 0; i < titulos.length; i++) {
          if (titulos[i].textContent.replace(/\s+/g, " ").trim().indexOf(busca) === 0) {
            destino = titulos[i];
            break;
          }
        }
      }
      if (destino) {
        // Un poco más arriba del título: el sitio tiene su propio encabezado
        // pegado arriba y, sin este margen, tapa justo lo que se vino a ver.
        var y = destino.getBoundingClientRect().top + doc.defaultView.scrollY - 76;
        doc.defaultView.scrollTo(0, Math.max(0, y));
      } else {
        doc.defaultView.scrollTo(0, 0);
      }
    } catch (e) {
      /* la vista es una ayuda: si no se puede, no pasa nada */
    }
  }

  /**
   * Vuelve a cargar la vista con lo que hay en pantalla.
   *
   * Se recarga entera en vez de tocarle el texto por dentro: así lo que se ve
   * pasa por el mismo camino que el sitio de verdad —el mismo dc-config, el
   * mismo runtime— y no por una imitación que puede mentir.
   */
  var relojVista = null;
  function refrescarVista(demora) {
    clearTimeout(relojVista);
    relojVista = setTimeout(function () {
      var marco = document.querySelector(".vista-marco");
      var iframe = $("vista-sitio");
      if (!iframe) return;
      try {
        sessionStorage.setItem(CLAVE_VISTA, JSON.stringify(loQueSeVeria()));
      } catch (e) {
        /* sin sessionStorage la vista muestra el sitio tal cual está */
      }
      var ruta = window.DC_CONTENIDO.rutas[paginaActual] || "";
      var seccion = seccionActual;
      if (marco) marco.classList.add("cargando");
      iframe.onload = function () {
        if (marco) marco.classList.remove("cargando");
        // El runtime dibuja después de cargar; se le da ese momento.
        setTimeout(function () {
          try { llevarA(iframe.contentDocument, seccion); } catch (e) {}
        }, 700);
      };
      ajustarVista();
      iframe.src = "../index.html?dcvista=1&t=" + Date.now() +
        (ruta ? "#/" + ruta.replace(/^\//, "") : "");
    }, demora === undefined ? 600 : demora);
  }

  /* --- Subida de imágenes --------------------------------------------------- */

  function subir(archivo) {
    // Nombre único: reusar el nombre dejaría la foto vieja en el caché de un
    // año que el sitio tiene para imágenes.
    var ext = (archivo.name.split(".").pop() || "jpg").toLowerCase();
    var nombre = "contenido/" + Date.now() + "-" +
      Math.random().toString(36).slice(2, 8) + "." + ext;
    return fetch(API + "/storage/v1/object/" + BUCKET + "/" + nombre, {
      method: "POST",
      headers: {
        apikey: api.anon(),
        Authorization: "Bearer " + api.sesion().access_token,
        "Content-Type": archivo.type || "application/octet-stream",
        "x-upsert": "false",
      },
      body: archivo,
    }).then(function (r) {
      return r.ok ? { ok: true, ruta: nombre } : { ok: false, estado: r.status };
    }).catch(function () {
      return { ok: false, estado: 0 };
    });
  }

  /* --- Carga y guardado ----------------------------------------------------- */

  /** Se baja la página del sitio y la lee con el mismo recorrido que el sitio. */
  function cargarCampos() {
    return fetch("../index.html", { cache: "no-store" })
      .then(function (r) {
        if (!r.ok) throw new Error("no se pudo leer el sitio");
        return r.text();
      })
      .then(function (txt) {
        var doc = new DOMParser().parseFromString(txt, "text/html");
        var raiz = doc.querySelector("x-dc");
        if (!raiz) throw new Error("el sitio no tiene plantilla");
        campos = window.DC_CONTENIDO.recorrer(raiz);
        return true;
      });
  }

  function cargarGuardado() {
    return api.pedir("/rest/v1/contenido?select=clave,valor", {
      headers: { "Accept-Profile": SCHEMA },
    }).then(function (r) {
      guardado = {};
      if (r.ok && r.datos && r.datos.length) {
        r.datos.forEach(function (f) { guardado[f.clave] = f.valor; });
      }
      return r.ok;
    });
  }

  function guardar() {
    var nuevos = [];
    var borrar = [];
    for (var k in cambios) {
      if (!Object.prototype.hasOwnProperty.call(cambios, k)) continue;
      if (cambios[k] === null) borrar.push(k);
      else nuevos.push({ clave: k, valor: cambios[k] });
    }

    var pasos = [];

    if (nuevos.length) {
      pasos.push(
        api.pedir("/rest/v1/contenido?on_conflict=clave", {
          method: "POST",
          headers: {
            "Content-Profile": SCHEMA,
            "Content-Type": "application/json",
            Prefer: "resolution=merge-duplicates,return=representation",
          },
          body: JSON.stringify(nuevos),
        }).then(function (r) {
          // Igual que en Configuración: PostgREST contesta 200 con una lista
          // vacía cuando el RLS no deja escribir. Sin esto el panel diría
          // "Guardado" sin haber guardado nada.
          if (r.ok && (!r.datos || r.datos.length !== nuevos.length)) {
            return { ok: false, estado: 403, datos: null };
          }
          return r;
        })
      );
    }

    if (borrar.length) {
      var lista = borrar.map(function (c) { return '"' + c + '"'; }).join(",");
      pasos.push(
        api.pedir("/rest/v1/contenido?clave=in.(" + lista + ")", {
          method: "DELETE",
          headers: { "Content-Profile": SCHEMA, Prefer: "return=representation" },
        })
      );
    }

    return Promise.all(pasos).then(function (rs) {
      var malo = rs.filter(function (r) { return !r.ok; })[0];
      if (malo) return malo;

      // Lo guardado pasa a ser lo vigente, y la pantalla queda limpia sin
      // volver a bajarse nada.
      nuevos.forEach(function (n) { guardado[n.clave] = n.valor; });
      borrar.forEach(function (c) { delete guardado[c]; });
      cambios = {};
      return { ok: true, estado: 200 };
    });
  }

  /* --- Entrada ------------------------------------------------------------- */

  /** panel.js llama acá una vez que la sesión está abierta y es de admin. */
  function arrancar(puente) {
    api = puente;
    if (window.DC_SELECTOR) {
      window.DC_SELECTOR.mejorar($("pagina"));
      window.DC_SELECTOR.mejorar($("seccion"));
    }

    return Promise.all([cargarCampos(), cargarGuardado()]).then(function () {
      pintarPaginas();
      pintar();
      marcarEstado();

      $("pagina").addEventListener("change", function () {
        paginaActual = $("pagina").value;
        seccionActual = null;
        pintar();
        refrescarVista(0);
      });

      $("seccion").addEventListener("change", function () {
        seccionActual = $("seccion").value;
        pintar();
        refrescarVista(0);
      });

      $("b-refrescar").addEventListener("click", function () { refrescarVista(0); });
      $("v-compu").addEventListener("click", function () { verComo("compu"); });
      $("v-tele").addEventListener("click", function () { verComo("tele"); });

      // Si cambia el tamaño de la ventana, la escala deja de servir.
      var relojTam = null;
      window.addEventListener("resize", function () {
        clearTimeout(relojTam);
        relojTam = setTimeout(ajustarVista, 150);
      });

      var reloj = null;
      $("buscar").addEventListener("input", function () {
        clearTimeout(reloj);
        reloj = setTimeout(pintar, 180);
      });

      $("ver-todo").addEventListener("change", pintar);

      // Desde un teléfono, mostrar la pantalla de una computadora achicada a
      // la cuarta parte no sirve de nada: se arranca mostrando el teléfono.
      if (window.innerWidth < 900) verComo("tele");
      else refrescarVista(0);

      $("form-contenido").addEventListener("submit", function (ev) {
        ev.preventDefault();
        var b = $("b-guardar-contenido");
        b.disabled = true;
        b.textContent = "Guardando…";
        guardar().then(function (r) {
          b.textContent = "Guardar cambios";
          if (!r.ok) {
            api.avisar("No se guardó: " + api.explicar(r.estado, r.datos), "error");
            b.disabled = false;
            return;
          }
          api.avisar("Guardado. En el sitio se ve dentro de unos minutos.", "ok");
          pintar();
          marcarEstado();
        });
      });
    });
  }

  window.DC_PANEL_CONTENIDO = { arrancar: arrancar };
})();
