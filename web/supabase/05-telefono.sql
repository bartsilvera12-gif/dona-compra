-- =============================================================================
--  Doña Compra — saca el teléfono de la configuración
--  Para pegar en el SQL editor DESPUÉS de 04-contenido.sql
-- =============================================================================
--
--  Por qué
--  -------
--  El número de WhatsApp dejó de ser un dato editable. No es un dato suelto:
--  con él se arma el código QR de la página de Contactos (una imagen que vive
--  en assets/), el teléfono de los datos estructurados y todos los enlaces de
--  WhatsApp del sitio. Si se puede cambiar desde el panel, el QR y el número
--  escrito terminan diciendo cosas distintas, que es justo lo que las
--  correcciones piden evitar: un único número oficial en toda la web.
--
--  Desde ahora el número vive en el propio archivo del sitio. El panel ya no
--  muestra el campo y dc-config.js ya no lee esta columna: la fila se quedó
--  con un valor viejo (0994 876 333) que no lo lee nadie. Esto la limpia.
--
--  Qué hace
--  --------
--  Borra la columna telefono de donacompraweb.configuracion. El permiso de
--  update sobre esa columna se va solo con ella, no hay que revocarlo aparte.
--  Las demás columnas, la fila, las políticas y el resto del schema quedan
--  como están.
--
--  Esto no se puede deshacer: el valor viejo se pierde. Es la intención, pero
--  conviene saberlo antes de darle a correr.
--
--  Si preferís conservar la columna y solo corregir el valor, en lugar de
--  todo lo de abajo alcanza con:
--
--    update donacompraweb.configuracion set telefono = '0994 300 999';
--
--  Queda guardado un número que ya no lee nadie, pero al menos no contradice
--  al del sitio el día que alguien lo mire.
--
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Fuera la columna
-- -----------------------------------------------------------------------------
alter table donacompraweb.configuracion
  drop column if exists telefono;


-- -----------------------------------------------------------------------------
-- 2. Comprobación
-- -----------------------------------------------------------------------------
-- Tiene que devolver una sola fila, con columna_telefono = 0 y los demás datos
-- intactos.
select
  (select count(*)
     from information_schema.columns
    where table_schema = 'donacompraweb'
      and table_name   = 'configuracion'
      and column_name  = 'telefono')      as columna_telefono,
  (select count(*) from donacompraweb.configuracion) as filas,
  correo,
  horario
from donacompraweb.configuracion;
