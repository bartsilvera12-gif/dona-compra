import type { Metadata } from "next";
import Link from "next/link";
import { exigirSesion } from "@/lib/sesion";
import { salir } from "@/app/acceso/actions";

export const metadata: Metadata = {
  title: { default: "Panel", template: "%s | Panel Doña Compra" },
  robots: { index: false, follow: false },
};

// El panel nunca se cachea: siempre se comprueba la sesión en cada petición.
export const dynamic = "force-dynamic";

const SECCIONES = [
  ["/admin", "Resumen"],
  ["/admin/mensajes", "Mensajes"],
  ["/admin/publicaciones", "Publicaciones"],
  ["/admin/suscriptores", "Boletín"],
  ["/admin/usuarios", "Cuentas"],
  ["/admin/cuenta", "Mi cuenta"],
] as const;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Única puerta de entrada: todo lo que cuelga de /admin pasa por acá.
  const usuario = await exigirSesion(["admin"]);

  return (
    <div className="mx-auto max-w-[1280px] px-[clamp(18px,4vw,40px)] py-[clamp(24px,4vw,48px)]">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-navy/12 pb-5">
        <div>
          <span className="text-[11px] uppercase tracking-[0.2em] text-muted">
            Panel de administración
          </span>
          <h1 className="mt-1 text-[clamp(24px,3vw,32px)]">Doña Compra</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted">{usuario.nombre}</span>
          <form action={salir}>
            <button
              type="submit"
              className="cursor-pointer rounded-[var(--radius-button)] border border-navy/25 px-4 py-2 text-[13.5px] text-ink hover:border-terracotta"
            >
              Salir
            </button>
          </form>
        </div>
      </header>

      <nav aria-label="Secciones del panel" className="mb-8 flex flex-wrap gap-2">
        {SECCIONES.map(([href, label]) => (
          <Link
            key={href}
            href={href}
            className="rounded-[var(--radius-button)] border border-navy/25 px-4 py-2.5 text-[13.5px] text-ink hover:border-terracotta"
          >
            {label}
          </Link>
        ))}
      </nav>

      {children}
    </div>
  );
}
