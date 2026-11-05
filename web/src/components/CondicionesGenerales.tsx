import { CGV, CGV_VERSION, type ArticuloCGV } from "@/lib/cgv";
import {
  NIVELES,
  NIVELES_DE_ENTRADA,
  NOMBRE_SERVICIO,
  totalServicios,
  type Servicios,
} from "@/lib/niveles";

/**
 * El texto del contrato, artículo por artículo.
 *
 * Las grillas tarifarias se arman desde `niveles.ts` y no desde el texto: así
 * no hay dos copias de las mismas cifras en el repositorio. `npm run
 * check:niveles` las verifica contra este mismo contrato.
 */

const gs = (n: number) => n.toLocaleString("es-PY");

function Tabla({
  cabeceras,
  filas,
  pie,
}: {
  cabeceras: string[];
  filas: (string | number)[][];
  pie?: string;
}) {
  return (
    <div className="mt-5 overflow-x-auto">
      <table className="w-full min-w-[520px] border-collapse text-[14.5px]">
        <thead>
          <tr>
            {cabeceras.map((c, i) => (
              <th
                key={c}
                scope="col"
                className={`border-b border-navy/20 py-2.5 pr-3 font-medium text-navy ${
                  i === 0 ? "text-left" : "text-right"
                }`}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map((f) => (
            <tr key={String(f[0])}>
              {f.map((celda, i) => (
                <td
                  key={i}
                  className={`border-b border-navy/10 py-2.5 pr-3 ${
                    i === 0
                      ? "text-left font-medium text-navy"
                      : "text-right tabular-nums text-ink"
                  }`}
                >
                  {celda}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {pie && <p className="mt-2 text-[13px] text-muted">{pie}</p>}
    </div>
  );
}

function Grilla({ cual }: { cual: NonNullable<ArticuloCGV["tabla"]> }) {
  if (cual === "analisis") {
    return (
      <Tabla
        cabeceras={["Nivel", "Precio del Análisis"]}
        filas={NIVELES_DE_ENTRADA.map((n) => [
          n.nombre,
          `${gs(n.analisis as number)} Gs`,
        ])}
        pie="A Rubis y Diamante no se entra de forma directa: se llega por ascenso."
      />
    );
  }
  if (cual === "cupos") {
    return (
      <Tabla
        cabeceras={[
          "Nivel",
          "Cupo (costo mayorista de mercaderías)",
          "Pedido mínimo (costo mayorista)",
        ]}
        filas={NIVELES.map((n) => [
          n.nombre,
          `${gs(n.tope)} Gs`,
          `${gs(n.minimo)} Gs`,
        ])}
      />
    );
  }
  if (cual === "recargos") {
    return (
      <Tabla
        cabeceras={["Nivel", "Recargo comercial (escala estándar)"]}
        filas={NIVELES.map((n) => [
          n.nombre,
          `${Math.round(n.recargo * 100)} %`,
        ])}
      />
    );
  }
  const claves = Object.keys(NOMBRE_SERVICIO) as (keyof Servicios)[];
  return (
    <Tabla
      cabeceras={[
        "Nivel",
        ...claves.map((k) => NOMBRE_SERVICIO[k]),
        "Total servicios",
      ]}
      filas={NIVELES.map((n) => [
        n.nombre,
        ...claves.map((k) => gs(n.servicios[k])),
        gs(totalServicios(n.servicios)),
      ])}
      pie="Tarifas fijas por pedido, en guaraníes."
    />
  );
}

export default function CondicionesGenerales() {
  return (
    <>
      <p className="mt-4 text-[14.5px] text-muted">
        Versión {CGV_VERSION}. Transcripción del documento que firma el
        comerciante, publicada para consulta. En caso de diferencia, el
        ejemplar firmado por ambas partes es el que vale.
      </p>

      {CGV.map((a) => (
        <section key={a.n} className="mt-8 first:mt-6">
          <h3 className="mb-2 text-[clamp(17px,2vw,20px)]">
            Artículo {a.n} — {a.titulo}
          </h3>

          {a.intro?.map((t) => (
            <p key={t.slice(0, 40)} className="mt-2.5 text-ink">
              {t}
            </p>
          ))}

          {a.puntos && (
            <ol className="mt-3 list-decimal space-y-2.5 pl-5 text-ink marker:text-muted">
              {a.puntos.map((t) => (
                <li key={t.slice(0, 40)}>{t}</li>
              ))}
            </ol>
          )}

          {a.tabla && <Grilla cual={a.tabla} />}

          {a.cierre?.map((t) => (
            <p key={t.slice(0, 40)} className="mt-2.5 text-ink">
              {t}
            </p>
          ))}

          {a.tablaCierre && <Grilla cual={a.tablaCierre} />}
        </section>
      ))}
    </>
  );
}
