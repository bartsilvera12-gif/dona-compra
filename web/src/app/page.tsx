import Link from "next/link";
import { site, waLink } from "@/lib/site";
import {
  DESCRIPCION_SERVICIO,
  NIVELES,
  NIVELES_DE_ENTRADA,
  NOMBRE_SERVICIO,
  totalServicios,
  type Servicios,
} from "@/lib/niveles";
import ContactoForm from "@/components/ContactoForm";
import Galeria from "@/components/Galeria";
import Revelar from "@/components/Revelar";
import VideoVertical from "@/components/VideoVertical";
import {
  Cifra,
  Curva,
  MosaicoRubros,
  PasoFoto,
  PortadaPanel,
  Rotulo,
} from "@/components/bloques";
import { btnSecundario, Wrap } from "@/components/ui";

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
    titulo: "Doña Compra paga al contado",
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

/* Los cinco servicios salen del artículo 6 de las Condiciones Generales, vía
   niveles.ts. El rango de precio se calcula, no se escribe: si una tarifa
   cambia en el contrato, cambia acá sola. */
const CLAVES_SERVICIO = Object.keys(NOMBRE_SERVICIO) as (keyof Servicios)[];
const gs = (n: number) => n.toLocaleString("es-PY");
const PRECIO_SERVICIO = (k: keyof Servicios) => {
  const valores = NIVELES.map((n) => n.servicios[k]);
  const min = Math.min(...valores);
  const max = Math.max(...valores);
  return min === max
    ? `Gs. ${gs(min)} por pedido`
    : `Gs. ${gs(min)} a ${gs(max)} por pedido`;
};
const TOTAL_MIN = `Gs. ${gs(totalServicios(NIVELES[0].servicios))}`;
const TOTAL_MAX = `Gs. ${gs(totalServicios(NIVELES[NIVELES.length - 1].servicios))}`;

/* Los tres pasos de la entrada, como los describen las FAQ y el artículo 3 de
   las Condiciones Generales. La referencia que pasó el cliente promete
   afiliación «rapidito» y efectivo «al instante»; acá no se promete ninguna
   de las dos cosas, porque el análisis se paga y la admisión la decide la
   dirección. Decirlo acá evita la decepción de descubrirlo en el paso dos. */
const ENTRADA = [
  {
    titulo: "Pedís la Solicitud de Entrada",
    texto:
      "Es gratuita y se hace por WhatsApp. Elegís con qué nivel querés entrar, de Hierro a Oro.",
    foto: {
      src: "/assets/portada-ropa-640.jpg",
      alt: "Doña Compra conversando con una comerciante en su local",
    },
  },
  {
    titulo: "Hacemos el Análisis de ingreso",
    texto:
      "Un diagnóstico de tu negocio con su informe. Cuesta según el nivel que pidas y no se devuelve si la respuesta es negativa.",
    foto: {
      src: "/assets/pizarra-analisis-640.jpg",
      alt: "Doña Compra junto a la pizarra con el precio del análisis de ingreso",
    },
  },
  {
    titulo: "La dirección decide",
    texto:
      "Si entrás, ya podés armar tu primer pedido con el mayorista que ya conocés. Mandar la solicitud no equivale a ser aceptado.",
    foto: {
      src: "/assets/portada-insignia-640.jpg",
      alt: "Doña Compra con la insignia de Socio de Confianza",
    },
  },
] as const;
const ANALISIS_MIN = `Gs. ${gs(Math.min(...NIVELES_DE_ENTRADA.map((n) => n.analisis as number)))}`;
const ANALISIS_MAX = `Gs. ${gs(Math.max(...NIVELES_DE_ENTRADA.map((n) => n.analisis as number)))}`;

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
  {
    src: "/assets/pizarra-descuento.jpg",
    mini: "/assets/pizarra-descuento-640.jpg",
    alt: "Pizarra de Pagador Rápido en un local, con el recargo estándar y el recargo con descuento de cada nivel",
    pie: "Menos de 25 días para pagar",
  },
];

