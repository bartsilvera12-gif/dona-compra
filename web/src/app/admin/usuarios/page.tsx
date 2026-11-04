import { asc, desc, sql } from "drizzle-orm";
import { requireDb } from "@/db";
import { sesiones, usuarios } from "@/db/schema";
import AccionesUsuario from "@/components/admin/AccionesUsuario";
import FormUsuario from "@/components/admin/FormUsuario";
import { exigirSesion } from "@/lib/sesion";
import { fechaLarga } from "@/lib/formato";

export const metadata = { title: "Cuentas" };

const ETIQUETA_ROL: Record<string, string> = {
  admin: "Administración",
  comerciante: "Comerciante",
  mayorista: "Mayorista",
  marca: "Marca del Club",
};

const COLOR_ROL: Record<string, string> = {
  admin: "border-terracotta/45 bg-terracotta/8 text-terracotta-ink",
  comerciante: "border-navy/20 bg-navy/5 text-navy",
  mayorista: "border-navy/20 bg-navy/5 text-navy",
  marca: "border-navy/20 bg-navy/5 text-navy",
};

export default async function UsuariosPage() {
  const yo = await exigirSesion(["admin"]);
  const db = requireDb();

  const filas = await db
    .select({
      u: usuarios,
      // Sesiones abiertas: sirve para saber si alguien está trabajando antes
      // de suspenderlo.
      abiertas: sql<number>`(
        select count(*)::int from ${sesiones}
        where ${sesiones.usuarioId} = ${usuarios.id}
          and ${sesiones.expiraEn} > now()
      )`,
    })
    .from(usuarios)
    .orderBy(asc(usuarios.rol), desc(usuarios.creadoEn))
    .limit(300);

  const adminsActivos = filas.filter(
    (f) => f.u.rol === "admin" && f.u.estado === "activo",
  ).length;

  return (
    <div>
      <h2 className="mb-2 text-[22px]">Cuentas</h2>
      <p className="mb-8 max-w-[74ch] text-ink">
        {filas.length} cuenta(s). No hay registro público: las cuentas se crean
        acá o con <code className="rounded bg-navy/8 px-1.5 py-0.5">npm run admin:crear</code>.
      </p>

      <section className="mb-10 max-w-[760px] rounded-[var(--radius-card)] border border-navy/12 bg-card p-[clamp(18px,2.5vw,28px)]">
        <h3 className="mb-5">Crear una cuenta</h3>
        <FormUsuario />
      </section>

      <h3 className="mb-4">Cuentas existentes</h3>
      <div className="grid gap-3">
        {filas.map(({ u, abiertas }) => {
          const esYo = u.id === yo.id;
          const esUltimoAdmin =
            u.rol === "admin" && u.estado === "activo" && adminsActivos === 1;

          return (
            <article
              key={u.id}
              className={`rounded-[var(--radius-card)] border bg-card p-5 ${
                u.estado === "suspendido"
                  ? "border-navy/12 opacity-75"
                  : "border-navy/12"
              }`}
            >
              <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="font-heading text-[18px] font-semibold text-navy">
                    {u.nombre}
                    {esYo && (
                      <span className="ml-2 text-[12px] font-normal text-muted">
                        (vos)
                      </span>
                    )}
                  </h4>
                  <p className="mt-1 break-all text-[13.5px] text-muted">
                    {u.correo}
                    {u.negocio ? ` · ${u.negocio}` : ""}
                    {u.ciudad ? ` · ${u.ciudad}` : ""}
                  </p>
                  <p className="mt-1 text-[12.5px] text-muted">
                    Alta {fechaLarga(u.creadoEn.toISOString().slice(0, 10))}
                    {u.ultimoAccesoEn
                      ? ` · último acceso ${fechaLarga(u.ultimoAccesoEn.toISOString().slice(0, 10))}`
                      : " · nunca entró"}
                    {abiertas > 0
                      ? ` · ${abiertas} sesión(es) abierta(s)`
                      : ""}
                  </p>
                </div>

                <div className="flex flex-none flex-wrap gap-2">
                  <span
                    className={`rounded-[var(--radius-button)] border px-3 py-1 text-[11px] uppercase tracking-[0.1em] ${COLOR_ROL[u.rol]}`}
                  >
                    {ETIQUETA_ROL[u.rol]}
                  </span>
                  {u.estado === "suspendido" && (
                    <span className="rounded-[var(--radius-button)] border border-error/40 bg-error/8 px-3 py-1 text-[11px] uppercase tracking-[0.1em] text-error-ink">
                      Suspendida
                    </span>
                  )}
                </div>
              </div>

              <AccionesUsuario
                id={u.id}
                correo={u.correo}
                rol={u.rol}
                estado={u.estado}
                esYo={esYo}
                esUltimoAdmin={esUltimoAdmin}
              />
            </article>
          );
        })}
      </div>
    </div>
  );
}
