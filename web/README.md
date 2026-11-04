# Doña Compra — versión Next.js

Migración del sitio a Next.js 16 (App Router). Cada página es una **URL real**,
no un `#/hash`, así que los buscadores las indexan por separado.

El sitio estático de la carpeta raíz **sigue publicado** mientras esta versión
avanza. Cuando esté completa, se cambia el *Root Directory* del proyecto en
Vercel a `web/`.

## Estado

| Parte | Estado |
| --- | --- |
| Diseño, header, footer, banner de cookies | Listo |
| Formulario de contacto (servidor) | Listo |
| Boletín con doble opt-in | Listo |
| Inicio | Portado, versión corta |
| Concepto, Comerciantes, Mayoristas | Portadas |
| El Club | Portada: espacio publicitario para las marcas que acompañan |
| Jurídica | Portada, con las 4 secciones apiladas e índice |
| Preguntas frecuentes | Portada, con datos estructurados FAQPage |
| Feed de anuncios | Listo: filtros por URL, paginado, detalle por publicación |
| Me gusta y compartir | Listos (los me gusta necesitan la base conectada) |
| Cuentas con roles y acceso | Listo |
| Back-office: resumen, mensajes, moderación, boletín | Listo |
| Alta y edición de publicaciones desde el panel | Listo |
| Niveles y tarifas, con calculadora | Listo |
| Servicios y Nosotros | Listos |
| Gestión de cuentas desde el panel | Listo |
| Cambio de contraseña y sesiones propias | Listo |
| Subida de imágenes | Lista: se reprocesan a WebP y se les borran los metadatos |
| Alojamiento de videos | Pendiente: falta elegir el proveedor externo |
| Área del Club para miembros | Pendiente: el panel es solo para admin |
| Notificaciones por correo al moderar | Pendiente |

## Arrancar

```bash
npm install
```

```bash
cp .env.example .env.local
```

```bash
npm run dev
```

> En desarrollo, el panel del navegador integrado no puede abrir el websocket
> de recarga en caliente y React no llega a hidratarse. No es un problema del
> código: con `npm run build && npm start` funciona normalmente. En un
> navegador externo, `npm run dev` anda bien.

## Verificar

```bash
npm run check
```

Dice si la base conecta, en qué región está, si faltan tablas, si la API key
de correo sirve y si el remitente pertenece a un dominio verificado. No
imprime ningún secreto, así que se puede correr y pegar la salida sin riesgo.

```bash
npm run check:contraste
```

```bash
npm run check:imagenes
```

Prueba la validación y el reprocesado de imágenes contra el módulo real: que
acepte los formatos válidos, que rechace SVG, PDF, HTML y archivos corruptos,
que borre los metadatos EXIF y que el nombre del archivo no se use tal cual.

Mide cada combinación de color del sitio contra WCAG AA (4.5:1 para texto
normal, 3:1 para texto grande y elementos de interfaz), que es lo que pide el
pliego. Falla con código distinto de cero si alguna no llega.

### Accesibilidad del color

Dos colores del manual no alcanzan AA para texto y tienen variante propia:

| Uso | Color | Por qué |
| --- | --- | --- |
| Acentos, bordes | `--color-terracotta` `#C25E38` | El del manual. Da 4.13 sobre la tarjeta: alcanza para elementos de interfaz (3:1), no para texto |
| Texto y fondos de botón | `--color-terracotta-ink` `#AE5432` | Mismo tono y saturación, algo más oscuro. 4.98 y 4.59 |
| Bordes y fondos de error | `--color-error` `#EF4444` | El del manual |
| Texto de error | `--color-error-ink` `#C0392B` | El del manual da 3.67 sobre tarjeta, insuficiente para texto |

Sobre fondo oscuro el terracota no sirve en ninguna de las dos variantes
(3.47 y 3.11): ahí va `--color-terracotta-soft` `#E8A98E`, que da 7.35.

## Variables de entorno

