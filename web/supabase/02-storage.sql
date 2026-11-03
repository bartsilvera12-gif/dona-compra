-- =============================================================================
--  Doña Compra — bucket de imágenes
--  Para pegar en el SQL editor DESPUÉS de 01-schema.sql
-- =============================================================================
--
--  ESTO SÍ TOCA EL SCHEMA `storage`, y no hay forma de evitarlo.
--
--  Un bucket de Supabase es, por definición, una fila en storage.buckets, y el
--  control de acceso a los archivos son políticas sobre storage.objects. No se
--  crea ninguna tabla ni se modifica ninguna existente: se agrega una fila y
--  cuatro políticas.
--
--  Las políticas van:
--    - limitadas a este bucket por bucket_id, así que no afectan a ningún otro;
--    - con el prefijo dc_ en el nombre, para poder encontrarlas y borrarlas.
--
--  Para deshacer solo esta parte:
--    delete from storage.objects where bucket_id = 'donacompraweb';
--    delete from storage.buckets where id = 'donacompraweb';
--    drop policy if exists dc_imagenes_select_publico on storage.objects;
--    drop policy if exists dc_imagenes_insert_admin   on storage.objects;
--    drop policy if exists dc_imagenes_update_admin   on storage.objects;
--    drop policy if exists dc_imagenes_delete_admin   on storage.objects;
--
--  Si preferís no tocar `storage` en absoluto, la alternativa es un bucket S3
--  aparte (Cloudflare R2, por ejemplo) y dejar Supabase solo para datos y
--  autenticación. Decime y lo cambio: el código de validación y reprocesado de
--  imágenes es el mismo, solo cambia la línea que sube el archivo.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 1. El bucket
-- -----------------------------------------------------------------------------
-- public = true: las imágenes de los anuncios se ven sin credenciales, que es
-- lo que corresponde para un sitio público. Lo que NO es público es poder
-- subirlas, y de eso se ocupan las políticas de más abajo.
--
-- El límite de tamaño y los tipos permitidos están también acá, además de en la
-- aplicación: la validación del servidor puede saltearse llamando directo a la
-- API de Storage con el anon key, así que conviene que la base también lo
-- rechace. Los SVG quedan fuera a propósito: son XML y pueden traer <script>.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'donacompraweb',
  'donacompraweb',
  true,
  8388608,  -- 8 MB
  array['image/webp', 'image/jpeg', 'image/png', 'image/avif', 'image/gif']
)
on conflict (id) do update set
  public             = excluded.public,
  file_size_limit    = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;


-- -----------------------------------------------------------------------------
-- 2. Políticas, limitadas a este bucket
-- -----------------------------------------------------------------------------

-- Leer: cualquiera. Son las fotos de los anuncios del sitio público.
drop policy if exists dc_imagenes_select_publico on storage.objects;
create policy dc_imagenes_select_publico on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'donacompraweb');

-- Subir: solo administración. Sin esto, el anon key que viaja en el navegador
-- permitiría que cualquiera llene el bucket.
drop policy if exists dc_imagenes_insert_admin on storage.objects;
create policy dc_imagenes_insert_admin on storage.objects
  for insert to authenticated
  with check (bucket_id = 'donacompraweb' and donacompraweb.es_admin());

drop policy if exists dc_imagenes_update_admin on storage.objects;
create policy dc_imagenes_update_admin on storage.objects
  for update to authenticated
  using (bucket_id = 'donacompraweb' and donacompraweb.es_admin())
  with check (bucket_id = 'donacompraweb' and donacompraweb.es_admin());

drop policy if exists dc_imagenes_delete_admin on storage.objects;
create policy dc_imagenes_delete_admin on storage.objects
  for delete to authenticated
  using (bucket_id = 'donacompraweb' and donacompraweb.es_admin());


-- -----------------------------------------------------------------------------
-- 3. Comprobación
-- -----------------------------------------------------------------------------
select
  b.id                as bucket,
  b.public            as publico,
  b.file_size_limit   as limite_bytes,
  b.allowed_mime_types as tipos
from storage.buckets b
where b.id = 'donacompraweb';

select policyname, cmd
from pg_policies
where schemaname = 'storage' and tablename = 'objects' and policyname like 'dc\_%'
order by policyname;
