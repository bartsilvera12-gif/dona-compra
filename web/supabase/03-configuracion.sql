-- =============================================================================
--  Doña Compra — configuración editable del sitio
--  Para pegar en el SQL editor DESPUÉS de 01-schema.sql
-- =============================================================================
--
--  Agrega una tabla al schema donacompraweb y nada más. No toca public, ni
--  auth, ni storage, ni ningún otro schema: solo usa donacompraweb.es_admin(),
--  que ya existe desde 01-schema.sql.
--
--  Para deshacer esta parte sola:
--    drop table if exists donacompraweb.configuracion;
--
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. La tabla
-- -----------------------------------------------------------------------------
-- Una sola fila, con columnas con nombre, en vez de una tabla clave/valor.
--
-- Clave/valor parece más flexible, pero deja todo como texto suelto: nada
-- impide escribir dos veces la misma clave con distinto nombre, ni guardar un
-- teléfono donde iba una dirección, y el día que falta una clave hay que
-- descubrirlo en producción. Con columnas, la base misma dice qué campos hay
-- y de qué tipo son.
--
-- El truco de `id boolean primary key default true check (id)` es lo que la
-- obliga a tener una sola fila: el único valor posible para la clave primaria
-- es true, así que un segundo insert choca contra la clave.
create table if not exists donacompraweb.configuracion (
  id                boolean primary key default true check (id),

  -- Contacto
  telefono          text not null default '0994 876 333',
  correo            text not null default 'donacompra.py@gmail.com',
  domicilio         text not null default 'Edificio Diamante 1, Calle Coronel Feliciano Duarte 111, 403 San Lorenzo, Paraguay',
  zona              text not null default 'Gran Asunción, Paraguay',
  horario           text not null default 'Lunes a viernes de 08:00 a 18:00 · Sábados de 08:00 a 12:00',

  -- Redes. Vacío quiere decir que el botón no se dibuja.
  instagram         text not null default 'https://www.instagram.com/donacompra.py/',
  facebook          text not null default 'https://www.facebook.com/profile.php?id=61595837348991',

  -- Portada. Ruta dentro del bucket donacompraweb, no una URL completa: así el
  -- día que cambie el dominio del Supabase no hay que reescribir filas.
  portada_imagen    text,
  portada_imagen_alt text,

  -- Para saber quién tocó qué y cuándo, que en un panel compartido importa.
  actualizado_en    timestamptz not null default now(),
  actualizado_por   uuid references auth.users (id) on delete set null
);

comment on table donacompraweb.configuracion is
  'Fila única con los datos editables del sitio: contacto, redes y portada.';
comment on column donacompraweb.configuracion.id is
  'Siempre true. Es lo que obliga a que exista una sola fila.';
comment on column donacompraweb.configuracion.telefono is
  'El número que usa todo el sitio, el botón flotante de WhatsApp incluido.';
comment on column donacompraweb.configuracion.portada_imagen is
  'Ruta dentro del bucket donacompraweb, no una URL completa.';


-- -----------------------------------------------------------------------------
-- 2. La fila
-- -----------------------------------------------------------------------------
-- Se crea con los valores que hoy están escritos en el sitio, así el panel
-- abre mostrando lo que la gente ve y no campos vacíos.
insert into donacompraweb.configuracion (id) values (true)
on conflict (id) do nothing;


-- -----------------------------------------------------------------------------
-- 3. Una sola fila, también contra el borrado
-- -----------------------------------------------------------------------------
-- Sin esto, un delete desde el panel dejaría al sitio sin datos de contacto.
-- No hay ninguna razón para borrar esta fila: se edita, no se borra.
create or replace function donacompraweb.configuracion_no_se_borra()
returns trigger
language plpgsql
set search_path = donacompraweb, pg_temp
as $$
begin
  raise exception 'La configuración no se borra: se edita.';
end;
$$;

drop trigger if exists dc_configuracion_no_se_borra on donacompraweb.configuracion;
create trigger dc_configuracion_no_se_borra
  before delete on donacompraweb.configuracion
  for each row execute function donacompraweb.configuracion_no_se_borra();


-- -----------------------------------------------------------------------------
-- 4. Sello de quién y cuándo
-- -----------------------------------------------------------------------------
-- En el trigger y no en el panel: así vale para cualquier cliente que escriba,
-- y nadie puede mentir sobre quién hizo el cambio.
create or replace function donacompraweb.configuracion_sellar()
returns trigger
language plpgsql
set search_path = donacompraweb, pg_temp
as $$
begin
  new.actualizado_en  := now();
  new.actualizado_por := auth.uid();
  return new;
end;
$$;

drop trigger if exists dc_configuracion_sellar on donacompraweb.configuracion;
create trigger dc_configuracion_sellar
  before update on donacompraweb.configuracion
  for each row execute function donacompraweb.configuracion_sellar();


-- -----------------------------------------------------------------------------
-- 5. RLS
-- -----------------------------------------------------------------------------
alter table donacompraweb.configuracion enable  row level security;
alter table donacompraweb.configuracion force   row level security;

-- Leer: cualquiera. Son los datos de contacto que el sitio muestra igual.
drop policy if exists dc_configuracion_select_publico on donacompraweb.configuracion;
create policy dc_configuracion_select_publico on donacompraweb.configuracion
  for select to anon, authenticated
  using (true);

-- Escribir: solo el administrador. No hay política de insert ni de delete a
-- propósito: la fila ya existe y no se crea ni se borra desde el panel.
drop policy if exists dc_configuracion_update_admin on donacompraweb.configuracion;
create policy dc_configuracion_update_admin on donacompraweb.configuracion
  for update to authenticated
  using (donacompraweb.es_admin())
  with check (donacompraweb.es_admin());


-- -----------------------------------------------------------------------------
-- 6. Permisos
-- -----------------------------------------------------------------------------
-- Leer, cualquiera; escribir, solo las columnas que el panel edita. Dejar
-- actualizado_en y actualizado_por fuera del update no es decorativo: es lo
-- que impide que alguien firme un cambio con el nombre de otro.
grant select on donacompraweb.configuracion to anon, authenticated;
grant update (
  telefono, correo, domicilio, zona, horario,
  instagram, facebook, portada_imagen, portada_imagen_alt
) on donacompraweb.configuracion to authenticated;


-- -----------------------------------------------------------------------------
-- 7. Comprobación
-- -----------------------------------------------------------------------------
select
  c.relname             as tabla,
  c.relrowsecurity      as rls_activo,
  c.relforcerowsecurity as rls_forzado,
  (select count(*) from pg_policies p
    where p.schemaname = 'donacompraweb' and p.tablename = c.relname) as politicas,
  (select count(*) from donacompraweb.configuracion)                  as filas
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'donacompraweb' and c.relname = 'configuracion';
