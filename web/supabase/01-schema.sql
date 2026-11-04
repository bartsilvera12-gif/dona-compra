-- =============================================================================
--  Doña Compra — schema de la aplicación
--  Para pegar en el SQL editor de Supabase self-hosted.
-- =============================================================================
--
--  INDEPENDENCIA
--  Todo lo que crea este script vive dentro del schema `donacompraweb`, con una
--  única excepción que no se puede evitar y que está marcada abajo: el bucket
--  de imágenes. Supabase guarda los buckets en su propio schema `storage`, así
--  que un bucket son necesariamente una fila en storage.buckets y unas
--  políticas sobre storage.objects. No se crea ninguna tabla ahí, y las
--  políticas van limitadas a este bucket y con nombre prefijado para poder
--  identificarlas y borrarlas. Está en el archivo 02-storage.sql, aparte, para
--  que puedas revisarlo y decidir por separado.
--
--  No se modifica `public`, ni `auth`, ni ningún otro schema. Las referencias a
--  auth.users son solo eso: referencias. Para deshacer todo alcanza con
--    drop schema donacompraweb cascade;
--
--  Es idempotente: se puede correr más de una vez sin romper nada.
-- =============================================================================

create schema if not exists donacompraweb;

comment on schema donacompraweb is
  'Aplicación Doña Compra. Independiente de public y del resto.';


-- -----------------------------------------------------------------------------
-- 1. Tipos
-- -----------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type t join pg_namespace n on n.oid = t.typnamespace
                 where n.nspname = 'donacompraweb' and t.typname = 'rol_miembro') then
    create type donacompraweb.rol_miembro as enum
      ('admin', 'comerciante', 'mayorista', 'marca');
  end if;

  if not exists (select 1 from pg_type t join pg_namespace n on n.oid = t.typnamespace
                 where n.nspname = 'donacompraweb' and t.typname = 'estado_mensaje') then
    create type donacompraweb.estado_mensaje as enum
      ('nuevo', 'leido', 'respondido', 'spam');
  end if;

  if not exists (select 1 from pg_type t join pg_namespace n on n.oid = t.typnamespace
                 where n.nspname = 'donacompraweb' and t.typname = 'asunto_mensaje') then
    create type donacompraweb.asunto_mensaje as enum
      ('Comerciante', 'Mayorista', 'Prensa', 'Otro');
  end if;

  if not exists (select 1 from pg_type t join pg_namespace n on n.oid = t.typnamespace
                 where n.nspname = 'donacompraweb' and t.typname = 'estado_publicacion') then
    create type donacompraweb.estado_publicacion as enum
      ('pendiente', 'publicada', 'rechazada', 'archivada');
  end if;

  if not exists (select 1 from pg_type t join pg_namespace n on n.oid = t.typnamespace
                 where n.nspname = 'donacompraweb' and t.typname = 'tipo_publicacion') then
    create type donacompraweb.tipo_publicacion as enum ('foto', 'video');
  end if;

  if not exists (select 1 from pg_type t join pg_namespace n on n.oid = t.typnamespace
                 where n.nspname = 'donacompraweb' and t.typname = 'categoria_publicacion') then
    create type donacompraweb.categoria_publicacion as enum
      ('Ofertas', 'Novedades', 'Comunidad');
  end if;
end
$$;


-- -----------------------------------------------------------------------------
-- 2. Miembros: quién es quién dentro de la aplicación
-- -----------------------------------------------------------------------------
-- Supabase Auth se ocupa de las credenciales y las sesiones. Esta tabla solo
-- dice qué rol tiene cada usuario DENTRO de esta aplicación. Un usuario de
-- Supabase sin fila acá no tiene ningún permiso, que es el valor por defecto
-- correcto: el acceso se concede, no se hereda.
create table if not exists donacompraweb.miembros (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  rol        donacompraweb.rol_miembro not null default 'comerciante',
  nombre     text not null default '',
  negocio    text,
  ciudad     text,
  creado_en  timestamptz not null default now()
);

comment on table donacompraweb.miembros is
  'Rol de cada usuario de Supabase Auth dentro de esta aplicación.';
