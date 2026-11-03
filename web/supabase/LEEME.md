# Puesta en marcha en Supabase self-hosted

Pasos en orden. Después de cada uno podés comprobar cómo va con:

```bash
cd web && npm run check:supabase
```

Ese script dice si el servidor responde, si el anon key sirve, si el schema
está expuesto y si existe el bucket. No imprime ningún secreto, así que podés
pegar su salida sin riesgo.

## 1. Crear el usuario administrador

En el panel de Supabase: **Authentication → Users → Add user**, con el correo
`admin@donacompraweb.com` y una contraseña que elijas vos. Marcá *Auto Confirm
User* para no depender del correo de confirmación.

Esto va primero porque el paso 2 le asigna el rol, y si el usuario no existe
el script lo avisa en vez de fallar en silencio.

## 2. Correr el SQL

En el **SQL Editor**, en este orden:

1. `01-schema.sql` — crea el schema `donacompraweb`, las tablas, las políticas
   RLS y le da el rol admin al usuario del paso 1.
2. `02-storage.sql` — crea el bucket de imágenes y sus políticas.

Los dos son idempotentes: se pueden correr más de una vez.

Al final de cada uno hay una consulta de comprobación. En el primero tenés que
ver cinco tablas, todas con `rls_activo` y `rls_forzado` en true.

## 3. Exponer el schema

Esto es lo tuyo. Hoy PostgREST expone `public, mc_store, storage,
graphql_public` y los schemas de los otros proyectos de la instancia; falta
agregar `donacompraweb`.

En la configuración de PostgREST (variable `PGRST_DB_SCHEMAS` en el contenedor,
o `db-schemas` en el archivo de configuración), agregá `donacompraweb` a la
lista que ya está. **Agregar, no reemplazar**: si se pisa la lista, los otros
proyectos de la instancia dejan de responder.

Después hay que recargar el esquema:

```sql
notify pgrst, 'reload schema';
```

## 4. Variables de entorno en Coolify

Estas son las que necesita el panel. **No uso tu token de Coolify**: cargalas
vos desde la interfaz.

| Variable | Valor |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://api.neura.com.py` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | el anon key de la instancia |
| `NEXT_PUBLIC_SUPABASE_SCHEMA` | `donacompraweb` |
| `NEXT_PUBLIC_SUPABASE_BUCKET` | `donacompraweb` |
| `NEXT_PUBLIC_SITE_URL` | la URL pública del sitio |
| `IP_HASH_SALT` | una cadena al azar, 32+ caracteres |

Las de contacto y datos públicos, que ya existían:

| Variable | Valor |
| --- | --- |
| `NEXT_PUBLIC_PHONE` | `0994 876 333` |
| `NEXT_PUBLIC_EMAIL` | correo de contacto |
| `NEXT_PUBLIC_FACEBOOK` | URL, o vacío para ocultar el botón |
| `NEXT_PUBLIC_INSTAGRAM` | URL, o vacío para ocultar el botón |
| `NEXT_PUBLIC_RUC` | RUC para la página jurídica |
| `NEXT_PUBLIC_GA_ID` | ID de GA4, o vacío para no cargar analítica |

Para generar la sal:

```bash
openssl rand -base64 32
```

### Sobre el service_role key

**No lo pidas ni lo cargues.** Este proyecto no lo usa a propósito: ese key
saltea RLS por completo, y si se filtra desde una variable de entorno da acceso
total a todos los schemas de la instancia, incluidos los de los otros
proyectos. Todo el panel funciona con la sesión del administrador, así que la
base comprueba los permisos en cada consulta.

## 5. Comprobar

```bash
cd web && npm run check:supabase
```

Tendría que dar las cuatro líneas en verde.

## Deshacer

Para borrar todo lo de esta aplicación sin tocar nada más:

```sql
drop schema donacompraweb cascade;
```

Y para el bucket, lo que está comentado al principio de `02-storage.sql`.

## Qué toca y qué no

Todo vive en el schema `donacompraweb`. No se modifica `public`, ni `auth`, ni
los schemas de los otros proyectos.

La única excepción, que no se puede evitar, es el bucket: Supabase guarda los
buckets en su propio schema `storage`, así que son una fila en `storage.buckets`
y cuatro políticas sobre `storage.objects`. No se crea ninguna tabla ahí, las
políticas están limitadas a este bucket por `bucket_id` y llevan el prefijo
`dc_` para poder encontrarlas. Está en un archivo aparte justamente para que
puedas revisarlo y decidir por separado.

Si preferís no tocar `storage` en absoluto, la alternativa es un bucket S3
aparte (Cloudflare R2) y dejar Supabase para datos y autenticación. El código
de validación y reprocesado de imágenes es el mismo; solo cambia la línea que
sube el archivo.
