/**
 * Trae del panel lo que el sitio tiene editable y lo deja puesto antes de que
 * el runtime dibuje nada.
 *
 * Son dos cosas distintas:
 *
 *   - la configuración: teléfono, correo, dirección, horario y redes. Van a
 *     las "props" del runtime, dentro del atributo data-props. El runtime lee
 *     ese atributo una sola vez, al arrancar, y de ahí sale todo: el pie, la
 *     página de contacto, la jurídica y el enlace del botón flotante de
 *     WhatsApp. Cambiándolo acá, el número nuevo aparece en los diez lugares
 *     donde está sin tocar ninguno.
 *
 *   - el contenido: los textos y las imágenes de cada sección. Se escriben
 *     sobre la plantilla, que el runtime también lee una sola vez. Quién es
 *     cada texto lo decide dc-contenido.js, que es el mismo archivo con el
 *     que el panel arma su formulario.
 *
 * Por eso este archivo carga support.js: si support.js siguiera en el <head>
 * arrancaría antes y leería los valores viejos.
 *
 * Qué pasa si Supabase no responde
 * --------------------------------
 * El sitio carga igual, con lo que trae escrito. Esa es la regla: el panel
 * puede estar caído, la red puede fallar, y la página de una empresa tiene
 * que seguir mostrando su teléfono. Por eso hay un tiempo máximo de espera y,
 * pasado ese, se sigue sin esperar más.
 *
 * El caché
 * --------
 * La respuesta queda en localStorage. En la segunda visita los valores ya
 * están y no hay que esperar nada; igual se vuelve a pedir en segundo plano
 * para que la próxima vez esté fresco.
 */
