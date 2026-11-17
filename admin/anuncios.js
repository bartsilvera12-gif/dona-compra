/**
 * Los anuncios del panel.
 *
 * Esto es otra cosa que los textos de la página, y por eso tiene pantalla
 * propia. Un texto se cambia; un anuncio se crea y se borra. Son fichas con
 * fecha, categoría, ciudad y foto, y lo que hace falta es una lista con un
 * «Nuevo» arriba, no un campo perdido entre otros veinte.
 *
 * De dónde salen
 * --------------
 * De la tabla `publicaciones`, que existe desde el primer día. El sitio los
 * lee de ahí: la lista que está escrita dentro de index.html quedó solo como
 * red de seguridad para cuando la base no contesta.
 *
 * Lo que se borra, se borra
 * -------------------------
 * Borrar no se puede deshacer, así que se pregunta antes y se dice qué se va
 * a borrar. La alternativa —esconderlo del sitio sin borrarlo— está ahí al
 * lado, en la casilla, que es lo que casi siempre se quiere de verdad.
 */
(function () {
  "use strict";

  var API = "https://api.neura.com.py";
  var SCHEMA = "donacompraweb";
  var BUCKET = "donacompraweb";

  // Las mismas que ofrece el filtro del sitio.
  var CIUDADES = [
    "Asunción", "Lambaré", "San Lorenzo", "Fernando de la Mora", "Capiatá", "Luque",
  ];

  var $ = function (id) { return document.getElementById(id); };

  var api = null;
  var anuncios = [];
  var editando = null;   // la fila que se está editando, o null si es nuevo
  var imagenNueva = null; // ruta en el bucket, mientras no se guarde

  /* --- Utilidades ---------------------------------------------------------- */

  function urlImagen(ruta) {
    if (!ruta) return "";
    if (/^(https?:)?\/\//i.test(ruta)) return ruta;
    if (ruta.indexOf("contenido/") === 0 || ruta.indexOf("anuncios/") === 0) {
      return API + "/storage/v1/object/public/" + BUCKET + "/" + ruta;
    }
    return "../" + ruta;
  }

  function fechaLinda(f) {
    if (!f) return "";
    var p = String(f).split("-");
    return p.length === 3 ? p[2] + "/" + p[1] + "/" + p[0] : f;
  }

  function guaranies(n) {
    if (!n) return "";
    return "₲ " + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  /** Un nombre corto y sin acentos para la dirección del anuncio. */
  function rotulo(titulo) {
    var t = titulo.normalize ? titulo.normalize("NFD").replace(/[̀-ͯ]/g, "") : titulo;
    t = t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    return t.slice(0, 60) || "anuncio";
  }

  /* --- La lista ------------------------------------------------------------- */

  function pintarLista() {
    var cont = $("lista-anuncios");
    cont.innerHTML = "";

    if (!anuncios.length) {
      var p = document.createElement("p");
      p.className = "intro";
      p.textContent = "Todavía no hay anuncios. Con «Nuevo anuncio» cargás el primero.";
      cont.appendChild(p);
      return;
    }

    anuncios.forEach(function (a) {
      var fila = document.createElement("div");
      fila.className = "anuncio";

      var img = document.createElement("img");
      img.src = urlImagen(a.imagen);
      img.alt = "";
      img.loading = "lazy";

      var datos = document.createElement("div");
      datos.className = "anuncio-datos";

      var t = document.createElement("div");
      t.className = "anuncio-titulo";
      t.textContent = a.titulo;
      if (a.estado !== "publicada") {
        var tag = document.createElement("span");
        tag.className = "anuncio-oculto";
        tag.textContent = "No se muestra";
        t.appendChild(tag);
      }

      var pie = document.createElement("div");
      pie.className = "anuncio-pie";
      pie.textContent = [
        a.categoria, a.ciudad, fechaLinda(a.fecha), guaranies(a.precio),
      ].filter(Boolean).join(" · ");

      datos.appendChild(t);
      datos.appendChild(pie);

      var editar = document.createElement("button");
      editar.type = "button";
      editar.className = "b-texto";
      editar.textContent = "Editar";
      editar.addEventListener("click", function () { abrir(a); });

      fila.appendChild(img);
      fila.appendChild(datos);
      fila.appendChild(editar);
      cont.appendChild(fila);
    });
  }

  /* --- El editor ------------------------------------------------------------ */

  function abrir(a) {
    editando = a || null;
    imagenNueva = null;

    $("editor-titulo").textContent = a ? "Editar anuncio" : "Nuevo anuncio";
    $("a-titulo").value = a ? a.titulo : "";
    $("a-texto").value = a ? a.texto : "";
    $("a-categoria").value = a ? a.categoria : "Novedades";
    $("a-ciudad").value = a ? a.ciudad : CIUDADES[0];
    $("a-fecha").value = a ? a.fecha : new Date().toISOString().slice(0, 10);
    $("a-precio").value = a ? a.precio : 0;
    $("a-autor").value = a ? a.autor : "Doña Compra";
    $("a-tipo").value = a ? a.tipo : "foto";
    $("a-video").value = a && a.video_url ? a.video_url : "";
    $("a-alt").value = a && a.imagen_alt ? a.imagen_alt : "";
    $("a-publicado").checked = a ? a.estado === "publicada" : true;
    $("a-archivo").value = "";
    // Sin src, y no con src vacio: un src vacio apunta a la propia pagina y
    // el navegador dibuja el icono de imagen rota.
    if (a && a.imagen) $("a-vista").src = urlImagen(a.imagen);
    else $("a-vista").removeAttribute("src");
    $("a-ayuda-img").textContent = "Hasta 8 MB. Se recorta en forma apaisada.";
    $("b-borrar").classList.toggle("oculto", !a);
    // Los desplegables propios no se enteran de un cambio de valor hecho
    // desde el codigo, asi que se les avisa.
    if (window.DC_SELECTOR) {
      ["a-categoria", "a-ciudad", "a-tipo"].forEach(function (id) {
        window.DC_SELECTOR.refrescar($(id));
      });
    }
    verVideo();

    $("editor-anuncio").classList.remove("oculto");
    $("editor-anuncio").scrollIntoView({ block: "nearest" });
    $("a-titulo").focus();
  }

  function cerrar() {
    editando = null;
    imagenNueva = null;
    $("editor-anuncio").classList.add("oculto");
  }

  function verVideo() {
    $("campo-video").classList.toggle("oculto", $("a-tipo").value !== "video");
  }

  /* --- Hablar con la base ---------------------------------------------------- */

  function cargar() {
    return api.pedir(
      "/rest/v1/publicaciones?select=*&order=fecha.desc",
      { headers: { "Accept-Profile": SCHEMA } }
    ).then(function (r) {
      if (!r.ok) return r;
      anuncios = r.datos || [];
      pintarLista();
      return r;
    });
  }

  function subir(archivo) {
    var ext = (archivo.name.split(".").pop() || "jpg").toLowerCase();
    var nombre = "anuncios/" + Date.now() + "-" +
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

  function cuerpo() {
    return {
      titulo: $("a-titulo").value.trim(),
      texto: $("a-texto").value.trim(),
      categoria: $("a-categoria").value,
      ciudad: $("a-ciudad").value,
      fecha: $("a-fecha").value,
      precio: parseInt($("a-precio").value, 10) || 0,
      autor: $("a-autor").value.trim() || "Doña Compra",
      tipo: $("a-tipo").value,
      video_url: $("a-tipo").value === "video" ? ($("a-video").value.trim() || null) : null,
      imagen_alt: $("a-alt").value.trim() || null,
      estado: $("a-publicado").checked ? "publicada" : "archivada",
    };
  }

  /**
   * Guarda, y si el nombre corto ya existe prueba con otro.
   *
   * Dos anuncios pueden llamarse igual —«Nueva zona de cobertura» pasa todos
   * los meses— y el nombre corto tiene que ser único. En vez de hacerle
   * inventar uno a quien escribe, se le agrega un número acá.
   */
  function crear(datos, intento) {
    intento = intento || 1;
    var slug = rotulo(datos.titulo) + (intento > 1 ? "-" + intento : "");
    var fila = {};
    for (var k in datos) {
      if (Object.prototype.hasOwnProperty.call(datos, k)) fila[k] = datos[k];
    }
    fila.slug = slug;
    fila.imagen = imagenNueva;

    return api.pedir("/rest/v1/publicaciones", {
      method: "POST",
      headers: {
        "Content-Profile": SCHEMA,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(fila),
    }).then(function (r) {
      var repetido = r.estado === 409 ||
        (r.datos && String(r.datos.message || "").indexOf("publicaciones_slug_key") !== -1);
      if (repetido && intento < 20) return crear(datos, intento + 1);
      if (r.ok && (!r.datos || !r.datos.length)) {
        return { ok: false, estado: 403, datos: null };
      }
      return r;
    });
  }

  function actualizar(datos) {
    if (imagenNueva) datos.imagen = imagenNueva;
    return api.pedir("/rest/v1/publicaciones?id=eq." + encodeURIComponent(editando.id), {
      method: "PATCH",
      headers: {
        "Content-Profile": SCHEMA,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(datos),
    }).then(function (r) {
      // Igual que en el resto del panel: una lista vacía quiere decir que el
      // RLS no dejó escribir, no que salió bien.
      if (r.ok && (!r.datos || !r.datos.length)) {
        return { ok: false, estado: 403, datos: null };
      }
      return r;
    });
  }

  function borrar() {
    return api.pedir("/rest/v1/publicaciones?id=eq." + encodeURIComponent(editando.id), {
      method: "DELETE",
      headers: { "Content-Profile": SCHEMA, Prefer: "return=representation" },
    });
  }

  /* --- Entrada --------------------------------------------------------------- */

  function arrancar(puente) {
    api = puente;

    var sel = $("a-ciudad");
    sel.innerHTML = "";
    CIUDADES.forEach(function (c) {
      var o = document.createElement("option");
      o.value = c; o.textContent = c;
      sel.appendChild(o);
    });

    if (window.DC_SELECTOR) {
      ["a-categoria", "a-ciudad", "a-tipo"].forEach(function (id) {
        window.DC_SELECTOR.mejorar($(id));
      });
    }

    $("b-nuevo").addEventListener("click", function () { abrir(null); });
    $("b-cancelar").addEventListener("click", cerrar);
    $("a-tipo").addEventListener("change", verVideo);

    $("a-archivo").addEventListener("change", function () {
      var f = $("a-archivo").files && $("a-archivo").files[0];
      if (!f) return;
      if (f.size > 8 * 1024 * 1024) {
        $("a-ayuda-img").textContent = "La imagen pesa más de 8 MB. Probá con una más liviana.";
        $("a-archivo").value = "";
        return;
      }
      $("a-ayuda-img").textContent = "Subiendo…";
      subir(f).then(function (r) {
        if (!r.ok) {
          $("a-ayuda-img").textContent = "No se pudo subir la imagen.";
          $("a-archivo").value = "";
          return;
        }
        imagenNueva = r.ruta;
        $("a-vista").src = urlImagen(r.ruta);
        $("a-ayuda-img").textContent = "Lista. Falta guardar.";
      });
    });

    $("b-borrar").addEventListener("click", function () {
      if (!editando) return;
      var seguro = window.confirm(
        "Se va a borrar «" + editando.titulo + "».\n\n" +
        "Esto no se puede deshacer. Si solo querés sacarlo del sitio, " +
        "destildá «Mostrarlo en el sitio» y guardá."
      );
      if (!seguro) return;
      borrar().then(function (r) {
        if (!r.ok) {
          api.avisar("No se pudo borrar: " + api.explicar(r.estado, r.datos), "error");
          return;
        }
        api.avisar("Anuncio borrado.", "ok");
        cerrar();
        cargar();
      });
    });

    $("editor-anuncio").addEventListener("submit", function (ev) {
      ev.preventDefault();
      var b = $("b-guardar-anuncio");

      if (!editando && !imagenNueva) {
        api.avisar("Falta la imagen del anuncio.", "error");
        return;
      }

      b.disabled = true;
      b.textContent = "Guardando…";
      var datos = cuerpo();
      var tarea = editando ? actualizar(datos) : crear(datos);

      tarea.then(function (r) {
        b.disabled = false;
        b.textContent = "Guardar";
        if (!r.ok) {
          api.avisar("No se guardó: " + api.explicar(r.estado, r.datos), "error");
          return;
        }
        api.avisar(
          (editando ? "Anuncio guardado." : "Anuncio creado.") +
          " En el sitio se ve dentro de unos minutos.", "ok");
        cerrar();
        cargar();
      });
    });

    return cargar().then(function (r) {
      if (!r.ok) {
        api.avisar("No se pudieron leer los anuncios: " +
          api.explicar(r.estado, r.datos), "error");
      }
    });
  }

  window.DC_PANEL_ANUNCIOS = {
    arrancar: arrancar,
    // Para la vista previa del editor de textos: ahi tiene que verse la
    // pagina de anuncios como la ve cualquiera, no la lista de ejemplo que
    // trae el archivo.
    publicados: function () {
      return anuncios.filter(function (a) { return a.estado === "publicada"; });
    },
  };
})();