Ninguna es obligatoria para que el sitio levante. Sin base de datos y sin
correo, el formulario sigue en pie y ofrece WhatsApp como alternativa, en vez
de romperse.

| Variable | Para qué | Si falta |
| --- | --- | --- |
| `DATABASE_URL` | Postgres (Neon) | No se guardan consultas; el boletín se desactiva |
| `RESEND_API_KEY` + `MAIL_FROM` | Envío de correo | No se envía nada; se ofrece WhatsApp |
| `MAIL_TO` | Destino de las consultas | Usa `NEXT_PUBLIC_EMAIL` |
| `IP_HASH_SALT` | Sal para hashear IPs | Usa una sal por defecto (cambiala en producción) |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 | No se carga analítica, ni con consentimiento |
| `NEXT_PUBLIC_FACEBOOK` / `_INSTAGRAM` | Botones de redes | El botón no se muestra |
| `NEXT_PUBLIC_RUC` | Página jurídica | Se muestra "RUC pendiente de carga" |

## Base de datos

El driver se elige solo según a dónde apunte `DATABASE_URL`: HTTP para Neon
(lo que conviene en funciones serverless) y el protocolo nativo para un
Postgres común. Antes el proyecto solo hablaba con Neon, así que no se podía
levantar sin crear una cuenta primero, que es una barrera absurda para probar
un cambio.

### Levantar una base local

Con un Postgres instalado en la máquina:

```bash
createdb dona_compra
```

Después poné en `web/.env.local`:

```bash
DATABASE_URL=postgresql://USUARIO:CLAVE@localhost:5432/dona_compra
```

Y creá las tablas, los datos de ejemplo y una cuenta de administración:

```bash
cd web && npm run db:migrate && npm run db:seed
```

```bash
cd web && npm run admin:crear -- vos@ejemplo.com "Tu Nombre"
```


Postgres en Neon, **región europea (Frankfurt)**. Es donde viven los datos
personales de las consultas y del boletín, y la decisión queda del lado
conservador respecto al RGPD. El negocio opera en Paraguay bajo la Ley
6534/2020; si preferís latencia sobre esto, se cambia a una región americana.

```bash
npm run db:generate
```

```bash
npm run db:migrate
```

Cuatro tablas: `mensajes` (consultas del formulario), `suscriptores`
(boletín), `publicaciones` (anuncios) y `reacciones` (me gusta).

```bash
npm run db:seed
```

Carga las publicaciones de ejemplo. Es idempotente: reconoce por `slug`, así
que correrlo dos veces no duplica nada.

### Composición y movimiento

Los bloques visuales viven en `src/components/bloques.tsx`: portada con
collage, portada con foto, paso numerado con imagen, cifra destacada, fila
alterna y mosaico de rubros. Las páginas se arman con ellos en vez de repetir
rejillas de tarjetas iguales.

`Revelar` anima la entrada de un bloque cuando aparece en pantalla. Tres
cuidados que conviene no perder:

- **Sin JavaScript nada se oculta.** El CSS solo esconde si `<html>` tiene la
  clase `js`, que agrega un script en línea. Una animación no puede dejar
  contenido invisible.
- **Red de seguridad de 10 segundos**: si el observador no llegara a
  dispararse, el bloque se muestra igual.
- **`prefers-reduced-motion`** desactiva la animación y el contenido aparece
  directamente.

El estado del revelado vive en un atributo del DOM, no en React: así no hay
un render por cada elemento que entra mientras se hace scroll.

### Rutas heredadas del sitio estático

`/como-funciona` y `/para-tu-negocio` redirigen de forma permanente a
`/el-concepto` y `/comerciante`: su contenido ya vive ahí y volver a crearlas
sería contenido duplicado, que reparte la autoridad entre dos URLs que dicen
lo mismo. Los enlaces y marcadores viejos siguen funcionando.

`/niveles-y-tarifas`, `/servicios` y `/nosotros` sí existen como páginas
propias, porque su contenido no está en ninguna otra.

### Niveles y tarifas

