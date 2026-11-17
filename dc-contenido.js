/**
 * Recorrido del contenido editable del sitio.
 *
 * Este archivo lo usan los dos lados y por eso existe:
 *
 *   - el sitio, para aplicar lo que se guardó en el panel;
 *   - el panel, para armar el formulario leyendo la página de verdad.
 *
 * Si cada lado tuviera su propia lista de campos, el día que alguien agrega un
 * párrafo al sitio el panel seguiría mostrando la lista vieja y nadie se
 * enteraría. Con un solo recorrido eso no puede pasar: el panel no tiene una
 * lista de campos, los descubre.
 *
 * Qué es un campo
 * ---------------
 * Cada trozo de texto suelto de la página y cada imagen. Trozo de texto suelto
 * quiere decir nodo de texto, no elemento: el título de la portada tiene una
 * parte en ocre dentro de un <span>, y tomando elementos enteros habría que
 * editar el HTML para no perder ese color. Tomando nodos de texto, el título
 * aparece como dos campos —el texto y la parte destacada— y la forma del
 * diseño no se toca nunca.
 *
 * Se saltan los textos con {{ }}: esos son los datos que ya vienen de
 * Configuración (el teléfono, el correo), y escribirlos acá los congelaría.
 *
 * La clave
 * --------
 * No es la posición. Es la sección más el texto original:
 *
 *     <huella de la sección>-<huella del texto original>
 *
 * Así, agregar o mover un párrafo en el sitio no corre las claves de los
 * demás, que es lo que pasaría con un número de orden. Y si alguien cambia en
 * el sitio un texto que el panel tenía editado, la clave deja de coincidir y
 * se usa lo que dice el sitio. Se pierde esa edición, sí, pero nunca aparece
 * el texto guardado en el lugar equivocado, que es el error que no se nota.
 */
