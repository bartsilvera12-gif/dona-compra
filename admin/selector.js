/**
 * Desplegables con la cara del panel.
 *
 * Por qué no alcanza con CSS
 * --------------------------
 * La lista que abre un <select> no la dibuja la página: la dibuja el sistema
 * operativo. Por eso aparece con el azul de Windows y la tipografía del
 * sistema, y no hay regla de estilo que la alcance. La única forma de que se
 * vea como el resto es dibujarla nosotros.
 *
 * Qué hace
 * --------
 * Deja el <select> donde está —escondido, pero vivo— y le pone encima un
 * botón y una lista propios. El <select> sigue siendo el que manda: guarda el
 * valor, y cuando alguien elige algo se le avisa con un evento `change`, el
 * mismo que ya escucha el resto del panel. Así ningún otro archivo se entera
 * de que esto existe.
 *
 * Si este archivo no cargara, los desplegables seguirían funcionando: serían
 * los del sistema, feos pero enteros.
 */
(function () {
  "use strict";

  var abierto = null; // el único desplegable abierto, si hay alguno
  var contador = 0;

  function texto(select) {
    var o = select.options[select.selectedIndex];
    return o ? o.textContent : "";
  }

  /** Cierra el que esté abierto. */
  function cerrar() {
    if (!abierto) return;
    abierto.caja.classList.remove("abierto");
    abierto.boton.setAttribute("aria-expanded", "false");
    abierto = null;
  }

  function mejorar(select) {
    if (!select || select.dcMejorado) return;
    select.dcMejorado = true;
    contador++;

    var caja = document.createElement("div");
    caja.className = "sel";

    var boton = document.createElement("button");
    boton.type = "button";
    boton.className = "sel-boton";
    boton.setAttribute("aria-haspopup", "listbox");
    boton.setAttribute("aria-expanded", "false");

    var etiqueta = document.createElement("span");
    etiqueta.className = "sel-valor";

    var flecha = document.createElement("span");
    flecha.className = "sel-flecha";
    flecha.setAttribute("aria-hidden", "true");

    boton.appendChild(etiqueta);
    boton.appendChild(flecha);

    var lista = document.createElement("ul");
    lista.className = "sel-lista";
    lista.setAttribute("role", "listbox");
    lista.id = "sel-lista-" + contador;
    boton.setAttribute("aria-controls", lista.id);

    // El <select> queda en su lugar, solo que no se ve. Sigue siendo el que
    // guarda el valor y el que avisa de los cambios.
    select.parentNode.insertBefore(caja, select);
    caja.appendChild(select);
    caja.appendChild(boton);
    caja.appendChild(lista);
    select.classList.add("sel-nativo");
    // Lo que lee quien usa un lector de pantalla es el <select>, que es el de
    // verdad; el botón y la lista son adorno y se los saltea.
    boton.setAttribute("tabindex", "-1");
    boton.setAttribute("aria-hidden", "true");
    lista.setAttribute("aria-hidden", "true");

    function pintar() {
      etiqueta.textContent = texto(select);
      lista.innerHTML = "";
      for (var i = 0; i < select.options.length; i++) {
        (function (o, idx) {
          var li = document.createElement("li");
          li.className = "sel-opcion";
          li.setAttribute("role", "option");
          li.textContent = o.textContent;
          if (idx === select.selectedIndex) li.setAttribute("aria-selected", "true");
          li.addEventListener("click", function () {
            select.selectedIndex = idx;
            select.dispatchEvent(new Event("change", { bubbles: true }));
            pintar();
            cerrar();
            select.focus();
          });
          lista.appendChild(li);
        })(select.options[i], i);
      }
    }

    function abrir() {
      cerrar();
      pintar();
      caja.classList.add("abierto");
      boton.setAttribute("aria-expanded", "true");
      abierto = { caja: caja, boton: boton };
      var elegida = lista.querySelector('[aria-selected="true"]');
      if (elegida) elegida.scrollIntoView({ block: "nearest" });
    }

    boton.addEventListener("mousedown", function (ev) {
      ev.preventDefault();
      if (caja.classList.contains("abierto")) cerrar();
      else abrir();
    });

    // El <select> sigue siendo el que recibe el foco y el teclado: las flechas
    // y las letras funcionan como en cualquier formulario, sin que haya que
    // programarlas de nuevo.
    select.addEventListener("change", pintar);
    select.addEventListener("focus", function () { caja.classList.add("enfocado"); });
    select.addEventListener("blur", function () { caja.classList.remove("enfocado"); cerrar(); });
    select.addEventListener("mousedown", function (ev) {
      // En algunos navegadores el clic llega al <select> aunque esté tapado.
      ev.preventDefault();
      if (caja.classList.contains("abierto")) cerrar();
      else abrir();
    });
    select.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape") cerrar();
      if (ev.key === "Enter" || ev.key === " ") {
        ev.preventDefault();
        if (caja.classList.contains("abierto")) cerrar();
        else abrir();
      }
    });

    pintar();
    select.dcRepintar = pintar;
  }

  /** Vuelve a leer las opciones: se llama cuando el panel las cambia. */
  function refrescar(select) {
    if (select && select.dcRepintar) select.dcRepintar();
  }

  document.addEventListener("mousedown", function (ev) {
    if (abierto && !abierto.caja.contains(ev.target)) cerrar();
  });
  window.addEventListener("resize", cerrar);

  window.DC_SELECTOR = { mejorar: mejorar, refrescar: refrescar };
})();
