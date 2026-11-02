import type { Metadata } from "next";
import EnMigracion from "@/components/EnMigracion";

export const metadata: Metadata = {
  title: "El Concepto",
  description: "Doña Compra paga tu mercadería al contado al proveedor que vos elegís, y vos pagás en hasta 30 días.",
};

export default function Page() {
  return (
    <EnMigracion
      titulo="El Concepto"
      bajada="Doña Compra paga tu mercadería al contado al proveedor que vos elegís, y vos pagás en hasta 30 días."
      ruta="#/el-concepto"
    />
  );
}
