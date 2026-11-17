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

  var $ = function (id) { return document.getElementById(id); };

  var campos = [];      // todo lo que encontró el recorrido
  var guardado = {};    // clave -> valor que ya está en la base
  var cambios = {};     // clave -> valor nuevo, o null para volver al original
  var paginaActual = "Inicio";
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
    return {
      src: (g && g.src) || campo.valor,
      alt: g && typeof g.alt === "string" ? g.alt : campo.alt,
    };
  }

  function marcarEstado() {
    // El menú se vuelve a dibujar para que aparezca o desaparezca el punto de
    // "sin guardar". Solo el menú: tocar los campos mientras alguien escribe
    // le sacaría el cursor de donde está.
    if ($("lista-secciones").children.length) pintarMenu(agrupar(visibles()));

    var n = cuantosCambios();
    var b = $("b-guardar-contenido");
    b.disabled = n === 0;
    $("estado-contenido").textContent =
      n === 0 ? "Sin cambios sin guardar." :
      n === 1 ? "1 cambio sin guardar." : n + " cambios sin guardar.";
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
    // Al dibujar, el campo todavia no esta en la pagina y scrollHeight da 0.
    setTimeout(ajustar, 0);
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

    var alt = document.createElement("input");
    alt.type = "text";
    alt.value = vigente.alt || "";
    alt.placeholder = "Qué se ve en la imagen";

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
    derecha.appendChild(alt);
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

  /** Los campos de esta página que pasan el buscador. */
  function visibles() {
    var filtro = ($("buscar").value || "").toLowerCase().trim();
    return campos.filter(function (c) {
      if (c.pagina !== paginaActual) return false;
      if (!filtro) return true;
      var v = c.tipo === "texto" ? c.valor : c.valor + " " + (c.alt || "");
      return v.toLowerCase().indexOf(filtro) !== -1;
    });
  }

  /** ¿Esta sección tiene algo sin guardar? Se marca en el menú. */
  function tieneCambios(lista) {
    return lista.some(function (c) { return c.clave in cambios; });
  }

  /**
   * El menú de secciones.
   *
   * Una página del sitio tiene hasta veintidós secciones y trescientos campos.
   * Puestos uno abajo del otro no se encuentra nada: se elige la sección y se
   * ve esa sola, igual que se mira la página de a pedazos.
   */
  function pintarMenu(grupos) {
    var menu = $("lista-secciones");
    menu.innerHTML = "";
    grupos.orden.forEach(function (nombre) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "seccion-link";
      if (nombre === seccionActual) b.setAttribute("aria-current", "true");

      var t = document.createElement("span");
      t.className = "seccion-nombre";
      t.textContent = nombre;

      var n = document.createElement("span");
      n.className = "seccion-cuenta";
      n.textContent = grupos.por[nombre].length;

      b.appendChild(t);
      b.appendChild(n);

      if (tieneCambios(grupos.por[nombre])) {
        var p = document.createElement("span");
        p.className = "seccion-punto";
        p.title = "Tiene cambios sin guardar";
        b.appendChild(p);
      }

      b.addEventListener("click", function () {
        seccionActual = nombre;
        pintar();
      });
      menu.appendChild(b);
    });
  }

  function pintar() {
    var lista = visibles();
    var grupos = agrupar(lista);
    var menu = $("lista-secciones");
    var cont = $("campos");
    cont.innerHTML = "";

    if (!grupos.orden.length) {
      menu.innerHTML = "";
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

    pintarMenu(grupos);

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
      cont.appendChild(c.tipo === "imagen" ? filaImagen(c) : filaTexto(c));
    });
  }

  function pintarPaginas() {
    var sel = $("pagina");
    var vistas = [];
    campos.forEach(function (c) {
      if (vistas.indexOf(c.pagina) === -1) vistas.push(c.pagina);
    });
    sel.innerHTML = "";
    vistas.forEach(function (p) {
      var cuantos = campos.filter(function (c) { return c.pagina === p; }).length;
      var o = document.createElement("option");
      o.value = p;
      o.textContent = p + " (" + cuantos + ")";
      sel.appendChild(o);
    });
    if (vistas.indexOf(paginaActual) === -1) paginaActual = vistas[0];
    sel.value = paginaActual;
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
    return Promise.all([cargarCampos(), cargarGuardado()]).then(function () {
      pintarPaginas();
      pintar();
      marcarEstado();

      $("pagina").addEventListener("change", function () {
        paginaActual = $("pagina").value;
        pintar();
      });

      var reloj = null;
      $("buscar").addEventListener("input", function () {
        clearTimeout(reloj);
        reloj = setTimeout(pintar, 180);
      });

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