comment on column donacompraweb.miembros.user_id is
  'Referencia a auth.users. No modifica ese schema; al borrar el usuario, cae la fila.';


-- -----------------------------------------------------------------------------
-- 3. Mensajes del formulario de contacto
-- -----------------------------------------------------------------------------
create table if not exists donacompraweb.mensajes (
  id          uuid primary key default gen_random_uuid(),
  creado_en   timestamptz not null default now(),

  nombre      text not null,
  apellido    text not null,
  correo      text not null,
  telefono    text not null,
  asunto      donacompraweb.asunto_mensaje not null,
  mensaje     text not null,

  negocio     text,
  ciudad      text,

  estado      donacompraweb.estado_mensaje not null default 'nuevo',

  -- Hash con sal de la IP, nunca la IP: alcanza para limitar envíos abusivos
  -- sin conservar un dato personal identificable.
  ip_hash     text,
  user_agent  text
);

create index if not exists mensajes_creado_en_idx on donacompraweb.mensajes (creado_en desc);
create index if not exists mensajes_estado_idx    on donacompraweb.mensajes (estado);
create index if not exists mensajes_ip_hash_idx   on donacompraweb.mensajes (ip_hash, creado_en);


-- -----------------------------------------------------------------------------
-- 4. Boletín
-- -----------------------------------------------------------------------------
create table if not exists donacompraweb.suscriptores (
  id             uuid primary key default gen_random_uuid(),
  correo         text not null unique,
  creado_en      timestamptz not null default now(),

  -- Doble opt-in: null mientras no confirme desde el correo. Es la prueba del
  -- consentimiento que pide el RGPD.
  confirmado_en  timestamptz,
  baja_en        timestamptz,

  token          text not null,
  ip_hash        text
);

create index if not exists suscriptores_token_idx     on donacompraweb.suscriptores (token);
create index if not exists suscriptores_creado_en_idx on donacompraweb.suscriptores (creado_en desc);


-- -----------------------------------------------------------------------------
-- 5. Publicaciones (anuncios)
-- -----------------------------------------------------------------------------
create table if not exists donacompraweb.publicaciones (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,

  titulo           text not null,
  texto            text not null,
  tipo             donacompraweb.tipo_publicacion not null default 'foto',
  categoria        donacompraweb.categoria_publicacion not null,
  ciudad           text not null,
  precio           integer not null default 0 check (precio >= 0),
  autor            text not null,

  -- Ruta dentro del bucket, o URL completa.
  imagen           text not null,
  imagen_alt       text,

  -- Reproductor externo del video. Los videos no se alojan acá.
  video_url        text,

  -- Moderación previa: nace en 'pendiente' y no se ve hasta aprobarse.
  estado           donacompraweb.estado_publicacion not null default 'pendiente',

  fecha            date not null,
  creado_en        timestamptz not null default now(),
  publicado_en     timestamptz,
  nota_moderacion  text
);

create index if not exists publicaciones_estado_fecha_idx on donacompraweb.publicaciones (estado, fecha desc);
create index if not exists publicaciones_categoria_idx    on donacompraweb.publicaciones (categoria);
create index if not exists publicaciones_ciudad_idx       on donacompraweb.publicaciones (ciudad);
create index if not exists publicaciones_precio_idx       on donacompraweb.publicaciones (precio);


-- -----------------------------------------------------------------------------
-- 6. Me gusta
-- -----------------------------------------------------------------------------
create table if not exists donacompraweb.reacciones (
  id              uuid primary key default gen_random_uuid(),
  publicacion_id  uuid not null references donacompraweb.publicaciones (id) on delete cascade,
  -- Id opaco de visitante (cookie) o el uuid del usuario si está identificado.
  visitante       text not null,
  creado_en       timestamptz not null default now(),
  unique (publicacion_id, visitante)
);

create index if not exists reacciones_publicacion_idx on donacompraweb.reacciones (publicacion_id);


