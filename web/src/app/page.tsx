import Link from "next/link";
import { site, waLink } from "@/lib/site";
import Revelar from "@/components/Revelar";
import VideoVertical from "@/components/VideoVertical";
import {
  Cifra,
  MosaicoRubros,
  PasoFoto,
  PortadaCollage,
  Rotulo,
} from "@/components/bloques";
import { btnPrimario, btnSecundario, CTA, Wrap } from "@/components/ui";

/**
 * Datos estructurados del video. Sin esto el buscador ve una etiqueta <video>
 * y poco más; con esto puede mostrar el clip como resultado de video, con su
 * miniatura y su duración.
 */
const VIDEO_JSONLD = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: "Doña Compra, contada por ella misma",
  description:
    "Presentación en video de Doña Compra: qué es, a quién acompaña y cómo trabaja con los comercios de barrio de Gran Asunción.",
  thumbnailUrl: `${site.url}/video/dona-compra-story-poster.jpg`,
  contentUrl: `${site.url}/video/dona-compra-story.mp4`,
  // ISO 8601: diez segundos.
  duration: "PT10S",
  uploadDate: "2026-11-04",
};

const PASOS = [
  {
    titulo: "Elegís vos",
    texto: "El producto y el proveedor los elegís vos, con el mayorista que ya conocés.",
    foto: { src: "/assets/paso-1.jpg", alt: "Comerciante eligiendo mercadería" },
  },
  {
    titulo: "Doña paga al contado",
    texto: "Pagamos la mercadería al proveedor en el momento, como cualquier venta de contado.",
    foto: { src: "/assets/paso-2.jpg", alt: "Pago al proveedor" },
  },
  {
    titulo: "Retirás con código",
    texto: "Un código único de retiro, de un solo uso, con responsable registrado.",
    foto: { src: "/assets/paso-3.jpg", alt: "Retiro de la mercadería" },
  },
  {
    titulo: "Pagás después",
    texto: "Hasta 30 días desde el retiro efectivo en el mayorista, según las condiciones acordadas en la visita.",
    foto: { src: "/assets/paso-4.jpg", alt: "Pago posterior a la venta" },
  },
] as const;

const RUBROS = [
  { slug: "ropa", nombre: "Ropa" },
  { slug: "calzado", nombre: "Calzado" },
  { slug: "cosmeticos", nombre: "Cosméticos" },
  { slug: "perfumes", nombre: "Perfumes" },
  { slug: "despensas", nombre: "Despensas" },
  { slug: "libreria", nombre: "Librería" },
  { slug: "bijouterie", nombre: "Bijouterie" },
  { slug: "peluquerias", nombre: "Peluquerías" },
] as const;

export default function Home() {
  return (
    <main>
      <PortadaCollage
        rotulo="Gran Asunción, Paraguay"
        titulo={
          <>
            Elegí tu mercadería y{" "}
            <span className="text-terracotta-ink">pagá después.</span>
          </>
        }
        bajada="Vos elegís el producto y el proveedor, con el mayorista que ya conocés. Doña Compra paga al contado y vos pagás en hasta 30 días, según las condiciones acordadas."
        fotos={[
          { src: "/assets/hero-1-640.jpg", alt: "Despensa de barrio" },
          { src: "/assets/hero-2-640.jpg", alt: "Góndola de almacén" },
          { src: "/assets/hero-3-640.jpg", alt: "Mercadería lista para retirar" },
          { src: "/assets/hero-4-640.jpg", alt: "Comercio con stock repuesto" },
        ]}
        acciones={
          <>
            <Link href="/contacto" className={btnPrimario}>
              Pedir una visita
            </Link>
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className={btnSecundario}
            >
              Escribir por WhatsApp
            </a>
          </>
        }
      />

      {/* Las cifras del servicio, antes de explicar cómo funciona. */}
      <section>
        <Wrap>
          <div className="grid gap-[clamp(24px,3vw,40px)] sm:grid-cols-3">
            <Cifra
              valor="30"
              unidad="días"
              texto="Para pagar, desde el retiro efectivo de la mercadería en el mayorista."
            />
            <Cifra
              valor="12–18"
              unidad="%"
              texto="Recargo comercial sobre el costo mayorista. Baja a medida que subís de nivel."
              retardo={1}
            />
            <Cifra
              valor="24"
              unidad="h"
              texto="Es el plazo de visita que indica nuestro material comercial, sujeto a coordinación."
              retardo={2}
            />
          </div>
        </Wrap>
      </section>

      {/* El video va acá, entre las cifras y la explicación: después de los
          números y antes del procedimiento, que es donde una cara hace más
          falta. El formato 9:16 pide una columna angosta, así que comparte
          fila con el texto en vez de quedar solo en el medio. */}
      <section>
        <Wrap>
          <div className="grid items-center gap-[clamp(24px,4vw,56px)] lg:grid-cols-[340px_1fr]">
            <Revelar>
              <VideoVertical
                src="/video/dona-compra-story.mp4"
                poster="/video/dona-compra-story-poster.jpg"
                titulo="Doña Compra, contada por ella misma"
              />
            </Revelar>

            <Revelar retardo={1}>
              <Rotulo>En diez segundos</Rotulo>
              <h2 className="mt-4 mb-3 max-w-[20ch]">
                Mejor que te lo cuente ella.
              </h2>
              <p className="max-w-[52ch] text-[clamp(16px,1.8vw,18.5px)] text-ink">
                Quién es Doña Compra, a quién acompaña y por qué el comercio de
                barrio merece comprar como compran los grandes.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/el-concepto" className={btnPrimario}>
                  Ver cómo funciona
                </Link>
                <Link href="/contacto" className={btnSecundario}>
                  Pedir una visita
                </Link>
              </div>
            </Revelar>
          </div>
        </Wrap>
      </section>

      <script
        type="application/ld+json"
        // El contenido es un objeto nuestro, no entra nada del usuario.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(VIDEO_JSONLD) }}
      />

      <section className="bg-card">
        <Wrap>
          <Revelar>
            <Rotulo>Cómo funciona</Rotulo>
            <h2 className="mt-4 max-w-[20ch]">Cuatro pasos, sin vueltas.</h2>
          </Revelar>

          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PASOS.map((p, i) => (
              <PasoFoto
                key={p.titulo}
                n={i + 1}
                titulo={p.titulo}
                texto={p.texto}
                foto={p.foto}
                retardo={(i + 1) as 1 | 2 | 3 | 4}
              />
            ))}
          </div>

          <Revelar>
            <p className="mt-8">
              <Link href="/el-concepto" className="font-medium text-terracotta-ink">
                Conocer el concepto completo →
              </Link>
            </p>
          </Revelar>
        </Wrap>
      </section>

      <section>
        <Wrap>
          <Revelar>
            <Rotulo>Rubros</Rotulo>
            <h2 className="mt-4 max-w-[22ch]">
              Negocios que ya compran con Doña.
            </h2>
            <p className="mt-4 max-w-[56ch] text-ink">
              Si vendés al público y reponés con un mayorista, probablemente
              encaje con tu negocio.
            </p>
          </Revelar>

          <div className="mt-9">
            <MosaicoRubros rubros={[...RUBROS]} />
          </div>

          <Revelar>
            <p className="mt-8">
              <Link href="/comerciante" className="font-medium text-terracotta-ink">
                Ver qué necesitás para empezar →
              </Link>
            </p>
          </Revelar>
        </Wrap>
      </section>

      <CTA
        titulo="Empezá con una visita"
        texto="Sin costo y sin compromiso. Conversamos en tu local y te explicamos las condiciones."
      />
    </main>
  );
}