/**
 * Los doce rubros del material comercial, los mismos que lista el sitio
 * estático. Estaban recortados a ocho y afuera quedaban justo Comedores y
 * Restaurantes, que son dos de los que el cliente fotografió: la foto del
 * comedor no llegaba al inicio.
 */
const RUBROS = [
  { slug: "ropa", nombre: "Ropa" },
  { slug: "calzado", nombre: "Calzado" },
  { slug: "cosmeticos", nombre: "Cosméticos" },
  { slug: "perfumes", nombre: "Perfumes" },
  { slug: "despensas", nombre: "Despensas" },
  { slug: "comedores", nombre: "Comedores" },
  { slug: "libreria", nombre: "Librería" },
  { slug: "bijouterie", nombre: "Bijouterie" },
  { slug: "peluquerias", nombre: "Peluquerías" },
  { slug: "regaleria", nombre: "Regalería" },
  { slug: "revendedoras", nombre: "Revendedoras" },
  { slug: "restaurantes", nombre: "Restaurantes" },
] as const;

export default function Home() {
  return (
    <main>
      {/* Portada a dos mitades, como la referencia. La anterior era un
          collage con el titulo debajo: en una ventana de 500 px no entraba
          nada mas que las fotos, y el mensaje quedaba fuera de la primera
          pantalla. */}
      <PortadaPanel
        rotulo="Gran Asunción, Paraguay"
        // El mensaje maestro, tal cual lo fija la hoja de dirección de
        // comunicación (sección 4). No es una frase a reescribir.
        titulo={
          <>
            Elegí tu mercadería.{" "}
            <span className="text-terracotta-soft">Pagá después!</span>
          </>
        }
        bajada="Doña Compra compra mercaderías y las revende a comercios, con condiciones de pago previamente acordadas. Sujeto a evaluación y a las condiciones comerciales vigentes."
        foto={{
          src: "/assets/portada-insignia-640.jpg",
          alt: "Doña Compra sosteniendo la insignia de Socio de Confianza",
        }}
        // La llamada principal es «Conocé cómo funciona», no la conversión:
        // la hoja pide que el sitio informe primero y convierta después.
        acciones={
          <>
            <Link href="/el-concepto" className={btnSecundario}>
              Conocé cómo funciona
            </Link>
            <Link
              href="#hablemos"
              className="inline-block rounded-full border border-card/45 px-8 py-4 text-[15px] font-semibold tracking-[0.02em] text-card hover:border-card hover:text-card"
            >
              Pedir una visita
            </Link>
          </>
        }
      />

      {/* Las cifras del servicio, antes de explicar cómo funciona. */}
      {/* Las bandas del inicio alternan los cuatro colores del logo, como
          alterna la referencia. Sobre ocre el texto va en verde oscuro:
          el marfil sobre ocre da 1.9 y no llega al minimo. */}
      <section className="bg-ocre text-navy">
        <Wrap>
          <div className="grid gap-[clamp(24px,3vw,40px)] sm:grid-cols-3">
            <Cifra
              valor="30"
              unidad="días"
              texto="Para pagar, desde el retiro efectivo de la mercadería en el mayorista."
              sobreOcre
            />
            <Cifra
              valor="12–18"
              unidad="%"
              texto="Recargo comercial sobre el costo mayorista. Baja a medida que subís de nivel."
              sobreOcre
              retardo={1}
            />
            <Cifra
              valor="24"
              unidad="h"
              texto="Es el plazo de visita que indica nuestro material comercial, sujeto a coordinación."
              sobreOcre
              retardo={2}
            />
          </div>
        </Wrap>
      </section>

      <Curva de="bg-ocre" a="text-navy-dark" />

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
              "radial-gradient(circle, #f7f5ee 1px, transparent 1.2px)",
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
                    <span className="grid h-5 w-5 flex-none place-items-center rounded-full bg-terracotta text-[11px] font-semibold text-navy">
                      {i + 1}
                    </span>
                    {t}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/el-concepto"
                  className="inline-block rounded-[var(--radius-button)] bg-terracotta px-7 py-3.5 text-sm font-medium tracking-[0.04em] text-navy hover:bg-ocre-oscuro hover:text-navy"
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

      {/* Salvia: la carta la reserva para las "secciones humanas". Va en
          un tinte y no a plena saturación porque el verde oscuro sobre
          salvia pura da 4.3 y WCAG AA pide 4.5. */}
      <section className="bg-salvia/25">
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
          responden la pregunta que queda: «bueno, y cuánto me cuesta?». */}
      <section className="bg-card">
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

      <section className="bg-navy text-card">
        <Wrap>
          <Revelar>
            <span className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-terracotta-soft">
              <span aria-hidden="true" className="h-px w-8 bg-terracotta-soft" />
              Rubros
            </span>
            <h2 className="mt-4 max-w-[22ch] text-card">
              Negocios que ya compran con Doña Compra.
            </h2>
            <p className="mt-4 max-w-[56ch] text-card/75">
              Si vendés al público y reponés con un mayorista, probablemente
              encaje con tu negocio.
            </p>
          </Revelar>

          <div className="mt-9">
            <MosaicoRubros rubros={[...RUBROS]} />
          </div>

          <Revelar>
            <p className="mt-8">
              <Link
                href="/comerciante"
                className="font-medium text-terracotta-soft underline underline-offset-2 hover:text-card"
              >
                Ver qué necesitás para empezar →
              </Link>
            </p>
          </Revelar>
        </Wrap>
      </section>

      <Curva de="bg-navy" a="text-grad-start" />

      {/* Los cinco servicios, con tarjeta propia y precio a la vista.
          Estructura tomada de la referencia que pasó el cliente, que pone sus
          servicios en el inicio con una tarjeta cada uno; acá son cinco y no
          tres, y el precio es el del contrato, no una promesa. */}
      <section className="bg-grad-start">
        <Wrap>
          <Revelar>
            <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
              <div>
                <Rotulo>Lo que incluye cada pedido</Rotulo>
                <h2 className="mt-4 max-w-[20ch]">
                  No es solamente comprar mercadería.
                </h2>
              </div>
              <p className="max-w-[40ch] text-ink">
                Cinco servicios acompañan cada operación. Van en la factura,
                con tarifa fija según tu nivel.
              </p>
            </div>
          </Revelar>

          <Revelar retardo={1}>
            <ul className="mt-9 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
              {CLAVES_SERVICIO.map((k, i) => (
                <li
                  key={k}
                  className="flex h-full flex-col rounded-[var(--radius-card)] border border-navy/12 bg-grad-start/50 p-[clamp(18px,2.4vw,26px)]"
                >
                  <span
                    aria-hidden="true"
                    className="mb-3 grid h-9 w-9 place-items-center rounded-full bg-terracotta text-[14px] font-semibold text-navy"
                  >
                    {i + 1}
                  </span>
                  <h3 className="mb-2 text-[clamp(17px,1.9vw,20px)]">
                    {NOMBRE_SERVICIO[k]}
                  </h3>
                  <p className="text-[15px] text-ink">
                    {DESCRIPCION_SERVICIO[k]}
                  </p>
                  <p className="mt-4 font-mono text-[14px] font-semibold text-terracotta-ink">
                    {PRECIO_SERVICIO(k)}
                  </p>
                </li>
              ))}

              {/* La sexta celda cierra la fila de tres y lleva la llamada,
                  para no dejar un hueco vacío al lado de la quinta tarjeta. */}
              <li className="flex h-full flex-col justify-center rounded-[var(--radius-card)] bg-navy p-[clamp(18px,2.4vw,26px)] text-card">
                <h3 className="mb-2 text-card">Todo junto, en una factura.</h3>
                <p className="text-[15px] text-card/75">
                  El total de los cinco va de {TOTAL_MIN} a {TOTAL_MAX} por
                  pedido, según el nivel.
                </p>
                <p className="mt-5">
                  <Link
                    href="/servicios"
                    className="font-medium text-terracotta-soft underline underline-offset-2 hover:text-card"
                  >
                    Ver los cinco en detalle →
                  </Link>
                </p>
              </li>
            </ul>
          </Revelar>
        </Wrap>
      </section>

      {/* Cómo se entra: tres pasos, el formato de la referencia. Va justo
          antes del formulario porque es el último que queda por responder
          antes de escribir. */}
      <section className="bg-salvia/25">
        <Wrap>
          {/* Centrado, como la referencia centra sus bloques de tarjetas. */}
          <Revelar>
            <div className="mx-auto max-w-[56ch] text-center">
              <span className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-muted">
                <span aria-hidden="true" className="h-px w-8 bg-terracotta" />
                Cómo se entra
                <span aria-hidden="true" className="h-px w-8 bg-terracotta" />
              </span>
              <h2 className="mx-auto mt-4 max-w-[18ch]">
                Tres pasos, sin papeleo largo.
              </h2>
              <p className="mt-4 text-ink">
                El trámite se hace por WhatsApp. El Análisis de ingreso va de{" "}
                {ANALISIS_MIN} a {ANALISIS_MAX} según el nivel que pidas.
              </p>
            </div>
          </Revelar>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {ENTRADA.map((p, i) => (
              <PasoFoto
                key={p.titulo}
                n={i + 1}
                titulo={p.titulo}
                texto={p.texto}
                foto={p.foto}
                retardo={(i + 1) as 1 | 2 | 3}
              />
            ))}
          </div>

          <Revelar>
            <p className="mt-9 text-center">
              <Link
                href="/comerciante"
                className="font-medium text-terracotta-ink"
              >
                Ver qué necesitás para empezar →
              </Link>
            </p>
          </Revelar>
        </Wrap>
      </section>

      {/* Hablemos: el mismo formulario de la página de Contacto, no una
          copia. Es el componente de allá con su propia acción de servidor y
          su validación; si cambia, cambia en los dos lados. Reemplaza al
          bloque de cierre que solo enlazaba a Contacto: pedir el dato en la
          misma página ahorra un clic y una página de por medio. */}
      <section id="hablemos" className="scroll-mt-24 bg-navy-dark text-card">
        <Wrap>
          <div className="grid gap-[clamp(28px,4vw,64px)] lg:grid-cols-[minmax(0,34ch)_1fr]">
            <Revelar>
              <span className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-terracotta-soft">
                <span aria-hidden="true" className="h-px w-8 bg-terracotta-soft" />
                Hablemos
              </span>
              <h2 className="mt-4 max-w-[16ch] text-card">
                Empezá con una visita.
              </h2>
              <p className="mt-4 max-w-[44ch] text-card/75">
                Sin compromiso. Conversamos en tu local y te explicamos las
                condiciones. Sujeto a evaluación y a las condiciones
                comerciales vigentes.
              </p>
              <p className="mt-6 text-[14.5px] text-card/70">
                Si preferís escribir,{" "}
                <a
                  href={waLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-terracotta-soft underline underline-offset-2 hover:text-card"
                >
                  mandanos un WhatsApp
                </a>{" "}
                al {site.phone}. {site.plazo}
              </p>
            </Revelar>

            <Revelar retardo={1}>
              {/* La tarjeta va en marfil: el formulario tiene campos, foco y
                  mensajes de error, y todo eso está pensado y medido sobre
                  fondo claro. */}
              <div className="rounded-[var(--radius-card)] bg-card p-[clamp(18px,3vw,32px)]">
                <ContactoForm />
              </div>
            </Revelar>
          </div>
        </Wrap>
      </section>
    </main>
  );
}
