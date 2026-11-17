/**
 * Panel de administración de Doña Compra.
 *
 * Por qué no hay servidor
 * -----------------------
 * El sitio vive en un hosting que sirve archivos y no corre Node. Con Supabase
 * eso no es un problema: el navegador habla directo con la API, Auth se ocupa
 * de la sesión y el RLS del schema decide qué puede hacer cada quien. Que esta
 * página sea pública no da acceso a nada: sin iniciar sesión con una cuenta que
 * tenga rol admin, la base rechaza toda escritura.
 *
 * La clave que está acá abajo es la pública (anon), la misma que ya viaja en el
 * sitio. Está pensada para ir en el navegador.
 *
 * Sin dependencias
 * ----------------
 * No usa supabase-js: son tres llamadas HTTP y traerse una librería entera para
 * eso cuesta más de lo que ahorra, además de atar el panel a una versión. Auth
 * y PostgREST son API REST comunes.
 */
(function () {
  "use strict";

  var API = "https://api.neura.com.py";
  var ANON =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
    "eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzc0MTAxNDYxLCJleHAiOjE5MzE3ODE0NjF9." +
    "7_wAph8IolPMXtgfpezSwS5XR62IdD__qhqCywLDp3Q";
  var SCHEMA = "donacompraweb";
  var BUCKET = "donacompraweb";
  var CLAVE_SESION = "dc.panel.sesion";

  var $ = function (id) { return document.getElementById(id); };
  var sesion = null;
  var config = null;

  /* --- Utilidades ---------------------------------------------------------- */

  function mostrar(el, texto, clase) {
    el.textContent = texto;
    el.className = "aviso " + clase;
  }
  function esconder(el) { el.className = "aviso oculto"; }

  /** Mensaje de error entendible. Nunca el crudo de la API, que no dice nada. */
  function explicar(estado, cuerpo) {
    if (estado === 400 || estado === 401) return "Correo o contraseña incorrectos.";
    if (estado === 403) return "Esa cuenta no tiene permiso de administración.";
    if (estado === 406) {
      return "El schema donacompraweb todavía no está expuesto en la API de Supabase.";
    }
    if (estado === 0) return "No se pudo conectar con el servidor.";
    var m = cuerpo && (cuerpo.message || cuerpo.error_description || cuerpo.msg);
    return m ? String(m) : "Algo salió mal (" + estado + ").";
  }

  function pedir(ruta, opciones) {
    opciones = opciones || {};
    var cab = opciones.headers || {};
    cab.apikey = ANON;
    cab.Authorization = "Bearer " + (sesion ? sesion.access_token : ANON);
    opciones.headers = cab;
    return fetch(API + ruta, opciones).then(function (r) {
      return r.text().then(function (txt) {
        var datos = null;
        try { datos = txt ? JSON.parse(txt) : null; } catch (e) { datos = txt; }
        return { ok: r.ok, estado: r.status, datos: datos };
      });
    }).catch(function () {
      return { ok: false, estado: 0, datos: null };
    });
  }

  /* --- Sesión -------------------------------------------------------------- */

  function guardarSesion(s) {
    sesion = s;
    try { localStorage.setItem(CLAVE_SESION, JSON.stringify(s)); } catch (e) {}
  }
  function olvidarSesion() {
    sesion = null;
    try { localStorage.removeItem(CLAVE_SESION); } catch (e) {}
  }
  function recordarSesion() {
    try {
      var s = JSON.parse(localStorage.getItem(CLAVE_SESION) || "null");
      // Un token vencido no sirve; se descarta en vez de fallar más adelante.
      if (s && s.access_token && s.expires_at && s.expires_at * 1000 > Date.now()) {
        return s;
      }
    } catch (e) {}
    return null;
  }

  function entrar(correo, clave) {
    return fetch(API + "/auth/v1/token?grant_type=password", {
      method: "POST",
      headers: { apikey: ANON, "Content-Type": "application/json" },
      body: JSON.stringify({ email: correo, password: clave }),
    }).then(function (r) {
      return r.json().then(function (d) { return { ok: r.ok, estado: r.status, datos: d }; });
    }).catch(function () {
      return { ok: false, estado: 0, datos: null };
    });
  }

  /**
   * Comprueba que la cuenta sea administradora.
   *
   * No alcanza con haber iniciado sesión: cualquier usuario de Supabase podría
   * hacerlo. Lo que manda es la fila en `miembros` con rol admin, que es lo
   * mismo que mira el RLS. Si no está, se cierra la sesión acá mismo en vez de
   * dejar un panel que no va a poder guardar nada.
   */
  function esAdmin() {
    return pedir("/rest/v1/miembros?select=rol&limit=1", {
      headers: { "Accept-Profile": SCHEMA },
    }).then(function (r) {
      if (!r.ok) return { ok: false, estado: r.estado, datos: r.datos };
      var filas = r.datos || [];
      var admin = filas.some(function (f) { return f.rol === "admin"; });
      return { ok: admin, estado: admin ? 200 : 403 };
    });
  }

  /* --- Configuración ------------------------------------------------------- */

  function cargarConfig() {
    return pedir("/rest/v1/configuracion?select=*&limit=1", {
      headers: { "Accept-Profile": SCHEMA },
    }).then(function (r) {
      if (!r.ok) return r;
      config = (r.datos && r.datos[0]) || null;
      return { ok: !!config, estado: config ? 200 : 404, datos: config };
    });
  }

  function pintarConfig() {
    if (!config) return;
    $("telefono").value = config.telefono || "";
    $("correo-config").value = config.correo || "";
    $("domicilio").value = config.domicilio || "";
    $("zona").value = config.zona || "";
    $("horario").value = config.horario || "";
    $("instagram").value = config.instagram || "";
    $("facebook").value = config.facebook || "";
  }

  function guardar() {
    var cuerpo = {
      telefono: $("telefono").value.trim(),
      correo: $("correo-config").value.trim(),
      domicilio: $("domicilio").value.trim(),
      zona: $("zona").value.trim(),
      horario: $("horario").value.trim(),
      instagram: $("instagram").value.trim(),
      facebook: $("facebook").value.trim(),
    };

    return pedir("/rest/v1/configuracion?id=eq.true", {
      method: "PATCH",
      headers: {
        "Content-Profile": SCHEMA,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(cuerpo),
    }).then(function (r) {
      // PostgREST contesta 200 con una lista vacia cuando el RLS no deja tocar
      // ninguna fila. Sin esto el panel diria "Guardado" sin haber guardado
      // nada, que es la peor forma de fallar: el error pasa a la pagina.
      if (r.ok && (!r.datos || !r.datos.length)) {
        return { ok: false, estado: 403, datos: null };
      }
      return r;
    });
  }

  /* --- Pantallas ----------------------------------------------------------- */

  function mostrarPanel(correo) {
    $("pantalla-acceso").classList.add("oculto");
    $("pantalla-panel").classList.remove("oculto");
    $("quien").textContent = correo || "";
    pintarConfig();
    arrancarContenido();
  }

  /**
   * Arranca el editor de contenido.
   *
   * Se le pasa lo que ya está resuelto acá —la sesión, los pedidos con sus
   * cabeceras, los mensajes de error— en vez de que lo arme de nuevo: así hay
   * un solo lugar donde se decide cómo se habla con Supabase.
   */
  function arrancarContenido() {
    if (!window.DC_PANEL_CONTENIDO || !window.DC_CONTENIDO) {
      mostrar($("aviso-contenido"), "No se pudo cargar el editor de contenido.", "error");
      return;
    }
    window.DC_PANEL_CONTENIDO.arrancar({
      pedir: pedir,
      explicar: explicar,
      anon: function () { return ANON; },
      sesion: function () { return sesion; },
      // Para que la vista previa muestre el telefono y las redes de verdad y
      // no los que vienen escritos en el archivo.
      config: function () { return config; },
      avisar: function (texto, clase) { mostrar($("aviso-contenido"), texto, clase); },
    }).catch(function () {
      mostrar($("aviso-contenido"),
        "No se pudo leer la página del sitio para armar la lista de textos.", "error");
    });
  }

  /** Las dos pestañas. */
  function pestana(cual) {
    var contenido = cual === "contenido";
    $("p-contenido").setAttribute("aria-selected", contenido ? "true" : "false");
    $("p-config").setAttribute("aria-selected", contenido ? "false" : "true");
    $("zona-contenido").hidden = !contenido;
    $("zona-config").hidden = contenido;
  }

  function mostrarAcceso(mensaje) {
    $("pantalla-panel").classList.add("oculto");
    $("pantalla-acceso").classList.remove("oculto");
    if (mensaje) mostrar($("aviso-acceso"), mensaje, "error");
  }

  /* --- Arranque ------------------------------------------------------------ */

  function abrir(correo) {
    return esAdmin().then(function (r) {
      if (!r.ok) {
        olvidarSesion();
        mostrarAcceso(explicar(r.estado, r.datos));
        return;
      }
      return cargarConfig().then(function (c) {
        if (!c.ok) {
          olvidarSesion();
          mostrarAcceso(explicar(c.estado, c.datos));
          return;
        }
        mostrarPanel(correo);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var guardada = recordarSesion();
    if (guardada) {
      sesion = guardada;
      abrir(guardada.user && guardada.user.email);
    }

    $("form-acceso").addEventListener("submit", function (ev) {
      ev.preventDefault();
      esconder($("aviso-acceso"));
      var b = $("b-entrar");
      b.disabled = true;
      b.textContent = "Entrando…";
      entrar($("correo").value.trim(), $("clave").value).then(function (r) {
        b.disabled = false;
        b.textContent = "Entrar";
        if (!r.ok || !r.datos || !r.datos.access_token) {
          mostrar($("aviso-acceso"), explicar(r.estado, r.datos), "error");
          return;
        }
        guardarSesion(r.datos);
        $("clave").value = "";
        abrir(r.datos.user && r.datos.user.email);
      });
    });

    $("p-contenido").addEventListener("click", function () { pestana("contenido"); });
    $("p-config").addEventListener("click", function () { pestana("config"); });

    $("b-salir").addEventListener("click", function () {
      olvidarSesion();
      location.reload();
    });

    $("form-config").addEventListener("submit", function (ev) {
      ev.preventDefault();
      esconder($("aviso-config"));
      var b = $("b-guardar");
      b.disabled = true;
      b.textContent = "Guardando…";
      guardar().then(function (r) {
        b.disabled = false;
        b.textContent = "Guardar cambios";
        if (!r.ok) {
          mostrar($("aviso-config"), "No se guardó: " + explicar(r.estado, r.datos), "error");
          return;
        }
        config = (r.datos && r.datos[0]) || config;
        pintarConfig();
        mostrar($("aviso-config"), "Guardado. En el sitio se ve dentro de unos minutos.", "ok");
        $("estado-config").textContent =
          "Último cambio: " + new Date().toLocaleString("es-PY");
      });
    });
  });
})();
