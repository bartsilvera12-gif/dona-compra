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
  var portadaNueva = null; // ruta en el bucket, mientras no se guarde

  /* --- Utilidades ---------------------------------------------------------- */

  function mostrar(el, texto, clase) {
    el.textContent = texto;
    el.className = "aviso " + clase;
  }
  function esconder(el) { el.className = "aviso oculto"; }

  function urlImagen(ruta) {
    if (!ruta) return null;
    if (/^https?:/i.test(ruta)) return ruta;
    return API + "/storage/v1/object/public/" + BUCKET + "/" + ruta;
  }

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
    $("portada-alt").value = config.portada_imagen_alt || "";
    pintarPortada(config.portada_imagen);
  }

  function pintarPortada(ruta) {
    var caja = $("vista-portada");
    var url = urlImagen(ruta);
    caja.innerHTML = "";
    if (url) {
      var img = document.createElement("img");
      img.src = url;
      img.alt = "";
      caja.appendChild(img);
    } else {
      var s = document.createElement("span");
      s.textContent = "Sin imagen propia: el sitio usa la que trae.";
      caja.appendChild(s);
    }
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
      portada_imagen_alt: $("portada-alt").value.trim() || null,
    };
    // Solo se manda la portada si cambió en esta sesión: así un guardado normal
    // no pisa la imagen por accidente.
    if (portadaNueva !== null) cuerpo.portada_imagen = portadaNueva || null;

    return pedir("/rest/v1/configuracion?id=eq.true", {
      method: "PATCH",
      headers: {
        "Content-Profile": SCHEMA,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(cuerpo),
    });
  }

  /* --- Subida de imagen ---------------------------------------------------- */

  function subir(archivo) {
    // Nombre único: si se reemplaza la portada con el mismo nombre, el caché de
    // un año que tiene el sitio seguiría mostrando la vieja durante meses.
    var ext = (archivo.name.split(".").pop() || "jpg").toLowerCase();
    var nombre = "portada/" + Date.now() + "-" + Math.random().toString(36).slice(2, 8) + "." + ext;
    return fetch(API + "/storage/v1/object/" + BUCKET + "/" + nombre, {
      method: "POST",
      headers: {
        apikey: ANON,
        Authorization: "Bearer " + sesion.access_token,
        "Content-Type": archivo.type || "application/octet-stream",
        "x-upsert": "false",
      },
      body: archivo,
    }).then(function (r) {
      return r.ok ? { ok: true, ruta: nombre } : r.text().then(function (t) {
        return { ok: false, estado: r.status, datos: t };
      });
    }).catch(function () {
      return { ok: false, estado: 0 };
    });
  }

  /* --- Pantallas ----------------------------------------------------------- */

  function mostrarPanel(correo) {
    $("pantalla-acceso").classList.add("oculto");
    $("pantalla-panel").classList.remove("oculto");
    $("quien").textContent = correo || "";
    pintarConfig();
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

    $("b-salir").addEventListener("click", function () {
      olvidarSesion();
      location.reload();
    });

    $("archivo-portada").addEventListener("change", function (ev) {
      var archivo = ev.target.files && ev.target.files[0];
      if (!archivo) return;
      if (archivo.size > 8 * 1024 * 1024) {
        mostrar($("aviso-config"), "La imagen pasa de 8 MB. Achicala y volvé a probar.", "error");
        ev.target.value = "";
        return;
      }
      mostrar($("aviso-config"), "Subiendo la imagen…", "nota");
      subir(archivo).then(function (r) {
        if (!r.ok) {
          mostrar($("aviso-config"), "No se pudo subir: " + explicar(r.estado, r.datos), "error");
          return;
        }
        portadaNueva = r.ruta;
        pintarPortada(r.ruta);
        mostrar($("aviso-config"), "Imagen subida. Falta guardar para que salga en el sitio.", "nota");
      });
    });

    $("b-quitar-portada").addEventListener("click", function () {
      portadaNueva = "";
      pintarPortada(null);
      mostrar($("aviso-config"), "Queda la imagen original. Falta guardar.", "nota");
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
        portadaNueva = null;
        $("archivo-portada").value = "";
        pintarConfig();
        mostrar($("aviso-config"), "Guardado. En el sitio se ve dentro de unos minutos.", "ok");
        $("estado-config").textContent =
          "Último cambio: " + new Date().toLocaleString("es-PY");
      });
    });
  });
})();
