"use client";

import { useEffect, useRef } from "react";

/**
 * Revela a sus hijos cuando entran en pantalla.
 *
 * El estado no vive en React sino en un atributo del DOM, a propósito: así no
 * hay un render por cada elemento que aparece mientras se hace scroll. El CSS
 * hace el resto.
 */
export default function Revelar({
  children,
  retardo = 0,
  className = "",
  as: Etiqueta = "div",
}: {
  children: React.ReactNode;
  /** 0 a 5: escalona la entrada de elementos vecinos. */
  retardo?: 0 | 1 | 2 | 3 | 4 | 5;
  className?: string;
  as?: "div" | "section" | "article" | "li";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Sin IntersectionObserver se muestra directamente.
    if (typeof IntersectionObserver !== "function") {
      el.dataset.visible = "1";
      return;
    }

    // Lo que ya está en pantalla al cargar no espera al scroll.
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue;
          (entrada.target as HTMLElement).dataset.visible = "1";
          observador.unobserve(entrada.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );

    observador.observe(el);

    // Red de seguridad: una animación no puede dejar contenido invisible.
    // Si por lo que sea el observador no llega a disparar, a los 10 segundos
    // se muestra igual. Es tiempo de sobra para que el scroll normal haya
    // hecho su trabajo primero, con la animación incluida.
    const red = window.setTimeout(() => {
      if (el.dataset.visible !== "1") el.dataset.visible = "1";
    }, 10000);

    return () => {
      observador.disconnect();
      window.clearTimeout(red);
    };
  }, []);

  return (
    <Etiqueta
      // @ts-expect-error: el ref es correcto para cualquiera de las etiquetas permitidas
      ref={ref}
      data-revelar=""
      data-retardo={retardo || undefined}
      className={className}
    >
      {children}
    </Etiqueta>
  );
}
