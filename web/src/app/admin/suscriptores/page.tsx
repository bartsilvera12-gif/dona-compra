import { desc } from "drizzle-orm";
import { requireDb } from "@/db";
import { suscriptores } from "@/db/schema";
import { fechaLarga } from "@/lib/formato";

export const metadata = { title: "Boletín" };

export default async function SuscriptoresPage() {
  const db = requireDb();

  const filas = await db
    .select()
    .from(suscriptores)
    .orderBy(desc(suscriptores.creadoEn))
    .limit(500);

  const confirmados = filas.filter((f) => f.confirmadoEn && !f.bajaEn);

  return (
    <div>
      <h2 className="mb-2 text-[22px]">Boletín</h2>
      <p className="mb-6 max-w-[70ch] text-ink">
        {confirmados.length} dirección(es) confirmada(s) de {filas.length}{" "}
        registrada(s). Solo se le escribe a quien confirmó desde el correo.
      </p>

      {filas.length === 0 ? (
        <p className="rounded-[var(--radius-card)] border border-navy/12 bg-card p-8 text-center text-ink">
          Todavía no hay suscriptores.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-[var(--radius-card)] border border-navy/12 bg-card">
          <table className="w-full text-left text-[14px]">
            <caption className="sr-only">Lista de suscriptores al boletín</caption>
            <thead className="border-b border-navy/12 text-[11px] uppercase tracking-[0.1em] text-muted">
              <tr>
                <th scope="col" className="px-5 py-3 font-medium">Correo</th>
                <th scope="col" className="px-5 py-3 font-medium">Estado</th>
                <th scope="col" className="px-5 py-3 font-medium">Alta</th>
              </tr>
            </thead>
            <tbody>
              {filas.map((f) => {
                const estado = f.bajaEn
                  ? "dado de baja"
                  : f.confirmadoEn
                    ? "confirmado"
                    : "sin confirmar";
                return (
                  <tr key={f.id} className="border-b border-navy/8 last:border-0">
                    <td className="px-5 py-3 text-ink">{f.correo}</td>
                    <td className="px-5 py-3">
                      <span
                        className={
                          estado === "confirmado"
                            ? "text-ink"
                            : estado === "sin confirmar"
                              ? "text-terracotta-ink"
                              : "text-muted"
                        }
                      >
                        {estado}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-muted">
                      {fechaLarga(f.creadoEn.toISOString().slice(0, 10))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
