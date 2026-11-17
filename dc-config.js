/**
 * Trae del panel los datos editables del sitio y los deja puestos antes de que
 * el runtime dibuje nada.
 *
 * Por qué así y no de otra forma
 * ------------------------------
 * El sitio guarda sus datos de contacto como "props" dentro del atributo
 * data-props de la etiqueta <script data-dc-script>. El runtime lee ese
 * atributo una sola vez, al arrancar, y de ahí sale todo: el pie, la página de
 * contacto, la jurídica y —lo que más importa acá— el enlace del botón
 * flotante de WhatsApp, que se arma con el teléfono.
 *
 * Entonces alcanza con cambiar ese atributo ANTES de que el runtime lo lea, y
 * el número nuevo aparece en los diez lugares donde está, sin tocar ninguno.
 * Por eso este archivo también se encarga de cargar support.js: si support.js
 * siguiera en el <head>, arrancaría antes y leería los valores viejos.
 *
 * Qué pasa si Supabase no responde
 * --------------------------------
 * El sitio carga igual, con los valores que trae escritos. Esa es la regla:
 * el panel puede estar caído, la red puede fallar, y la página de una empresa
 * tiene que seguir mostrando su teléfono. Por eso hay un tiempo máximo de
 * espera y, pasado ese, se sigue sin esperar más.
 *
 * El caché
 * --------
 * La respuesta se guarda en localStorage. En la segunda visita los valores ya
 * están y no hay que esperar nada; igual se vuelve a pedir en segundo plano
 * para que la próxima vez esté fresco. Sin el caché, cada visita pagaría el
 * viaje de ida y vuelta.
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

  var CLAVE = "dc.config.v1";
  var FRESCO = 5 * 60 * 1000; // 5 minutos
  var ESPERA_MAX = 1200; // ms que el sitio acepta esperar al panel

  /** Columna de la tabla -> prop que usa el sitio. */
  var MAPA = {
    telefono: "phone",
    correo: "email",
    domicilio: "domicilio",
    horario: "horario",
    instagram: "urlInstagram",
    facebook: "urlFacebook",
  };

  /** URL pública de una imagen del bucket, a partir de su ruta. */
  function urlImagen(ruta) {
    if (!ruta) return null;
    if (/^https?:/i.test(ruta)) return ruta;
    return API + "/storage/v1/object/public/" + BUCKET + "/" + ruta;
  }

  /**
   * Escribe los valores dentro del atributo data-props.
   *
   * El atributo es un JSON donde cada prop es un objeto con su `default`. Se
   * cambia solo ese `default` y se deja el resto intacto: el editor que generó
   * esto guarda ahí el tipo y la sección, y perderlos rompería el archivo
   * fuente.
   */
  function aplicar(cfg) {
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

    // La portada no es una prop: es el src de la primera foto del carrusel.
    var portada = urlImagen(cfg.portada_imagen);
    if (portada) {
      var img = document.querySelector(".dcx-port .dcx-portada2-foto img");
      if (img) {
        img.setAttribute("src", portada);
        if (cfg.portada_imagen_alt) img.setAttribute("alt", cfg.portada_imagen_alt);
      }
    }

    return cambio;
  }

  /** Arranca el runtime. Se llama una sola vez, pase lo que pase. */
  var arrancado = false;
  function arrancarRuntime() {
    if (arrancado) return;
    arrancado = true;
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

  function pedir() {
    return fetch(
      API + "/rest/v1/configuracion?select=*&limit=1",
      {
        headers: {
          apikey: ANON,
          Authorization: "Bearer " + ANON,
          "Accept-Profile": SCHEMA,
        },
        cache: "no-store",
      }
    )
      .then(function (r) {
        return r.ok ? r.json() : null;
      })
      .then(function (filas) {
        return filas && filas.length ? filas[0] : null;
      })
      .catch(function () {
        return null;
      });
  }

  // El pedido arranca acá, lo antes posible, en paralelo con el resto de la
  // carga de la página.
  var pedido = pedir();

  function listo() {
    var cache = leerCache();
    var fresco = cache && Date.now() - cache.en < FRESCO;

    // Con caché fresco no se espera a nadie: se usa y se arranca.
    if (fresco) {
      aplicar(cache.datos);
      arrancarRuntime();
      pedido.then(function (cfg) {
        if (cfg) guardarCache(cfg);
      });
      return;
    }

    // Sin caché fresco se espera, pero poco.
    var reloj = setTimeout(function () {
      if (cache) aplicar(cache.datos);
      arrancarRuntime();
    }, ESPERA_MAX);

    pedido.then(function (cfg) {
      clearTimeout(reloj);
      if (cfg) {
        guardarCache(cfg);
        aplicar(cfg);
      } else if (cache) {
        aplicar(cache.datos);
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
