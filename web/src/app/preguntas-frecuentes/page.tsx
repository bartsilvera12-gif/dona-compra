import type { Metadata } from "next";
import EnMigracion from "@/components/EnMigracion";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description: "Respuestas a las dudas más comunes sobre cómo comprar mercadería y pagar después.",
};

export default function Page() {
  return (
    <EnMigracion
      titulo="Preguntas frecuentes"
      bajada="Respuestas a las dudas más comunes sobre cómo comprar mercadería y pagar después."
      ruta="#/preguntas-frecuentes"
    />
  );
}
