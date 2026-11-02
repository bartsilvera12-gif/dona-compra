import Link from "next/link";
import { waLink } from "@/lib/site";

const PASOS = [
  ["1 · Elegís vos", "El producto y el proveedor los elegís vos. Trabajamos con el mayorista que ya conocés."],
  ["2 · Doña paga al contado", "Pagamos la mercadería al proveedor en el momento, como cualquier venta de contado."],
  ["3 · Retirás con código", "Te damos un código seguro con el que retirás. La compra queda con factura legal."],
  ["4 · Pagás después", "Tenés hasta 30 días desde la factura, según las condiciones acordadas en la visita."],
] as const;

export default function Home() {
  return (
    <main>
      <section className="border-b border-navy/12">
        <div className="mx-auto max-w-[1280px] px-[clamp(18px,4vw,40px)] py-[clamp(48px,8vw,110px)]">
          <span className="text-[11px] uppercase tracking-[0.2em] text-muted">
            Gran Asunción, Paraguay
          </span>
          <h1 className="mt-4 max-w-[16ch]">Vendé más y pagá después.</h1>
          <p className="mt-5 max-w-[56ch] text-[clamp(16px,1.8vw,19px)] text-ink">
            Elegí la mercadería y el proveedor que ya conocés. Doña Compra paga
            al contado y vos pagás en hasta 30 días, según las condiciones
            acordadas.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/contacto"
              className="inline-block rounded-[var(--radius-button)] bg-navy px-7 py-3.5 text-sm font-medium text-card hover:bg-navy-deep hover:text-card"
            >
              Pedir una visita
            </Link>
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-[var(--radius-button)] border border-navy px-7 py-3.5 text-sm font-medium text-navy"
            >
              Escribir por WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="bg-card">
        <div className="mx-auto max-w-[1280px] px-[clamp(18px,4vw,40px)] py-[clamp(40px,6vw,86px)]">
          <h2 className="mb-8">Cómo funciona</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-4">
            {PASOS.map(([titulo, texto]) => (
              <div
                key={titulo}
                className="rounded-[var(--radius-card)] border border-navy/12 bg-card p-[clamp(16px,2.2vw,24px)]"
              >
                <h3 className="mb-2">{titulo}</h3>
                <p className="text-ink">{texto}</p>
              </div>
            ))}
          </div>
          <p className="mt-7">
            <Link href="/el-concepto" className="font-medium text-terracotta">
              Conocer el concepto completo →
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
