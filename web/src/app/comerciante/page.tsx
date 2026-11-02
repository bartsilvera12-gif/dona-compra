import type { Metadata } from "next";
import EnMigracion from "@/components/EnMigracion";

export const metadata: Metadata = {
  title: "Comerciantes",
  description: "Comprá stock sin frenar la caja de tu negocio. Visita al local, evaluación y compra con pago a 30 días.",
};

export default function Page() {
  return (
    <EnMigracion
      titulo="Comerciantes"
      bajada="Comprá stock sin frenar la caja de tu negocio. Visita al local, evaluación y compra con pago a 30 días."
      ruta="#/comerciante"
    />
  );
}
