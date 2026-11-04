import Image from "next/image";
import Link from "next/link";
import { site, waLink } from "@/lib/site";
import Galeria from "@/components/Galeria";
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

/** Los papelitos que acompañan al video. */
const LO_QUE_CUENTA = [
  "Quién es Doña Compra",
  "A quién acompaña",
  "Por qué el barrio merece comprar como los grandes",
] as const;

/**
 * Las pizarras del cliente. Son material de él, hecho para explicar las
 * condiciones en una visita, y las cifras coinciden con las Condiciones
 * Generales: las verifiqué una por una contra `niveles.ts`.
 */
const PIZARRAS = [
  {
    src: "/assets/pizarra-niveles.jpg",
    mini: "/assets/pizarra-niveles-640.jpg",
    alt: "Pizarra con los siete niveles, su cupo de compras y su recargo, de Hierro 18 % a Diamante 12 %",
    pie: "Los siete niveles, con su cupo y su recargo",
  },
  {
    src: "/assets/pizarra-analisis.jpg",
    mini: "/assets/pizarra-analisis-640.jpg",
    alt: "Pizarra con el precio del análisis de ingreso por nivel, de 50.000 a 200.000 guaraníes",
    pie: "Cuánto cuesta el análisis de ingreso",
  },
  {
    src: "/assets/pizarra-pagador-rapido.jpg",
    mini: "/assets/pizarra-pagador-rapido-640.jpg",
    alt: "Pizarra con el recargo estándar y el recargo con descuento de Pagador Rápido para cada nivel",
    pie: "Pagador Rápido: un punto menos de recargo",
  },
  {
    src: "/assets/pizarra-socio-confianza.jpg",
    mini: "/assets/pizarra-socio-confianza-640.jpg",
    alt: "Doña Compra con la insignia de Socio de Confianza junto a la tabla de recargos con descuento",
    pie: "La insignia de Socio de Confianza",
  },
];

/**
 * Las fotos de local que pasó el cliente. Van con el pie encima, sobre un
 * degradado: distinto del muro de pizarras, que lleva el pie debajo de la
 * tarjeta. Dos galerías seguidas con el mismo tratamiento se leerían como la
 * misma sección repetida.
 */
