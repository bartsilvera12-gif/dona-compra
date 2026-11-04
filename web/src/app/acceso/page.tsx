import type { Metadata } from "next";
import { redirect } from "next/navigation";
import FormAcceso from "@/components/FormAcceso";
import { Wrap } from "@/components/ui";
import { sesionActual } from "@/lib/sesion";

export const metadata: Metadata = {
  title: "Acceso",
  robots: { index: false, follow: false },
};

const MOTIVOS: Record<string, string> = {
  sesion: "Necesitás entrar para ver esa página.",
  permiso: "Tu cuenta no tiene permiso para ver esa página.",
};

type Props = { searchParams: Promise<{ motivo?: string }> };

export default async function AccesoPage({ searchParams }: Props) {
  // Si ya hay sesión, no tiene sentido mostrar el formulario.
  const usuario = await sesionActual();
  if (usuario) redirect(usuario.rol === "admin" ? "/admin" : "/");

  const { motivo } = await searchParams;
  const aviso = motivo ? MOTIVOS[motivo] : undefined;

  return (
    <main>
      <Wrap>
        <div className="mx-auto max-w-[420px]">
          <h1 className="mb-3 text-[clamp(28px,4vw,40px)]">Acceso</h1>
          <p className="mb-7 text-ink">
            Para el equipo de Doña Compra.
          </p>
          <FormAcceso aviso={aviso} />
        </div>
      </Wrap>
    </main>
  );
}
