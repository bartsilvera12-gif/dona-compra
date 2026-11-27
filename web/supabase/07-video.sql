-- =============================================================================
--  Doña Compra — deja subir el video desde el panel
--  Para pegar en el SQL editor. Corre solo, no depende de los anteriores.
-- =============================================================================
--
--  Por qué
--  -------
--  El panel editaba textos e imágenes. El video de Doña quedaba afuera, así
--  que cambiarlo era tarea de quien tiene acceso al servidor. Irama prepara
--  uno nuevo y lo va a reemplazar ella misma, así que ahora el panel también
--  lo toma.
--
--  Del lado del sitio y del panel ya está hecho (dc-contenido.js lo reconoce
--  y admin/contenido.js le da su campo). Falta esto, que es lo único que no
--  se puede tocar desde el código: el depósito de archivos rechaza los mp4 y
--  tiene un tope de 8 MB.
--
--  Qué hace
--  --------
--  Agrega video/mp4 a los tipos permitidos y sube el tope a 25 MB. Nada más:
--  las políticas, el bucket y los archivos que ya están quedan como están.
--
--  Por qué 25 y no más: el video se baja entero cuando alguien le da play, y
--  buena parte de las visitas llegan desde un teléfono con datos. Un minuto
--  en vertical, bien exportado, pesa entre 5 y 10 MB. Veinticinco deja aire
--  de sobra sin que se pueda subir algo que nadie va a esperar a que cargue.
--
--  Ojo: el tope es del depósito entero, así que también sube para las fotos.
--  El panel igual no deja pasar una foto de más de 8 MB, que es donde tiene
--  que estar el límite de una foto.
--
--  Solo mp4. Los .mov salen enormes de los teléfonos y los editores, y el
--  navegador no siempre los reproduce. Si hace falta otro formato, se agrega
--  acá y en el accept del panel, en los dos lados.
--
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. El depósito acepta el video
-- -----------------------------------------------------------------------------
update storage.buckets
   set allowed_mime_types = array[
         'image/webp', 'image/jpeg', 'image/png', 'image/avif', 'image/gif',
         'video/mp4'
       ],
       file_size_limit    = 26214400  -- 25 MB
 where id = 'donacompraweb';


-- -----------------------------------------------------------------------------
-- 2. El comentario de la tabla, al día
-- -----------------------------------------------------------------------------
comment on column donacompraweb.contenido.valor is
  'Texto: {"texto": "..."}. Imagen: {"src": "...", "alt": "..."}. '
  'Video: {"src": "...", "portada": "..."}.';


-- -----------------------------------------------------------------------------
-- 3. Comprobación
-- -----------------------------------------------------------------------------
-- Tiene que devolver una fila con acepta_mp4 = true y limite_mb = 25.
select
  id,
  'video/mp4' = any (allowed_mime_types) as acepta_mp4,
  file_size_limit / 1048576              as limite_mb,
  allowed_mime_types                     as tipos
from storage.buckets
where id = 'donacompraweb';
