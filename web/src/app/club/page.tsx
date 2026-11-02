import type { Metadata } from "next";
import ClubTabs from "@/components/ClubTabs";
import { CTA, Section } from "@/components/ui";
import { PortadaFoto } from "@/components/bloques";

export const metadata: Metadata = {
  title: "El Club Doña Compra",
  description:
    "Acceso de miembros, ventajas exclusivas y ofertas para los comerciantes que compran con Doña Compra.",
};

export default function ClubPage() {
  return (
    <main>
      <PortadaFoto
        rotulo="El Club Doña Compra"
        titulo="El Club Doña Compra"
        bajada="El espacio de los comerciantes que ya compran con nosotros: ventajas, ofertas reservadas y acompañamiento. Se accede por historial de compras, no por cuota."
        foto={{
          src: "/assets/rubro-cosmeticos.jpg",
          alt: "Comercio con mercadería repuesta",
        }}
      />

      <Section tono="tarjeta">
        <ClubTabs />
      </Section>

      <CTA
        titulo="¿Querés sumarte al Club?"
        texto="Empieza con una visita al negocio. A partir de ahí, el historial de compras define el ingreso."
      />
    </main>
  );
}
