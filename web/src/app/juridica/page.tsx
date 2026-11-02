import type { Metadata } from "next";
import EnMigracion from "@/components/EnMigracion";

export const metadata: Metadata = {
  title: "Información jurídica",
  description: "Aviso legal, condiciones generales de uso, política de privacidad y política de cookies.",
};

export default function Page() {
  return (
    <EnMigracion
      titulo="Información jurídica"
      bajada="Aviso legal, condiciones generales de uso, política de privacidad y política de cookies."
      ruta="#/juridica"
    />
  );
}
