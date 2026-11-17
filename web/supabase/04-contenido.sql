-- =============================================================================
--  Doña Compra — contenido editable de la página
--  Para pegar en el SQL editor DESPUÉS de 03-configuracion.sql
-- =============================================================================
--
--  Agrega una tabla al schema donacompraweb y nada más. No toca public, ni
--  auth, ni storage, ni ningún otro schema.
--
--  Para deshacer esta parte sola:
--    drop table if exists donacompraweb.contenido;
--
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. La tabla
-- -----------------------------------------------------------------------------
-- Acá sí va clave/valor, al revés que en configuracion, y la diferencia vale
-- la pena explicarla.
--
-- En configuracion hay cinco datos con nombre y con sentido propio: el
-- teléfono es un teléfono. Por eso son columnas: la base misma impide guardar
-- una dirección donde iba un correo.
--
-- Acá hay más de mil textos e imágenes repartidos por doce páginas, y la
-- lista cambia cada vez que alguien agrega un párrafo al sitio. Una columna
-- por texto serían mil columnas y una migración por cada palabra nueva.
--
-- La clave no es la posición del texto sino su huella: la sección donde vive
-- más el texto original. Así, agregar un párrafo en el sitio no corre las
-- claves de los demás; y si alguien cambia en el sitio un texto que el panel
-- tenía editado, la clave deja de coincidir y manda lo que dice el sitio. Se
-- pierde esa edición, pero nunca aparece un texto guardado en el lugar
-- equivocado, que es el error que no se nota hasta que lo ve un cliente.
--
-- Quien arma las claves es dc-contenido.js, el mismo archivo que usa el panel
-- para descubrir los campos. Ese archivo es la definición; esta tabla solo
-- las guarda.
create table if not exists donacompraweb.contenido (
  clave           text primary key,
  valor           jsonb not null,

  actualizado_en  timestamptz not null default now(),
  actualizado_por uuid references auth.users (id) on delete set null,

  -- Las claves las genera dc-contenido.js: dos huellas en base 36 separadas
  -- por guiones. Encerrar la forma acá no es desconfianza del panel, es que
  -- la tabla queda legible y un error de programación se ve enseguida.
  constraint contenido_clave_con_forma
    check (clave ~ '^[a-z0-9]+-[a-z0-9]+(-[0-9]+)?$'),

  -- Un texto de página no pesa decenas de kilobytes. El tope está para que un
  -- error no llene la tabla, no para apretar al que escribe.
  constraint contenido_valor_razonable
    check (pg_column_size(valor) < 60000)
);

comment on table donacompraweb.contenido is
  'Textos e imágenes editados desde el panel. La clave es la huella que arma dc-contenido.js.';
comment on column donacompraweb.contenido.valor is
  'Texto: {"texto": "..."}. Imagen: {"src": "...", "alt": "..."}.';


-- -----------------------------------------------------------------------------
-- 2. Sello de quién y cuándo
-- -----------------------------------------------------------------------------
-- En el trigger y no en el panel, por lo mismo que en configuracion: vale
-- para cualquier cliente que escriba y nadie puede firmar con otro nombre.
create or replace function donacompraweb.contenido_sellar()
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

drop trigger if exists dc_contenido_sellar on donacompraweb.contenido;
create trigger dc_contenido_sellar
  before insert or update on donacompraweb.contenido
  for each row execute function donacompraweb.contenido_sellar();


-- -----------------------------------------------------------------------------
-- 3. RLS
-- -----------------------------------------------------------------------------
alter table donacompraweb.contenido enable row level security;
alter table donacompraweb.contenido force  row level security;

-- Leer: cualquiera. Es el texto que la página muestra igual a quien entre.
drop policy if exists dc_contenido_select_publico on donacompraweb.contenido;
create policy dc_contenido_select_publico on donacompraweb.contenido
  for select to anon, authenticated
  using (true);

-- Escribir: solo el administrador. El borrado también es suyo: borrar una
-- fila es cómo el panel devuelve un texto a lo que dice el sitio.
drop policy if exists dc_contenido_insert_admin on donacompraweb.contenido;
create policy dc_contenido_insert_admin on donacompraweb.contenido
  for insert to authenticated
  with check (donacompraweb.es_admin());

drop policy if exists dc_contenido_update_admin on donacompraweb.contenido;
create policy dc_contenido_update_admin on donacompraweb.contenido
  for update to authenticated
  using (donacompraweb.es_admin())
  with check (donacompraweb.es_admin());

drop policy if exists dc_contenido_delete_admin on donacompraweb.contenido;
create policy dc_contenido_delete_admin on donacompraweb.contenido
  for delete to authenticated
  using (donacompraweb.es_admin());


-- -----------------------------------------------------------------------------
-- 4. Permisos
-- -----------------------------------------------------------------------------
-- Las columnas del sello quedan fuera del insert y del update a propósito:
-- las pone el trigger y nadie más. Probado: un pedido que trae
-- actualizado_por lo rechaza la base.
--
-- `clave` sí entra en el update, aunque el panel nunca la cambie. El panel
-- guarda con un upsert, y un upsert en Postgres escribe todas las columnas
-- que manda, la clave incluida; sin este permiso falla entero. No afloja
-- nada: quien puede insertar ya puede usar la clave que quiera.
grant select on donacompraweb.contenido to anon, authenticated;
grant insert (clave, valor) on donacompraweb.contenido to authenticated;
grant update (clave, valor) on donacompraweb.contenido to authenticated;
grant delete                on donacompraweb.contenido to authenticated;


-- -----------------------------------------------------------------------------
-- 5. Comprobación
-- -----------------------------------------------------------------------------
select
  c.relname             as tabla,
  c.relrowsecurity      as rls_activo,
  c.relforcerowsecurity as rls_forzado,
  (select count(*) from pg_policies p
    where p.schemaname = 'donacompraweb' and p.tablename = c.relname) as politicas,
  (select count(*) from donacompraweb.contenido)                      as filas
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'donacompraweb' and c.relname = 'contenido';
