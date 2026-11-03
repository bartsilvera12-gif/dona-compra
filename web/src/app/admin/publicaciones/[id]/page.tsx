import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import FormPublicacion from "@/components/admin/FormPublicacion";
import { subidaDisponible } from "../subir";
import { requireDb } from "@/db";
import { publicaciones } from "@/db/schema";
import { eliminarPublicacion } from "../form-actions";

export const metadata = { title: "Editar publicación" };

type Props = { params: Promise<{ id: string }> };

export default async function EditarPublicacionPage({ params }: Props) {
  const { id } = await params;

  const db = requireDb();
  const [p] = await db
    .select()
    .from(publicaciones)
    .where(eq(publicaciones.id, id))
    .limit(1);

  if (!p) notFound();

  return (
    <div>
      <nav aria-label="Migas de pan" className="mb-5 text-[13px] text-muted">
        <Link href="/admin/publicaciones" className="hover:text-terracotta-ink">
          Publicaciones
        </Link>
        <span aria-hidden="true" className="mx-2">/</span>
        <span>Editar</span>
      </nav>

      <h2 className="mb-2 text-[22px]">Editar publicación</h2>
      <p className="mb-7 text-[13.5px] text-muted">
        Dirección: <code className="rounded bg-navy/8 px-1.5 py-0.5">/anuncios/{p.slug}</code>
        {" · "}no cambia aunque edites el título, para no romper enlaces ya compartidos.
      </p>

      <div className="max-w-[760px] rounded-[var(--radius-card)] border border-navy/12 bg-card p-[clamp(18px,2.5vw,28px)]">
        <FormPublicacion p={p} subidaDisponible={subidaDisponible} />
      </div>

      <div className="mt-8 max-w-[760px] rounded-[var(--radius-card)] border border-error/35 bg-card p-[clamp(16px,2.2vw,22px)]">
        <h3 className="mb-2 text-[18px]">Eliminar</h3>
        <p className="mb-4 text-[14.5px] text-ink">
          Borra la publicación y sus me gusta. No se puede deshacer. Si solo
          querés sacarla del feed, usá <strong>archivada</strong>.
        </p>
        <form action={eliminarPublicacion}>
          <input type="hidden" name="id" value={p.id} />
          <button
            type="submit"
            className="cursor-pointer rounded-[var(--radius-button)] border border-error/50 px-5 py-2.5 text-[13.5px] text-error-ink hover:bg-error/8"
          >
            Eliminar definitivamente
          </button>
        </form>
      </div>
    </div>
  );
}
