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
| Concepto, Comerciantes, Mayoristas, Club, Jurídica, FAQ | Marcador: contenido todavía en el sitio estático |
| Feed de anuncios con base de datos | Pendiente |
| Cuentas, roles y back-office | Pendiente |

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

## Verificar la configuración

```bash
npm run check
```

Dice si la base conecta, en qué región está, si faltan tablas, si la API key
de correo sirve y si el remitente pertenece a un dominio verificado. No
imprime ningún secreto, así que se puede correr y pegar la salida sin riesgo.

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

Dos tablas: `mensajes` (consultas del formulario) y `suscriptores` (boletín).

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