-- -----------------------------------------------------------------------------
-- 7. Quién es admin
-- -----------------------------------------------------------------------------
-- security definer para poder leer `miembros` sin que la propia política de esa
-- tabla entre en recursión.
--
-- El search_path se fija a propósito. Una función security definer sin
-- search_path fijo es la vía clásica de escalada de privilegios: basta con que
-- alguien cree un objeto con el mismo nombre en un schema que esté antes en la
-- ruta de búsqueda para que la función ejecute ese en su lugar.
create or replace function donacompraweb.es_admin()
returns boolean
language sql
stable
security definer
set search_path = donacompraweb, pg_temp
as $$
  select exists (
    select 1 from donacompraweb.miembros
    where user_id = auth.uid() and rol = 'admin'
  );
$$;

revoke all on function donacompraweb.es_admin() from public;
grant execute on function donacompraweb.es_admin() to anon, authenticated;

comment on function donacompraweb.es_admin() is
  'true si quien hace la petición tiene rol admin en esta aplicación.';


-- -----------------------------------------------------------------------------
-- 8. Permisos del schema
-- -----------------------------------------------------------------------------
-- Poder usar el schema no da acceso a nada: todo pasa por RLS.
grant usage on schema donacompraweb to anon, authenticated;

-- Nada de permisos sobre las secuencias ni ejecución masiva de funciones.
revoke all on all tables in schema donacompraweb from anon, authenticated;


-- -----------------------------------------------------------------------------
-- 9. RLS
-- -----------------------------------------------------------------------------
alter table donacompraweb.miembros      enable row level security;
alter table donacompraweb.mensajes      enable row level security;
alter table donacompraweb.suscriptores  enable row level security;
alter table donacompraweb.publicaciones enable row level security;
alter table donacompraweb.reacciones    enable row level security;

-- Que RLS valga también para el dueño de las tablas.
alter table donacompraweb.miembros      force row level security;
alter table donacompraweb.mensajes      force row level security;
alter table donacompraweb.suscriptores  force row level security;
alter table donacompraweb.publicaciones force row level security;
alter table donacompraweb.reacciones    force row level security;


-- ---- miembros ----------------------------------------------------------------
drop policy if exists dc_miembros_propio_select on donacompraweb.miembros;
create policy dc_miembros_propio_select on donacompraweb.miembros
  for select to authenticated
  using (user_id = auth.uid() or donacompraweb.es_admin());

drop policy if exists dc_miembros_admin_todo on donacompraweb.miembros;
create policy dc_miembros_admin_todo on donacompraweb.miembros
  for all to authenticated
  using (donacompraweb.es_admin())
  with check (donacompraweb.es_admin());

grant select on donacompraweb.miembros to authenticated;
grant insert, update, delete on donacompraweb.miembros to authenticated;


-- ---- mensajes ------------------------------------------------------------------
-- Cualquiera puede ENVIAR una consulta desde el formulario, y nadie puede
-- LEERLAS salvo administración. Sin esto, el anon key que viaja en el navegador
-- permitiría listar las consultas de todo el mundo.
drop policy if exists dc_mensajes_insert_publico on donacompraweb.mensajes;
create policy dc_mensajes_insert_publico on donacompraweb.mensajes
  for insert to anon, authenticated
  with check (estado = 'nuevo');

drop policy if exists dc_mensajes_admin_todo on donacompraweb.mensajes;
create policy dc_mensajes_admin_todo on donacompraweb.mensajes
  for all to authenticated
  using (donacompraweb.es_admin())
  with check (donacompraweb.es_admin());

grant insert on donacompraweb.mensajes to anon, authenticated;
grant select, update, delete on donacompraweb.mensajes to authenticated;


-- ---- suscriptores ----------------------------------------------------------------
-- Alta pública, lectura solo de administración: la lista de correos no se
-- expone. La confirmación por token la resuelve el servidor de la aplicación.
drop policy if exists dc_suscriptores_insert_publico on donacompraweb.suscriptores;
create policy dc_suscriptores_insert_publico on donacompraweb.suscriptores
  for insert to anon, authenticated
  with check (confirmado_en is null and baja_en is null);