Los importes viven en `src/lib/niveles.ts` y son los del material comercial:
margen del 12 %, seguro de Gs. 4.000, análisis de Gs. 3.000 y el Pack según
nivel. La calculadora y la tabla leen de ahí, así que un cambio de tarifa se
hace en un solo lugar.

La calculadora dice en pantalla que es una estimación, no una cotización: el
nivel y las condiciones se definen en la visita.

### Cuentas y panel

No hay registro público a propósito. La primera cuenta se crea por consola:

```bash
npm run admin:crear -- correo@ejemplo.com "Nombre Apellido"
```

Genera una contraseña al azar y la imprime **una sola vez**. Guardala en tu
gestor de contraseñas: no queda almacenada en claro en ningún lado. Si la
corrés sobre una cuenta que ya existe, cambia la contraseña y cierra sus
sesiones abiertas.

El panel vive en `/admin` y solo lo ve el rol `admin`. Roles previstos:
`admin`, `comerciante`, `mayorista` y `miembro`.

Decisiones de seguridad que conviene no revertir sin pensarlo:

- **Contraseñas con scrypt**, que viene en Node, con sal por usuario y los
  parámetros de coste guardados dentro del hash para poder subirlos después
  sin invalidar los existentes. La comparación es en tiempo constante.
- **Sesiones en base, no JWT.** Con un token firmado no se puede cerrar una
  sesión antes de que venza; para un panel de administración eso no alcanza.
  En la cookie viaja un token aleatorio y en la base se guarda su SHA-256, así
  que leer la tabla no da cookies utilizables.
- **Cookie `httpOnly` y `sameSite: lax`**: inaccesible desde JavaScript y no
  viaja en peticiones de otros sitios.
- **Falla cerrada**: si la base no está disponible, no hay sesión y el panel
  redirige al acceso. Nunca al revés.
- **Cada acción de servidor del panel vuelve a exigir el rol.** Que el layout
  lo haga no alcanza: una acción se puede invocar directamente, sin pasar por
  la página que la contiene.
- **Un único mensaje de error al entrar.** Distinguir "ese correo no existe"
  de "la contraseña es incorrecta" permite averiguar qué direcciones están
  registradas. Por lo mismo, cuando el correo no existe se verifica igual
  contra un hash señuelo, para que la demora no lo delate.
- **Límite de intentos**: 8 por correo cada 15 minutos, y el triple por
  origen, porque detrás de una misma salida a internet puede haber una
  oficina entera.
- **Una cuenta suspendida pierde el acceso en la siguiente petición**, sin
  esperar a que venza la sesión.

#### Nadie puede dejarse afuera

El panel se vuelve inaccesible si el único administrador se saca el acceso a
sí mismo, y de ahí solo se sale por consola. Por eso, en `/admin/usuarios`:

- Un admin **no puede** cambiarse el rol, suspenderse ni borrarse.
- **No se puede** bajar de rol, suspender ni borrar al último admin activo.
- **No se puede** restablecer la propia contraseña desde la lista: eso cierra
  todas las sesiones, y al cerrarse la actual el panel redirige al acceso
  antes de que se alcance a leer la contraseña generada. Para cambiarla está
  Mi cuenta, que conserva la sesión de este navegador.

Las guardas están en el servidor; en la interfaz los botones aparecen
desactivados para no ofrecer algo que va a ser rechazado.

#### Contraseñas de cuentas nuevas

Se generan al azar (24 caracteres) y se muestran **una sola vez** en pantalla.
No se envían por correo ni quedan en claro en ningún lado: si se pierden, hay
que restablecerlas. Restablecer una contraseña cierra las sesiones de esa
cuenta.

Cambiar la propia contraseña desde Mi cuenta cierra **las demás** sesiones,
no la del navegador en uso: si se cambió por sospecha, quien la tuviera queda
afuera y la persona sigue trabajando. Pide la contraseña actual, así una
sesión robada no alcanza para apropiarse de la cuenta.

