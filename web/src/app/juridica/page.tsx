import type { Metadata } from "next";
import { site } from "@/lib/site";
import { Aviso, Hero, Section, Wrap } from "@/components/ui";
import CookiePrefsInline from "@/components/CookiePrefsInline";

export const metadata: Metadata = {
  title: "Información jurídica",
  description:
    "Aviso legal, condiciones generales de uso, política de privacidad y política de cookies de Doña Compra.",
};

const SECCIONES = [
  ["aviso-legal", "Aviso legal"],
  ["condiciones", "Condiciones generales de uso"],
  ["privacidad", "Política de privacidad"],
  ["cookies", "Política de cookies"],
] as const;

/* Las cuatro secciones van apiladas y no en pestañas: el texto legal tiene
   que estar entero en el DOM para que sea indexable, imprimible y legible
   por un lector de pantalla sin tener que accionar nada. */

function H({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-28">
      {children}
    </h2>
  );
}

function Sub({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-7 mb-2">{children}</h3>;
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 max-w-[74ch] text-ink">{children}</p>;
}

function Lista({ children }: { children: React.ReactNode }) {
  return (
    <ul className="mb-3 max-w-[74ch] list-disc pl-5 leading-relaxed text-ink">
      {children}
    </ul>
  );
}

export default function JuridicaPage() {
  const mailto = `mailto:${site.email}`;
  const correo = (
    <a href={mailto} className="text-terracotta-ink underline">
      {site.email}
    </a>
  );

  return (
    <main>
      <Hero
        eyebrow="Información jurídica"
        titulo="Aviso legal y condiciones"
        bajada="Aviso legal, condiciones generales de uso, política de privacidad y política de cookies de este sitio."
      />

      <section className="bg-card">
        <Wrap>
          <Aviso titulo="Texto pendiente de validación legal">
            Estas cláusulas son una base redactada para el sitio. Antes de
            publicar, deben ser revisadas por un profesional y completadas con
            el RUC, la razón social y el domicilio definitivos.
          </Aviso>

          <nav aria-label="Índice" className="mt-8 flex flex-wrap gap-2">
            {SECCIONES.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                className="rounded-[var(--radius-button)] border border-navy/25 px-4 py-2.5 text-[13.5px] text-ink hover:border-terracotta"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="mt-12">
            <H id="aviso-legal">Aviso legal</H>
            <Sub>Titular del sitio</Sub>
            <P>
              Razón social: {site.razonSocial}.
              <br />
              RUC: {site.ruc || "pendiente de carga"}.
              <br />
              Domicilio: {site.domicilio}.
              <br />
              Correo de contacto: {correo}.
            </P>
            <Sub>Objeto</Sub>
            <P>
              Este sitio presenta los servicios de compra de mercadería con
              pago diferido que {site.razonSocial} ofrece a comerciantes de{" "}
              {site.zona}. La información publicada tiene carácter informativo
              y no constituye una oferta contractual vinculante.
            </P>
            <Sub>Propiedad intelectual</Sub>
            <P>
              Los textos, el logotipo, las fotografías y los demás elementos
              del sitio pertenecen a {site.razonSocial} o se utilizan con
              autorización. Su reproducción total o parcial sin consentimiento
              previo por escrito no está permitida.
            </P>
            <Sub>Responsabilidad</Sub>
            <P>
              {site.razonSocial} procura mantener la información actualizada,
              pero no garantiza que esté libre de errores. Las condiciones
              comerciales aplicables a cada operación son las que consten en el
              acuerdo firmado y en la factura correspondiente.
            </P>
            <Sub>Alojamiento</Sub>
            <P>
              El sitio está alojado en una plataforma de publicación web. Los
              datos de la empresa proveedora y la región de los servidores
              deben completarse aquí antes de la puesta en producción.
            </P>
          </div>

          <div className="mt-14">
            <H id="condiciones">Condiciones generales de uso</H>
            <Sub>Aceptación</Sub>
            <P>
              El uso de este sitio implica la aceptación de estas condiciones.
              Si no estás de acuerdo con ellas, te pedimos que no utilices el
              sitio.
            </P>
            <Sub>Uso permitido</Sub>
            <Lista>
              <li>Consultar la información publicada y los anuncios.</li>
              <li>Enviar consultas a través del formulario de contacto.</li>
              <li>Suscribirte al boletín si lo deseás.</li>
            </Lista>
            <Sub>Uso prohibido</Sub>
            <Lista>
              <li>
                Enviar contenidos ilícitos, engañosos, ofensivos o que
                infrinjan derechos de terceros.
              </li>
              <li>
                Intentar acceder sin autorización a zonas restringidas o
                alterar el funcionamiento del sitio.
              </li>
              <li>
                Extraer datos de forma automatizada con fines comerciales sin
                autorización.
              </li>
            </Lista>
            <Sub>Publicaciones y moderación</Sub>
            <P>
              Las publicaciones de la página de anuncios pasan por moderación
              previa. {site.razonSocial} puede no publicar o retirar cualquier
              contenido que no cumpla estas condiciones, sin que ello genere
              derecho a indemnización. El contenido aportado por mayoristas y
              comerciantes es responsabilidad de quien lo publica.
            </P>
            <Sub>Enlaces externos</Sub>
            <P>
              El sitio puede enlazar a servicios de terceros, como WhatsApp o
              redes sociales. {site.razonSocial} no controla esos servicios ni
              responde por sus contenidos o políticas.
            </P>
            <Sub>Ley aplicable</Sub>
            <P>
              Estas condiciones se rigen por la legislación de la República del
              Paraguay. Para cualquier controversia, las partes se someten a
              los tribunales de Asunción, sin perjuicio de los derechos que la
              normativa reconozca al consumidor.
            </P>
          </div>

          <div className="mt-14">
            <H id="privacidad">Política de privacidad</H>
            <P>
              Esta política explica qué datos personales tratamos, con qué
              finalidad y qué derechos tenés sobre ellos. Se redactó siguiendo
              el Reglamento General de Protección de Datos europeo (RGPD) y la
              Ley N.º 6534/2020 de protección de datos personales crediticios
              del Paraguay.
            </P>
            <Sub>Responsable del tratamiento</Sub>
            <P>
              {site.razonSocial}, con domicilio en {site.domicilio}. Contacto:{" "}
              {correo}.
            </P>
            <Sub>Qué datos recogemos</Sub>
            <Lista>
              <li>
                <strong>Formulario de contacto:</strong> nombre, apellido,
                correo, teléfono, asunto y el mensaje que escribas. Si elegís
                comerciante o mayorista, también el nombre del negocio y la
                ciudad.
              </li>
              <li>
                <strong>Boletín:</strong> tu dirección de correo.
              </li>
              <li>
                <strong>Seguridad:</strong> un hash con sal de tu dirección IP,
                no la IP en sí, para limitar envíos abusivos del formulario.
              </li>
              <li>
                <strong>Navegación:</strong> datos de uso anónimos, únicamente
                si aceptás las cookies de medición.
              </li>
            </Lista>
            <Sub>Para qué los usamos y con qué base</Sub>
            <Lista>
              <li>
                Responder tu consulta y coordinar una visita comercial. Base:
                tu consentimiento y las gestiones previas al contrato.
              </li>
              <li>
                Enviarte el boletín, si te suscribiste y lo confirmaste. Base:
                tu consentimiento, revocable en cualquier momento.
              </li>
              <li>
                Medir el uso del sitio para mejorarlo. Base: tu consentimiento
                mediante el banner de cookies.
              </li>
            </Lista>
            <Sub>Cuánto tiempo los guardamos</Sub>
            <P>
              Las consultas se conservan mientras dure la gestión y hasta tres
              años después del último contacto. Los datos del boletín, hasta
              que te des de baja. Los datos de medición, el plazo que fije la
              herramienta de analítica.
            </P>
            <Sub>Dónde se guardan</Sub>
            <P>
              En servidores ubicados en la Unión Europea. Aunque la empresa
              opera en Paraguay, elegimos esa ubicación por ser la más
              protectora respecto del RGPD.
            </P>
            <Sub>Con quién los compartimos</Sub>
            <P>
              No vendemos ni cedemos tus datos. Pueden acceder a ellos los
              proveedores que nos prestan servicios técnicos, como el
              alojamiento web, la base de datos, la herramienta de envío de
              correos y la de analítica, siempre bajo contrato y por nuestra
              instrucción. Si enviás tu consulta por WhatsApp, ese mensaje se
              rige además por las condiciones de ese servicio.
            </P>
            <Sub>Tus derechos</Sub>
            <P>
              Podés pedirnos acceder a tus datos, rectificarlos, suprimirlos,
              limitar u oponerte a su tratamiento, y solicitar su portabilidad.
              También podés retirar tu consentimiento en cualquier momento, sin
              que ello afecte a lo ya realizado. Escribinos a {correo}. Si
              considerás que no atendimos tu solicitud, podés reclamar ante la
              autoridad de control que corresponda.
            </P>
            <Sub>Seguridad</Sub>
            <P>
              El sitio se sirve por HTTPS. Aplicamos medidas técnicas y
              organizativas razonables para proteger los datos frente a accesos
              no autorizados, pérdida o alteración.
            </P>
          </div>

          <div className="mt-14">
            <H id="cookies">Política de cookies</H>
            <P>
              Una cookie es un pequeño archivo que un sitio guarda en tu
              navegador. Este sitio usa la mínima cantidad posible.
            </P>
            <Sub>Cookies necesarias</Sub>
            <P>
              Guardamos únicamente tu decisión sobre el banner de cookies, para
              no volver a preguntártelo en cada visita. No requiere
              consentimiento porque es imprescindible para respetar tu
              elección.
            </P>
            <Sub>Cookies de medición</Sub>
            <P>
              Si las aceptás, cargamos Google Analytics 4 con la IP anonimizada
              para saber qué páginas se visitan más. Si las rechazás, el script
              no se carga en ningún momento.
            </P>
            <Sub>Sin rastreadores de terceros</Sub>
            <P>
              No usamos captcha de terceros ni botones sociales que carguen
              código externo. Los enlaces a redes sociales son enlaces comunes:
              no envían datos tuyos hasta que los hagas clic.
            </P>
            <Sub>Cómo cambiar tu decisión</Sub>
            <P>
              Podés cambiarla cuando quieras desde el siguiente botón, o
              borrando los datos del sitio en tu navegador.
            </P>
            <CookiePrefsInline />
          </div>
        </Wrap>
      </section>

      <Section>
        <p className="text-xs text-muted">
          Última actualización: noviembre de 2026.
        </p>
      </Section>
    </main>
  );
}