const LOCALES = [
  {
    src: "/assets/local-despensa.jpg",
    mini: "/assets/local-despensa-640.jpg",
    alt: "Interior de una despensa de barrio: verdulería a la entrada, góndolas de almacén y la encargada en el mostrador",
    pie: "Una despensa de barrio",
  },
  {
    src: "/assets/local-comedor.jpg",
    mini: "/assets/local-comedor-640.jpg",
    alt: "Comedor lleno al mediodía, con mesas largas, clientes almorzando y la vitrina de empanadas al fondo",
    pie: "Un comedor en plena hora pico",
  },
  {
    src: "/assets/local-ropa.jpg",
    mini: "/assets/local-ropa-640.jpg",
    alt: "Tienda de ropa y artesanía con perchas, canastos y mantelería, atendiendo a una clienta",
    pie: "Una tienda de ropa y artesanía",
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
          falta.

          Va sobre una banda oscura a propósito. Toda la página corre sobre el
          degradado pastel del manual, y un video vertical metido ahí queda
          como una foto suelta. El fondo oscuro lo convierte en el único foco
          de luz de la sección: la misma razón por la que en el cine se apagan
          las luces. */}
      <section className="relative overflow-hidden bg-navy-dark text-card">
        {/* Trama de puntos y resplandor terracota: textura sin pedir otra
            imagen al servidor. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #fcfcfc 1px, transparent 1.2px)",
            backgroundSize: "24px 24px",
          }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 -right-32 h-[460px] w-[460px] rounded-full bg-terracotta/25 blur-[130px]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-48 -left-40 h-[420px] w-[420px] rounded-full bg-terracotta/15 blur-[140px]"
        />

        <Wrap className="relative">
          <div className="grid items-center gap-[clamp(36px,5vw,76px)] lg:grid-cols-[minmax(0,330px)_1fr]">
            <Revelar>
              <VideoVertical
                src="/video/dona-compra-story.mp4"
                poster="/video/dona-compra-story-poster.jpg"
                titulo="Doña Compra, contada por ella misma"
              />
            </Revelar>

            <Revelar retardo={1}>
              <span className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-terracotta-soft">
                <span aria-hidden="true" className="h-px w-8 bg-terracotta-soft" />
                En diez segundos
              </span>
              <h2 className="mt-4 mb-4 max-w-[16ch] text-card">
                Mejor que te lo{" "}
                <span className="text-terracotta-soft">cuente ella.</span>
              </h2>
              <p className="max-w-[48ch] text-[clamp(16px,1.8vw,18.5px)] text-card/75">
                Arranca solo, en silencio y con los subtítulos a la vista.
                Tocá <span className="whitespace-nowrap">«Con sonido»</span> si
                querés escucharla.
              </p>

              {/* Papelitos: los mismos carteles escritos a mano que salen en
                  el video, pasados a la página. */}
              <ul className="mt-7 flex list-none flex-wrap gap-3 p-0">
                {LO_QUE_CUENTA.map((t, i) => (
                  <li
                    key={t}
                    className={`flex items-center gap-2.5 rounded-[10px] bg-card px-3.5 py-2.5 text-[14px] text-navy shadow-[0_12px_26px_-16px_rgba(0,0,0,0.9)] ${
                      ["-rotate-[1.6deg]", "rotate-[1.2deg]", "-rotate-[0.8deg]"][i]
                    }`}
                  >
                    <span className="grid h-5 w-5 flex-none place-items-center rounded-full bg-terracotta text-[11px] font-semibold text-card">
                      {i + 1}
                    </span>
                    {t}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/el-concepto"
                  className="inline-block rounded-[var(--radius-button)] bg-terracotta px-7 py-3.5 text-sm font-medium tracking-[0.04em] text-card hover:bg-terracotta-ink hover:text-card"
                >
                  Ver cómo funciona
                </Link>
                <Link
                  href="/contacto"
                  className="inline-block rounded-[var(--radius-button)] border border-card/40 px-7 py-3.5 text-sm font-medium tracking-[0.04em] text-card hover:border-card"
                >
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

      {/* Las pizarras del cliente. Van después de los cuatro pasos porque
          responden la pregunta que queda: «bueno, ¿y cuánto me cuesta?». */}
      <section>
        <Wrap>
          <Revelar>
            {/* El título y la bajada van en una fila, no en una columna al
                costado de las fotos: con la galería al lado quedaba media
                página vacía entre el texto y las imágenes. */}
            <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
              <div>
                <Rotulo>En la pizarra</Rotulo>
                <h2 className="mt-4 max-w-[16ch]">Las cuentas, a la vista.</h2>
              </div>
              <p className="max-w-[42ch] text-ink">
                Lo mismo que te explica un asesor en la visita, tal cual se lo
                explica.{" "}
                <Link
                  href="/niveles-y-tarifas"
                  className="font-medium whitespace-nowrap text-terracotta-ink"
                >
                  Ver la tabla completa →
                </Link>
              </p>
            </div>
          </Revelar>

          <Revelar retardo={1}>
            <div className="mt-10">
              <Galeria fotos={PIZARRAS} variante="muro" />
            </div>
          </Revelar>
        </Wrap>
      </section>

      {/* Las fotos de local, entre las pizarras y los rubros: después de las
          cuentas y antes de la lista de oficios, que es donde ayuda ver de
          qué clase de negocio estamos hablando. */}
      <section className="bg-card">
        <Wrap>
          <Revelar>
            <Rotulo>A pie de mostrador</Rotulo>
            <h2 className="mt-4 max-w-[18ch]">Donde esto pasa de verdad.</h2>
            <p className="mt-4 max-w-[56ch] text-ink">
              Una despensa, un comedor, una tienda de ropa. Tres negocios
              distintos con el mismo problema: reponer sin quedarse sin caja.
            </p>
          </Revelar>

          <Revelar retardo={1}>
            <ul className="mt-9 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-3">
              {LOCALES.map((f) => (
                <li
                  key={f.src}
                  className="group relative overflow-hidden rounded-[var(--radius-card)] border border-navy/12 bg-navy"
                >
                  <span className="relative block aspect-[4/3]">
                    <Image
                      src={f.mini}
                      alt={f.alt}
                      fill
                      loading="lazy"
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    />
                  </span>
                  {/* El degradado no es decoración: sin él, el pie blanco cae
                      sobre lo que toque de la foto y a veces no se lee. */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-navy-dark/85 to-transparent"
                  />
                  <span className="absolute bottom-3 left-4 text-[14px] font-medium text-card">
                    {f.pie}
                  </span>
                </li>
              ))}
            </ul>
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
