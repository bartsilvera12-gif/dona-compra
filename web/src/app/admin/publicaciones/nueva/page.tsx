import Link from "next/link";
import FormPublicacion from "@/components/admin/FormPublicacion";

export const metadata = { title: "Nueva publicación" };

export default function NuevaPublicacionPage() {
  return (
    <div>
      <nav aria-label="Migas de pan" className="mb-5 text-[13px] text-muted">
        <Link href="/admin/publicaciones" className="hover:text-terracotta-ink">
          Publicaciones
        </Link>
        <span aria-hidden="true" className="mx-2">/</span>
        <span>Nueva</span>
      </nav>

      <h2 className="mb-2 text-[22px]">Nueva publicación</h2>
      <p className="mb-7 max-w-[70ch] text-ink">
        Nace en estado <strong>pendiente</strong>: no se ve en el feed hasta
        que la apruebes.
      </p>

      <div className="max-w-[760px] rounded-[var(--radius-card)] border border-navy/12 bg-card p-[clamp(18px,2.5vw,28px)]">
        <FormPublicacion />
      </div>
    </div>
  );
}
