import type { Metadata } from "next";
import EnMigracion from "@/components/EnMigracion";

export const metadata: Metadata = {
  title: "El Club Doña Compra",
  description: "Acceso de miembros, ventajas exclusivas y ofertas para los comerciantes que compran con nosotros.",
};

export default function Page() {
  return (
    <EnMigracion
      titulo="El Club Doña Compra"
      bajada="Acceso de miembros, ventajas exclusivas y ofertas para los comerciantes que compran con nosotros."
      ruta="#/club"
    />
  );
}
