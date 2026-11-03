import Link from "next/link";
import { eq, isNull, sql, and, isNotNull } from "drizzle-orm";
import { requireDb } from "@/db";
import {
  mensajes,
  publicaciones,
  suscriptores,
  usuarios,
} from "@/db/schema";

export const metadata = { title: "Resumen" };

async function metricas() {
  const db = requireDb();
  const n = sql<number>`count(*)::int`;

  const [
    [nuevos],
    [totalMensajes],
    [pendientes],
    [publicadas],
    [confirmados],
    [sinConfirmar],
    [cuentas],
    [admins],
  ] = await Promise.all([
    db.select({ n }).from(mensajes).where(eq(mensajes.estado, "nuevo")),
    db.select({ n }).from(mensajes),
    db
      .select({ n })
      .from(publicaciones)
      .where(eq(publicaciones.estado, "pendiente")),
    db
      .select({ n })
      .from(publicaciones)
      .where(eq(publicaciones.estado, "publicada")),
    db
      .select({ n })
      .from(suscriptores)
      .where(
        and(isNotNull(suscriptores.confirmadoEn), isNull(suscriptores.bajaEn)),
      ),
    db
      .select({ n })
      .from(suscriptores)
      .where(isNull(suscriptores.confirmadoEn)),
    db.select({ n }).from(usuarios),
    db
      .select({ n })
      .from(usuarios)
      .where(and(eq(usuarios.rol, "admin"), eq(usuarios.estado, "activo"))),
  ]);

  return {
    nuevos: nuevos?.n ?? 0,
    totalMensajes: totalMensajes?.n ?? 0,
    pendientes: pendientes?.n ?? 0,
    publicadas: publicadas?.n ?? 0,
    confirmados: confirmados?.n ?? 0,
    sinConfirmar: sinConfirmar?.n ?? 0,
    cuentas: cuentas?.n ?? 0,
    admins: admins?.n ?? 0,
  };
}

function Tarjeta({
  titulo,
  valor,
  nota,
  href,
  destacar,
}: {
  titulo: string;
  valor: number;
  nota?: string;
  href?: string;
  destacar?: boolean;
}) {
  const contenido = (
    <>
      <span className="block text-[11px] uppercase tracking-[0.15em] text-muted">
        {titulo}
      </span>
      <span
        className={`mt-2 block font-mono text-[34px] font-semibold ${
          destacar && valor > 0 ? "text-terracotta-ink" : "text-navy"
        }`}
      >
        {valor}
      </span>
      {nota && <span className="mt-1 block text-xs text-muted">{nota}</span>}
    </>
  );

  const clases = `rounded-[var(--radius-card)] border bg-card p-5 ${
    destacar && valor > 0 ? "border-terracotta/40" : "border-navy/12"
  }`;

  return href ? (
    <Link href={href} className={`${clases} block hover:border-terracotta`}>
      {contenido}
    </Link>
  ) : (
    <div className={clases}>{contenido}</div>
  );
}

export default async function AdminInicio() {
  const m = await metricas();

  return (
    <div>
      <h2 className="mb-5 text-[22px]">Resumen</h2>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-4">
        <Tarjeta
          titulo="Mensajes sin leer"
          valor={m.nuevos}
          nota={`${m.totalMensajes} en total`}
          href="/admin/mensajes"
          destacar
        />
        <Tarjeta
          titulo="Publicaciones a moderar"
          valor={m.pendientes}
          nota={`${m.publicadas} publicadas`}
          href="/admin/publicaciones"
          destacar
        />
        <Tarjeta
          titulo="Boletín"
          valor={m.confirmados}
          nota={`${m.sinConfirmar} sin confirmar`}
          href="/admin/suscriptores"
        />
        <Tarjeta
          titulo="Cuentas"
          valor={m.cuentas}
          nota={`${m.admins} con acceso al panel`}
          href="/admin/usuarios"
        />
      </div>

      {(m.nuevos > 0 || m.pendientes > 0) && (
        <div className="mt-8 rounded-[var(--radius-card)] border border-terracotta/30 bg-terracotta/8 p-5">
          <h3 className="mb-2">Te espera trabajo</h3>
          <ul className="list-disc pl-5 text-ink">
            {m.nuevos > 0 && (
              <li>
                <Link href="/admin/mensajes" className="text-terracotta-ink underline">
                  {m.nuevos} consulta(s) sin leer
                </Link>
              </li>
            )}
            {m.pendientes > 0 && (
              <li>
                <Link href="/admin/publicaciones" className="text-terracotta-ink underline">
                  {m.pendientes} publicación(es) esperando moderación
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