(function () {
  "use strict";

  /** Elementos cuyo interior no es contenido de la página. */
  var FUERA = {
    SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, HELMET: 1, TEMPLATE: 1,
    SVG: 1, PATH: 1, TITLE: 1, META: 1, LINK: 1,
  };

  /**
   * Huella corta y estable de un texto (FNV-1a, en base 36).
   *
   * No es criptografía y no tiene por qué serlo: solo necesita que dos textos
   * distintos de una misma sección casi nunca coincidan.
   */
  function huella(txt) {
    var h = 0x811c9dc5;
    for (var i = 0; i < txt.length; i++) {
      h ^= txt.charCodeAt(i);
      h = (h + (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24)) >>> 0;
    }
    return h.toString(36);
  }

  /** Espacios de más fuera, que en HTML no significan nada. */
  function limpio(txt) {
    return String(txt == null ? "" : txt).replace(/\s+/g, " ").trim();
  }

  /** El bloque al que pertenece un nodo: una diapositiva, una sección, el pie. */
  function bloqueDe(nodo) {
    var el = nodo.nodeType === 3 ? nodo.parentElement : nodo;
    return el ? el.closest(".dcx-port, .dcx-cinta, section, header, footer, main") : null;
  }

  /**
   * Las doce páginas del sitio.
   *
   * El sitio es un solo archivo: cada página es un <sc-if> dentro de <main>
   * que se muestra según la dirección. La variable de ese sc-if es lo único
   * estable que las distingue, así que de ahí sale el nombre.
   */
  var PAGINAS = {
    atHome: "Inicio",
    atConcepto: "El concepto",
    atComerciante: "Para comerciantes",
    atMayoristas: "Para mayoristas",
    atClub: "El Club",
    atAnuncios: "Anuncios",
    atNiveles: "Niveles y tarifas",
    atServicios: "Servicios",
    atNosotros: "Nosotros",
    atContacto: "Contacto",
    atFaq: "Preguntas frecuentes",
    atJuridica: "Aviso legal",
  };

  /** En qué página vive un nodo. Fuera de <main> es común a todas. */
  function paginaDe(nodo) {
    var el = nodo.nodeType === 3 ? nodo.parentElement : nodo;
    while (el) {
      if (el.tagName === "SC-IF" && el.parentElement && el.parentElement.tagName === "MAIN") {
        var v = el.getAttribute("value") || "";
        var m = /\{\{\s*(\w+)\s*\}\}/.exec(v);
        if (m && PAGINAS[m[1]]) return PAGINAS[m[1]];
        return "Otra página";
      }
      el = el.parentElement;
    }
    return "Todo el sitio";
  }

  /** Nombre con el que una persona reconoce ese bloque. */
  function tituloDe(bloque, indicePortada) {
    if (!bloque) return "Otros";
    if (bloque.classList && bloque.classList.contains("dcx-port")) {
      return "Portada " + indicePortada;
    }
    if (bloque.classList && bloque.classList.contains("dcx-cinta")) {
      return "Cinta de beneficios";
    }
    if (bloque.tagName === "MAIN") return "Suelto en la página";
    var h = bloque.querySelector("h1, h2");
    var t = h ? limpio(h.textContent) : "";
    if (t) return t.length > 58 ? t.slice(0, 56) + "…" : t;
    if (bloque.tagName === "FOOTER") return "Pie de página";
    if (bloque.tagName === "HEADER") return "Encabezado";
    return "Otros";
  }

  /** Qué clase de texto es, para que el panel sepa cómo mostrarlo. */
  function etiquetaDe(el, valor) {
    var t = el.tagName;
    if (t === "H1") return "Título principal";
    if (t === "H2") return "Título";
    if (t === "H3" || t === "H4" || t === "H5") return "Subtítulo";
    if (t === "A" || t === "BUTTON") return "Botón";
    if (t === "LI") return "Ítem de lista";
    if (t === "SPAN" && valor.length < 40) return "Texto corto";
    return "Texto";
  }

  /**
   * Recorre la raíz y devuelve todos los campos editables que encuentra.
   *
   * Devuelve también el nodo de cada campo, así quien aplica no tiene que
   * volver a buscarlo.
   */
  function recorrer(raiz) {
    if (!raiz) return [];
    var campos = [];
    var bloques = []; // bloque -> id, sin depender de Map
    var ids = [];
    var portadas = 0;

    function idDe(bloque, pagina) {
      var i = bloques.indexOf(bloque);
      if (i !== -1) return ids[i];
      if (bloque && bloque.classList && bloque.classList.contains("dcx-port")) {
        portadas++;
      }
      // La página entra en la huella porque hay títulos que se repiten entre
      // páginas ("Empezá con una visita"), y sin ella dos secciones distintas
      // compartirían clave.
      var id = huella(pagina + "|" + tituloDe(bloque, portadas));
      bloques.push(bloque);
      ids.push(id);
      return id;
    }

    function agregar(nodo, tipo, valor, extra) {
      var bloque = bloqueDe(nodo);
      var pagina = paginaDe(nodo);
      var id = idDe(bloque, pagina);
      // Mismo texto, misma sección, misma clave: el sitio repite textos a
      // propósito —la cinta de beneficios los duplica para que la animación
      // no corte—, y editar una copia y la otra no dejaría la cinta diciendo
      // dos cosas distintas. Con una sola clave se cambian las dos juntas, y
      // el panel muestra un campo solo.
      var clave = id + "-" + huella(valor);
      var campo = {
        clave: clave,
        tipo: tipo,
        valor: valor,
        bloque: bloque,
        pagina: pagina,
        seccion: tituloDe(bloque, portadas),
      };
      for (var k in extra) {
        if (Object.prototype.hasOwnProperty.call(extra, k)) campo[k] = extra[k];
      }
      campos.push(campo);
      return campo;
    }

    function caminar(nodo) {
      if (nodo.nodeType === 1) {
        if (FUERA[nodo.tagName]) return;
        if (nodo.tagName === "IMG") {
          var src = nodo.getAttribute("src") || "";
          // Las imágenes escritas dentro del propio atributo (data:) no son
          // fotos: son píxeles transparentes que el sitio usa de apoyo para
          // el carrusel. Ofrecerlas para cambiar sería ofrecer romperlo.
          if (src && src.indexOf("{{") === -1 && src.indexOf("data:") !== 0) {
            agregar(nodo, "imagen", src, {
              nodo: nodo,
              alt: nodo.getAttribute("alt") || "",
              etiqueta: "Imagen",
            });
          }
          return;
        }
      }

      if (nodo.nodeType === 3) {
        var valor = limpio(nodo.nodeValue);
        // Sin texto, o es una plantilla del runtime: no se toca.
        if (!valor || valor.indexOf("{{") !== -1) return;
        var el = nodo.parentElement;
        if (!el || FUERA[el.tagName]) return;
        agregar(nodo, "texto", valor, {
          nodo: nodo,
          etiqueta: etiquetaDe(el, valor),
        });
        return;
      }

      var hijos = nodo.childNodes;
      for (var i = 0; i < hijos.length; i++) caminar(hijos[i]);
    }

    caminar(raiz);
    return campos;
  }

  /**
   * Escribe sobre la raíz los valores guardados.
   *
   * Se hace antes de que el runtime arranque: el runtime lee la plantilla una
   * sola vez, así que cambiarla acá alcanza para que el texto nuevo aparezca
   * en todos lados, también cuando se vuelve a dibujar al cambiar de página.
   */
  function aplicar(raiz, mapa, resolverSrc) {
    if (!mapa) return 0;
    var campos = recorrer(raiz);
    var n = 0;
    // Las imágenes se guardan como ruta dentro del bucket, no como dirección
    // completa: el día que cambie el dominio de Supabase no hay que reescribir
    // ninguna fila. Quien llama sabe armar la dirección.
    var resolver = resolverSrc || function (x) { return x; };
    for (var i = 0; i < campos.length; i++) {
      var c = campos[i];
      var v = mapa[c.clave];
      if (!v) continue;
      if (c.tipo === "texto") {
        if (typeof v.texto === "string" && v.texto !== c.valor) {
          c.nodo.nodeValue = v.texto;
          n++;
        }
      } else if (c.tipo === "imagen") {
        if (v.src) {
          // Solo cambia el origen. El alto, el ancho y el object-fit los sigue
          // poniendo el sitio: así una foto nueva entra en el hueco que ya
          // estaba diseñado en vez de correr lo que tiene alrededor.
          c.nodo.setAttribute("src", resolver(v.src));
          n++;
        }
        if (typeof v.alt === "string" && v.alt) c.nodo.setAttribute("alt", v.alt);
      }
    }
    return n;
  }

  window.DC_CONTENIDO = {
    recorrer: recorrer,
    aplicar: aplicar,
    huella: huella,
    limpio: limpio,
  };
})();
