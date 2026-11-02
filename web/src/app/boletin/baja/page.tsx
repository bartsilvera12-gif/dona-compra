import Link from "next/link";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { suscriptores } from "@/db/schema";

export const metadata = {
  title: "Baja del boletín | Doña Compra",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ token?: string }> };

async function darDeBaja(token: string): Promise<"ok" | "invalido" | "error"> {
  if (!db) return "error";
  try {
    const filas = await db
      .update(suscriptores)
      .set({ bajaEn: new Date() })
      .where(eq(suscriptores.token, token))
      .returning({ id: suscriptores.id });
    return filas.length > 0 ? "ok" : "invalido";
  } catch (err) {
    console.error("[boletin] baja fallida:", err);
    return "error";
  }
}

export default async function BajaPage({ searchParams }: Props) {
  const { token } = await searchParams;
  const estado = token ? await darDeBaja(token) : "invalido";

  const textos = {
    ok: {
      titulo: "Te diste de baja",
      cuerpo: "No vas a recibir más el boletín. Si fue un error, podés volver a suscribirte cuando quieras.",
    },
    invalido: {
      titulo: "Enlace no válido",
      cuerpo: "Este enlace ya no sirve. Si seguís recibiendo correos, escribinos y lo resolvemos.",
    },
    error: {
      titulo: "No pudimos procesar la baja",
      cuerpo: "Hubo un problema de nuestro lado. Escribinos y te damos de baja a mano.",
    },
  }[estado];

  return (
    <main className="mx-auto max-w-[1280px] px-[clamp(18px,4vw,40px)] py-[clamp(48px,8vw,110px)]">
      <div className="max-w-[60ch] rounded-[var(--radius-card)] border border-navy/12 bg-card p-[clamp(20px,3vw,32px)]">
        <h1 className="mb-4 text-[clamp(26px,4vw,40px)]">{textos.titulo}</h1>
        <p className="mb-6 text-ink">{textos.cuerpo}</p>
        <Link
          href="/"
          className="inline-block rounded-[var(--radius-button)] bg-navy px-6 py-3.5 text-sm font-medium text-card hover:bg-navy-deep hover:text-card"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
