import { desc, eq, gt, and } from "drizzle-orm";
import { requireDb } from "@/db";
import { sesiones } from "@/db/schema";
import FormPassword from "@/components/admin/FormPassword";
import { exigirSesion } from "@/lib/sesion";

export const metadata = { title: "Mi cuenta" };

const ETIQUETA_ROL: Record<string, string> = {
  admin: "Administración",
  comerciante: "Comerciante",
  mayorista: "Mayorista",
  miembro: "Miembro del Club",
};

export default async function CuentaPage() {
  // Solo admin: esta página cuelga de /admin, cuyo layout ya exige ese rol.
  // Declarar más roles acá sería una permisividad muerta que confunde. Cuando
  // existan las cuentas del Club, esta pantalla se muda a /cuenta y ahí sí
  // aceptará los demás roles; la acción que usa ya los contempla.
  const yo = await exigirSesion(["admin"]);
  const db = requireDb();

  const abiertas = await db
    .select({
      creadoEn: sesiones.creadoEn,
      expiraEn: sesiones.expiraEn,
      userAgent: sesiones.userAgent,
    })
    .from(sesiones)
    .where(and(eq(sesiones.usuarioId, yo.id), gt(sesiones.expiraEn, new Date())))
    .orderBy(desc(sesiones.creadoEn))
    .limit(20);

  const fmt = new Intl.DateTimeFormat("es-PY", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div>
      <h2 className="mb-2 text-[22px]">Mi cuenta</h2>
      <p className="mb-8 text-ink">
        {yo.nombre} · {yo.correo} · {ETIQUETA_ROL[yo.rol]}
      </p>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-[var(--radius-card)] border border-navy/12 bg-card p-[clamp(18px,2.5vw,28px)]">
          <h3 className="mb-5">Cambiar contraseña</h3>
          <FormPassword />
        </section>

        <section className="rounded-[var(--radius-card)] border border-navy/12 bg-card p-[clamp(18px,2.5vw,28px)]">
          <h3 className="mb-2">Sesiones abiertas</h3>
          <p className="mb-5 text-[14.5px] text-ink">
            {abiertas.length === 1
              ? "Una sesión activa: la de este navegador."
              : `${abiertas.length} sesiones activas. Si hay alguna que no reconocés, cambiá la contraseña: eso cierra todas las demás.`}
          </p>

          <ul className="grid gap-2.5">
            {abiertas.map((s, i) => (
              <li
                key={i}
                className="rounded-[var(--radius-button)] border border-navy/12 px-4 py-3 text-[13.5px]"
              >
                <span className="block text-ink">
                  Desde el {fmt.format(s.creadoEn)} · vence el{" "}
                  {fmt.format(s.expiraEn)}
                </span>
                {s.userAgent && (
                  <span className="mt-1 block break-all text-[12px] text-muted">
                    {s.userAgent}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
