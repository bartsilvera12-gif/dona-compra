-- =============================================================================
--  Doña Compra — cambia Lambaré por San Lorenzo en el anuncio de cobertura
--  Para pegar en el SQL editor. Corre solo, no depende de los anteriores.
-- =============================================================================
--
--  Por qué
--  -------
--  El cliente pidió el 27 de noviembre cambiar Lambaré por San Lorenzo en el
--  anuncio «Nueva zona de cobertura». El texto del sitio sale de la base, no
--  del código, así que no alcanza con tocar los archivos.
--
--  Lo mismo se puede hacer desde el panel, en Anuncios, entrando al anuncio y
--  editando el título, el texto y la ciudad. Esto es por si se prefiere de
--  una sola vez.
--
--  Ojo
--  ---
--  Este anuncio es uno de los diez de ejemplo que 06-anuncios-ejemplo.sql
--  borra. Si se corre aquel, este desaparece. Correr los dos no rompe nada:
--  el que quede segundo simplemente no encuentra la fila.
--
--  El slug no se cambia. Es la clave con la que está cargada la fila y con la
--  que la busca 06-anuncios-ejemplo.sql; no se ve en ninguna parte del sitio.
--
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Antes: cómo está
-- -----------------------------------------------------------------------------
select slug, titulo, ciudad
  from donacompraweb.publicaciones
 where slug = 'nueva-zona-lambare';


-- -----------------------------------------------------------------------------
-- 2. El cambio
-- -----------------------------------------------------------------------------
update donacompraweb.publicaciones
   set titulo = 'Nueva zona de cobertura: San Lorenzo',
       texto  = 'Ya estamos visitando negocios en San Lorenzo. Pedí tu visita '
                || 'desde la página de contacto y coordinamos según disponibilidad.',
       ciudad = 'San Lorenzo'
 where slug = 'nueva-zona-lambare';


-- -----------------------------------------------------------------------------
-- 3. Comprobación
-- -----------------------------------------------------------------------------
-- Tiene que devolver una fila con San Lorenzo en el título y en la ciudad, y
-- lambare_sueltos en 0.
select
  titulo,
  ciudad,
  (select count(*)
     from donacompraweb.publicaciones
    where titulo ilike '%lambar%'
       or texto  ilike '%lambar%'
       or ciudad ilike '%lambar%') as lambare_sueltos
from donacompraweb.publicaciones
where slug = 'nueva-zona-lambare';