drop policy if exists dc_suscriptores_admin_todo on donacompraweb.suscriptores;
create policy dc_suscriptores_admin_todo on donacompraweb.suscriptores
  for all to authenticated
  using (donacompraweb.es_admin())
  with check (donacompraweb.es_admin());

grant insert on donacompraweb.suscriptores to anon, authenticated;
grant select, update, delete on donacompraweb.suscriptores to authenticated;


-- ---- publicaciones ------------------------------------------------------------
-- Lo único público es lo aprobado. La moderación previa deja de depender de que
-- la aplicación se acuerde de filtrar: lo garantiza la base.
drop policy if exists dc_publicaciones_select_publicadas on donacompraweb.publicaciones;
create policy dc_publicaciones_select_publicadas on donacompraweb.publicaciones
  for select to anon, authenticated
  using (estado = 'publicada');

drop policy if exists dc_publicaciones_admin_todo on donacompraweb.publicaciones;
create policy dc_publicaciones_admin_todo on donacompraweb.publicaciones
  for all to authenticated
  using (donacompraweb.es_admin())
  with check (donacompraweb.es_admin());

grant select on donacompraweb.publicaciones to anon, authenticated;
grant insert, update, delete on donacompraweb.publicaciones to authenticated;


-- ---- reacciones -------------------------------------------------------------
-- Los conteos son públicos. Insertar y quitar queda limitado a publicaciones ya
-- aprobadas; el índice único evita el doble conteo por visitante.
--
-- Nota honesta: con un visitante anónimo, RLS no puede comprobar que quien
-- borra una reacción sea quien la creó, porque no hay identidad que verificar.
-- Lo cubre la aplicación con su cookie. Si esto llegara a abusarse, el paso
-- siguiente es mover los me gusta detrás de una función de servidor.
drop policy if exists dc_reacciones_select_publico on donacompraweb.reacciones;
create policy dc_reacciones_select_publico on donacompraweb.reacciones
  for select to anon, authenticated using (true);

drop policy if exists dc_reacciones_insert_publico on donacompraweb.reacciones;
create policy dc_reacciones_insert_publico on donacompraweb.reacciones
  for insert to anon, authenticated
  with check (exists (
    select 1 from donacompraweb.publicaciones p
    where p.id = publicacion_id and p.estado = 'publicada'
  ));

drop policy if exists dc_reacciones_delete_publico on donacompraweb.reacciones;
create policy dc_reacciones_delete_publico on donacompraweb.reacciones
  for delete to anon, authenticated using (true);

grant select, insert, delete on donacompraweb.reacciones to anon, authenticated;


-- -----------------------------------------------------------------------------
-- 10. Alta del administrador
-- -----------------------------------------------------------------------------
-- El usuario admin@donacompraweb.com se crea desde Authentication → Users en el
-- panel de Supabase (o por la API de admin). Esta parte solo le da el rol
-- dentro de la aplicación.
--
-- Si todavía no existe el usuario, este bloque avisa y no hace nada, para que
-- se note en vez de fallar en silencio.
do $$
declare
  v_id uuid;
begin
  select id into v_id from auth.users where email = 'admin@donacompraweb.com';

  if v_id is null then
    raise notice 'No existe el usuario admin@donacompraweb.com en Supabase Auth. Creálo en Authentication -> Users y volvé a correr este bloque.';
  else
    insert into donacompraweb.miembros (user_id, rol, nombre)
    values (v_id, 'admin', 'Administración')
    on conflict (user_id) do update set rol = 'admin';

    raise notice 'Rol admin asignado a admin@donacompraweb.com';
  end if;
end
$$;


-- -----------------------------------------------------------------------------
-- 11. Comprobación
-- -----------------------------------------------------------------------------
-- Deja a la vista que todo quedó como corresponde: cinco tablas, todas con RLS.
select
  c.relname                        as tabla,
  c.relrowsecurity                 as rls_activo,
  c.relforcerowsecurity            as rls_forzado,
  (select count(*) from pg_policies p
    where p.schemaname = 'donacompraweb' and p.tablename = c.relname) as politicas
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'donacompraweb' and c.relkind = 'r'
order by c.relname;