### Subida de imágenes

Las imágenes van a Vercel Blob, no al disco del servidor: en una función
serverless el sistema de archivos es efímero y lo que se escriba se pierde en
el siguiente despliegue. Sin `BLOB_READ_WRITE_TOKEN` el panel sigue aceptando
una ruta o una URL escritas a mano.

Decisiones que conviene no revertir sin pensarlo:

- **No se confía en el nombre ni en el tipo que declara el navegador.** Los
  manda quien sube. Lo que decide es el encabezado real del archivo.
- **Los SVG se rechazan.** Son XML y pueden contener `<script>`; aceptarlos
  es cargar código de terceros en el sitio.
- **La imagen se vuelve a codificar siempre**, aunque ya venga en un formato
  válido. Eso hace dos cosas a la vez:
  - borra los metadatos, **incluida la ubicación GPS** que las cámaras de
    teléfono dejan en la foto, porque publicar la dirección del local de
    alguien sin querer es un problema de privacidad real;
  - neutraliza los archivos políglotas, que son imágenes válidas con otra
    cosa escondida: lo que se guarda es la salida de nuestro propio
    codificador, no los bytes que llegaron.
- **El nombre del archivo se descarta** y se genera uno propio, sin tildes ni
  rutas, con un sufijo al azar.
- Se limita a 8 MB de entrada y 1600 px de lado mayor, y la salida siempre es
  **WebP**, que es lo que pedía el pliego para el rendimiento.
- Las imágenes se sirven desde el dominio del almacenamiento, no desde el del
  sitio: un archivo servido desde otro origen no puede tocar las cookies ni
  el almacenamiento de la aplicación.

### Anuncios

- Los filtros viven en la URL (`/anuncios?categoria=Ofertas&orden=precio-desc`),
  no en estado de cliente. Son compartibles, el buscador los puede recorrer y
  funcionan sin JavaScript: el formulario es un `GET` normal.
- Cada publicación tiene su propia página, `/anuncios/<slug>`, con canonical,
  Open Graph y datos estructurados. Un lightbox no habría sido indexable.
- **Moderación previa:** solo se muestra lo que está en estado `publicada`.
  Una fila nueva nace en `pendiente` y no aparece en el feed.
- **Videos:** las tarjetas están maquetadas en 9:16. El campo `video_url`
  espera la URL del reproductor externo (Cloudflare Stream, Vimeo o YouTube
  no listado); sin ella se muestra la portada y un aviso.
- **Me gusta:** se identifican por una cookie opaca de visitante, no por
  cuenta. No dice quién es nadie, solo evita el doble conteo, así que no
  requiere consentimiento de cookies.

## Privacidad y anti-spam

Decisiones que conviene no revertir sin pensarlo:

- **No se guarda la IP**, sino un hash con sal. Alcanza para limitar envíos
  abusivos sin conservar un dato personal identificable.
- **Doble opt-in en el boletín**: una dirección no recibe nada hasta
  confirmar desde el correo. Es la prueba del consentimiento que pide el RGPD.
- **Respuesta genérica al suscribirse**, exista o no la dirección. Decir "ya
  estás suscrito" le confirmaría a un tercero que ese correo está en la lista.
- **Sin captcha de terceros**: un captcha agrega un tercero que recibe datos
  de quien visita el sitio, justo lo que la política de privacidad evita. En
  su lugar hay campo trampa, tiempo mínimo de llenado y límite de 5 envíos por
  hora por origen. Si el spam supera esto, el paso siguiente es Cloudflare
  Turnstile.
- **GA4 solo tras aceptar**, y solo si hay ID configurado.

## Deploy

Mientras dure la migración, el proyecto de Vercel apunta a la raíz y publica
el sitio estático. Para publicar esta versión:

1. Vercel → Settings → General → Root Directory → `web`
2. Cargar las variables de entorno en Settings → Environment Variables
3. Redeploy

Framework preset: Next.js (se autodetecta). No hace falta tocar el build.
