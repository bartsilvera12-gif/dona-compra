# Doña Compra

Sitio de **Doña Compra** — comprá mercadería para tu negocio y pagá después (Gran Asunción, Paraguay).

Sitio estático de una sola página, con ruteo por hash (`#/el-concepto`, `#/anuncios`, etc.).

## Estructura

| Archivo | Para qué sirve |
| --- | --- |
| `index.html` | Página publicada (copia de `Doña Compra.dc.html`) |
| `Doña Compra.dc.html` | Fuente editable en el editor dc |
| `Doña Compra v1.dc.html` | Versión anterior, archivada |
| `support.js`, `image-slot.js` | Runtime dc (generado, no editar a mano) |
| `assets/` | Imágenes usadas por la página |
| `uploads/` | Material fuente (originales, PDFs, capturas). No se publica |
| `robots.txt`, `sitemap.xml` | SEO técnico |

## Las 8 páginas

| Ruta | Página |
| --- | --- |
| `#/` | Inicio |
| `#/el-concepto` | El Concepto |
| `#/comerciante` | Comerciantes |
| `#/mayoristas` | Mayoristas |
| `#/club` | El Club Doña Compra (ventajas + acceso de miembros) |
| `#/anuncios` | Anuncios (feed con filtros, lightbox, boletín) |
| `#/juridica` | Jurídica (aviso legal, CGU, privacidad, cookies) |
| `#/contacto` | Contacto |

Páginas de detalle heredadas: `#/como-funciona`, `#/para-tu-negocio`, `#/niveles-y-tarifas`, `#/servicios`, `#/nosotros`, `#/preguntas-frecuentes`.

## Identidad visual

El sitio sigue el manual de marca:

| Token | Valor |
| --- | --- |
| Azul marino (dominante, títulos) | `#1A365D` |
| Terracota (acentos, montos) | `#C25E38` |
| Texto corriente | `#4A4A4A` |
| Tarjetas | `#FCFCFC` |
| Fondo | Degradado `#E3ECF5` → `#FDF0EF` |
| Títulos | Montserrat 600 / 700 |
| Texto | Inter 400 / 500 |
| Esquinas | 12 px tarjetas, 8 px botones |

Los colores están escritos en estilos en línea. Para cambiarlos, buscar y reemplazar el token en todo el archivo.

## Configuración

Los datos de contacto son **props** editables desde el editor dc, sin tocar el markup:

| Prop | Para qué | Estado |
| --- | --- | --- |
| `phone` | WhatsApp | Cargado |
| `email` | Correo de contacto | Cargado |
| `horario`, `plazo` | Horarios y plazo de respuesta | Cargado |
| `urlFacebook`, `urlInstagram`, `urlSitio` | Botones de redes | **Vacío** — los botones no aparecen hasta cargarlos |
| `gaId` | ID de Google Analytics 4 | **Vacío** — sin esto no se carga analítica |
| `razonSocial`, `ruc`, `domicilio` | Datos de la página Jurídica | `ruc` **vacío** |

## Pendiente

**Datos que faltan**

- URLs de Facebook e Instagram.
- ID de medición de GA4 y alta en Search Console.
- RUC y razón social definitivos para el aviso legal.
- Logo en SVG, en blanco y negro y cuadrado 512×512 que pide el manual. Hoy solo hay `dona-compra-logo.jpg`.

**Validación legal**

Los textos de la página Jurídica son una base redactada para el sitio, no un documento validado. Deben ser revisados por un profesional antes de publicar. La página lo advierte en pantalla.

**Necesita backend (no se puede en un sitio estático)**

- Cuentas de usuario con roles (comerciante / mayorista / miembro del club). Hoy el acceso al Club es una pantalla que informa que no está habilitado.
- Back-office de administración (anuncios, publicaciones, mensajes, usuarios, estadísticas).
- Moderación previa real de publicaciones.
- Feed de anuncios con datos reales. Hoy usa 8 publicaciones de ejemplo definidas en la constante `POSTS`.
- Me gusta y compartir persistentes. Hoy el me gusta vive solo en la sesión del navegador.
- Boletín conectado a Brevo o Mailchimp. Hoy el formulario valida el correo pero no lo envía a ningún lado.
- Notificaciones por correo y envío del formulario por servidor. Hoy el formulario arma el mensaje y lo abre en WhatsApp, con alternativa por `mailto:`.

**Videos**

Las tarjetas de video están maquetadas en 9:16 con portada y botón de reproducción. Falta elegir el alojamiento externo (Cloudflare Stream, Vimeo o YouTube no listado) y conectar el reproductor.

**Imágenes**

Las fotos son JPG. Para cumplir el punto de rendimiento del pliego hay que generar WebP/AVIF, lo que requiere un paso de build.

**SEO con ruteo por hash**

El `<title>`, la descripción y el canonical cambian por página, y hay datos estructurados Schema.org. Pero los buscadores **no indexan `#/ruta` como páginas separadas**: para eso hacen falta URLs reales, que requieren migrar a un framework con rutas (por ejemplo Next.js). Por eso `sitemap.xml` solo declara la raíz.

**Alojamiento y RGPD**

Vercel sirve desde una red global. Si el alojamiento en la UE es un requisito firme del RGPD, hay que fijar región europea (plan Pro) o mover el alojamiento.

## Ver en local

```bash
npx serve .
```

Y abrir http://localhost:3000

## Deploy en Vercel

El proyecto no necesita build: Vercel sirve los archivos estáticos tal cual.

- **Framework preset:** Other
- **Build command:** (vacío)
- **Output directory:** (vacío / raíz)

`vercel.json` define el cacheo de `assets/` y `.vercelignore` excluye `uploads/` del deploy.

## Al editar

Después de cambiar `Doña Compra.dc.html`, regenerá la página publicada:

```bash
cp "Doña Compra.dc.html" index.html
```
