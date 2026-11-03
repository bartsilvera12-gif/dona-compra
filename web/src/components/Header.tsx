"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, navDetalle, site, waLink } from "@/lib/site";

export default function Header() {
  const pathname = usePathname();
  const [abierto, setAbierto] = useState(false);

  // El menú se cierra desde el onClick de cada enlace, no desde un efecto
  // sobre pathname: así no hay un render extra en cada navegación.

  // Con el menú a pantalla completa, el fondo no debe desplazarse.
  useEffect(() => {
    document.body.style.overflow = abierto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [abierto]);

  const activo = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <div className="bg-navy-dark px-[clamp(18px,4vw,40px)] py-2">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-2">
          <span className="text-[10.5px] uppercase tracking-[0.18em] text-terracotta-soft">
            Para comerciantes y emprendedores de Gran Asunción
          </span>
          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10.5px] uppercase tracking-[0.14em] text-card/60 hover:text-terracotta-soft"
          >
            WhatsApp {site.phone}
          </a>
        </div>
      </div>

      <header className="sticky top-0 z-60 border-b border-navy/12 bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1280px] items-center gap-5 px-[clamp(18px,4vw,40px)] py-3.5">
          <Link href="/" className="flex flex-none items-center gap-2.5">
            <span className="block h-[42px] w-[42px] flex-none overflow-hidden rounded-full border-[1.5px] border-terracotta bg-navy">
              <Image
                src="/assets/dona-compra-logo-400.jpg"
                alt=""
                width={42}
                height={42}
                className="h-full w-full scale-130 object-cover object-[50%_42%]"
                priority
              />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-heading text-[19px] font-bold tracking-[0.02em] text-navy">
                DOÑA COMPRA
              </span>
              <span className="mt-1 text-[9px] uppercase tracking-[0.22em] text-muted">
                Compra de mercadería
              </span>
            </span>
          </Link>

          <nav
            aria-label="Navegación principal"
            className="mx-auto hidden items-center gap-0.5 min-[1150px]:flex"
          >
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={activo(item.href) ? "page" : undefined}
                className={`relative whitespace-nowrap px-2.5 py-1.5 text-[13.5px] hover:text-terracotta-ink ${
                  activo(item.href) ? "text-navy" : "text-ink"
                }`}
              >
                {item.label}
                {activo(item.href) && (
                  <span className="absolute inset-x-2.5 -bottom-px block h-[1.5px] bg-terracotta" />
                )}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setAbierto(true)}
            aria-expanded={abierto}
            className="ml-auto cursor-pointer rounded-[var(--radius-button)] border border-navy/30 px-4 py-2.5 text-xs uppercase tracking-[0.16em] text-navy min-[1150px]:hidden"
          >
            Menú
          </button>
        </div>
      </header>

      {abierto && (
        <div className="fixed inset-0 z-90 grid grid-rows-[auto_1fr] bg-navy-dark">
          <div className="flex items-center justify-between border-b border-terracotta/30 px-[clamp(18px,5vw,34px)] py-4.5">
            <span className="font-heading text-lg font-bold text-card">
              DOÑA COMPRA
            </span>
            <button
              type="button"
              onClick={() => setAbierto(false)}
              className="cursor-pointer rounded-[var(--radius-button)] border border-card/35 px-4 py-2.5 text-xs uppercase tracking-[0.16em] text-card"
            >
              Cerrar
            </button>
          </div>
          <nav
            aria-label="Navegación móvil"
            className="flex flex-col justify-center gap-0.5 overflow-y-auto px-[clamp(18px,5vw,34px)] py-6"
          >
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setAbierto(false)}
                className="border-b border-card/12 py-2 font-heading text-[clamp(26px,7vw,40px)] font-semibold text-card hover:text-terracotta-soft"
              >
                {item.label}
              </Link>
            ))}
            {navDetalle.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setAbierto(false)}
                className="pt-3 text-sm uppercase tracking-[0.08em] text-card/65 hover:text-terracotta-soft"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