(function () {
  "use strict";

  var API = "https://api.neura.com.py";
  // Clave pública: va en el navegador a propósito. Lo que protege los datos no
  // es esconderla, es el RLS del schema.
  var ANON =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
    "eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzc0MTAxNDYxLCJleHAiOjE5MzE3ODE0NjF9." +
    "7_wAph8IolPMXtgfpezSwS5XR62IdD__qhqCywLDp3Q";
  var SCHEMA = "donacompraweb";
  var BUCKET = "donacompraweb";

  var CLAVE = "dc.datos.v2";
  var FRESCO = 5 * 60 * 1000; // 5 minutos
  var ESPERA_MAX = 1200; // ms que el sitio acepta esperar al panel

  /** Columna de configuracion -> prop que usa el sitio. */
  var MAPA = {
    telefono: "phone",
    correo: "email",
    domicilio: "domicilio",
    horario: "horario",
    instagram: "urlInstagram",
    facebook: "urlFacebook",
  };

  /**
   * Dirección de una imagen.
   *
   * Las que suben desde el panel se guardan como ruta dentro del bucket y
   * siempre empiezan con "contenido/": el día que cambie el dominio de
   * Supabase no hay que reescribir ninguna fila. Cualquier otra cosa es una
   * ruta del propio sitio (assets/, video/) y se deja como está.
   */
  function urlImagen(ruta) {
    if (!ruta) return null;
    if (ruta.indexOf("contenido/") === 0) {
      return API + "/storage/v1/object/public/" + BUCKET + "/" + ruta;
    }
    return ruta;
  }

  /**
   * Escribe la configuración dentro del atributo data-props.
   *
   * El atributo es un JSON donde cada prop es un objeto con su `default`. Se
   * cambia solo ese `default` y se deja el resto intacto: ahí está guardado el
   * tipo y la sección de cada prop, y perderlos rompería el archivo fuente.
   */
  function aplicarConfig(cfg) {
    if (!cfg) return false;
    var el = document.querySelector("script[data-dc-script]");
    if (!el) return false;
    var crudo = el.getAttribute("data-props");
    if (!crudo) return false;

    var props;
    try {
      props = JSON.parse(crudo);
    } catch (e) {
      return false;
    }

    var cambio = false;
    for (var columna in MAPA) {
      if (!Object.prototype.hasOwnProperty.call(MAPA, columna)) continue;
      var valor = cfg[columna];
      var prop = props[MAPA[columna]];
      // Vacío y nulo no pisan: si el panel todavía no tiene un dato, vale más
      // lo que el sitio ya trae escrito que dejar un hueco.
      if (!prop || valor === null || valor === undefined || valor === "") continue;
      if (prop.default !== valor) {
        prop.default = valor;
        cambio = true;
      }
    }

    if (cambio) el.setAttribute("data-props", JSON.stringify(props));
    return cambio;
  }

  /** Escribe los textos e imágenes editados sobre la plantilla. */
  function aplicarContenido(filas) {
    if (!filas || !filas.length) return 0;
    if (!window.DC_CONTENIDO) return 0;
    var raiz = document.querySelector("x-dc");
    if (!raiz) return 0;

    var mapa = {};
    for (var i = 0; i < filas.length; i++) mapa[filas[i].clave] = filas[i].valor;

    try {
      return window.DC_CONTENIDO.aplicar(raiz, mapa, urlImagen);
    } catch (e) {
      // Un contenido raro no puede dejar la página en blanco: se sigue con lo
      // que el sitio trae escrito.
      return 0;
    }
  }

  /** Arranca el runtime. Se llama una sola vez, pase lo que pase. */
  var arrancado = false;
  function arrancarRuntime() {
    if (arrancado) return;
    arrancado = true;
    // Sin esto, el runtime vuelve a pedir el archivo por la red y reemplaza la
    // plantilla con el texto del archivo, borrando lo que acabamos de
    // escribir. Ese segundo pedido existe para los casos en que el runtime no
    // tiene los recursos a mano; __resources es la forma que él mismo tiene
    // de decir "ya los tengo". Como buscar una dirección en un mapa vacío
    // siempre falla, todo lo demás sigue cargando por la red igual que antes.
    if (!window.__resources) window.__resources = {};
    var s = document.createElement("script");
    s.src = "./support.js";
    s.async = false;
    document.head.appendChild(s);
  }

  function leerCache() {
    try {
      var c = JSON.parse(localStorage.getItem(CLAVE) || "null");
      if (c && c.datos && typeof c.en === "number") return c;
    } catch (e) {
      /* localStorage puede estar bloqueado; no es motivo para no cargar */
    }
    return null;
  }

  function guardarCache(datos) {
    try {
      localStorage.setItem(CLAVE, JSON.stringify({ en: Date.now(), datos: datos }));
    } catch (e) {
      /* lleno o bloqueado: da igual, es solo un atajo */
    }
  }

  function traer(ruta) {
    return fetch(API + "/rest/v1/" + ruta, {
      headers: {
        apikey: ANON,
        Authorization: "Bearer " + ANON,
        "Accept-Profile": SCHEMA,
      },
      cache: "no-store",
    })
      .then(function (r) {
        return r.ok ? r.json() : null;
      })
      .catch(function () {
        return null;
      });
  }

  /** Las dos consultas salen juntas y a la vez que el resto de la carga. */
  var pedido = Promise.all([
    traer("configuracion?select=*&limit=1"),
    traer("contenido?select=clave,valor"),
  ]).then(function (r) {
    var cfg = r[0] && r[0].length ? r[0][0] : null;
    var cont = r[1] || null;
    // Si las dos fallaron no hay nada que guardar; media respuesta sí sirve.
    if (!cfg && !cont) return null;
    return { config: cfg, contenido: cont };
  });

  function aplicarTodo(datos) {
    if (!datos) return;
    aplicarConfig(datos.config);
    // Queda a la vista cuántos campos se aplicaron: es lo primero que uno
    // quiere saber cuando un texto del panel no aparece en el sitio.
    window.__dcAplicados = aplicarContenido(datos.contenido);
  }

  function listo() {
    var cache = leerCache();
    var fresco = cache && Date.now() - cache.en < FRESCO;

    // Con caché fresco no se espera a nadie: se usa y se arranca. La consulta
    // sigue en camino y deja el caché listo para la próxima visita.
    if (fresco) {
      aplicarTodo(cache.datos);
      arrancarRuntime();
      pedido.then(function (datos) {
        if (datos) guardarCache(datos);
      });
      return;
    }

    // Sin caché fresco se espera, pero poco.
    var reloj = setTimeout(function () {
      if (cache) aplicarTodo(cache.datos);
      arrancarRuntime();
    }, ESPERA_MAX);

    pedido.then(function (datos) {
      clearTimeout(reloj);
      if (datos) {
        guardarCache(datos);
        aplicarTodo(datos);
      } else if (cache) {
        aplicarTodo(cache.datos);
      }
      arrancarRuntime();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", listo);
  } else {
    listo();
  }
})();
