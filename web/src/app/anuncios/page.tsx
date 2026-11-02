import type { Metadata } from "next";
import BoletinForm from "@/components/BoletinForm";

export const metadata: Metadata = {
  title: "Anuncios",
  description:
    "Novedades, ofertas y publicaciones de la comunidad Doña Compra en fotos y videos.",
};

export default function AnunciosPage() {
  return (
    <main>
      <section className="border-b border-navy/12">
        <div className="mx-auto max-w-[1280px] px-[clamp(18px,4vw,40px)] py-[clamp(40px,6vw,86px)]">
          <span className="text-[11px] uppercase tracking-[0.2em] text-muted">
            Anuncios
          </span>
          <h1 className="mt-4">Lo que pasa en la comunidad.</h1>
          <p className="mt-4 max-w-[56ch] text-[clamp(16px,1.8vw,19px)] text-ink">
            Novedades, ofertas de mayoristas socios y publicaciones de
            comerciantes del Club, en fotos y videos cortos.
          </p>
        </div>
      </section>

      <section className="bg-card">
        <div className="mx-auto max-w-[1280px] px-[clamp(18px,4vw,40px)] py-[clamp(40px,6vw,86px)]">
          <div className="max-w-[70ch] rounded-[var(--radius-card)] border border-terracotta/30 bg-terracotta/8 p-[clamp(16px,2.2vw,24px)]">
            <h3 className="mb-2">El feed llega con la base de datos</h3>
            <p className="text-ink">
              Las publicaciones, la carga de fotos y videos y la moderación
              previa son el siguiente paso. El boletín de acá abajo ya funciona
              de verdad.
            </p>
          </div>

          <div className="mt-8 max-w-[620px] rounded-[var(--radius-card)] border border-navy/12 bg-card p-[clamp(16px,2.2vw,24px)]">
            <h2 className="mb-2 text-[clamp(20px,2.6vw,26px)]">
              Boletín Doña Compra
            </h2>
            <p className="mb-5 text-ink">
              Ofertas y novedades en tu correo. Te mandamos un correo para
              confirmar, y te podés dar de baja cuando quieras.
            </p>
            <BoletinForm />
          </div>
        </div>
      </section>
    </main>
  );
}
