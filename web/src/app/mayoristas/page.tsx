import type { Metadata } from "next";
import EnMigracion from "@/components/EnMigracion";

export const metadata: Metadata = {
  title: "Mayoristas",
  description: "Vendé más sin asumir riesgo de cobro: Doña Compra te paga al contado la mercadería de tus clientes.",
};

export default function Page() {
  return (
    <EnMigracion
      titulo="Mayoristas"
      bajada="Vendé más sin asumir riesgo de cobro: Doña Compra te paga al contado la mercadería de tus clientes."
      ruta="#/mayoristas"
    />
  );
}
