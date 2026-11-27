-- =============================================================================
--  Doña Compra — saca las publicaciones de ejemplo de Anuncios
--  Para pegar en el SQL editor. Corre solo, no depende de los anteriores.
-- =============================================================================
--
--  Por qué
--  -------
--  Punto 10.1 de las correcciones del 27 de noviembre de 2026: la página de
--  Anuncios mostraba diez publicaciones inventadas —precios, ciudades y
--  autores que no existen, firmadas «Doña Compra (ejemplo)», «Mayorista Amigo
--  (ejemplo)» y «Comercio de la red (ejemplo)»— como si fueran reales. El
--  cliente pide retirarlas antes de publicar el sitio y mostrar un mensaje de
--  espera mientras no haya publicaciones de verdad.
--
--  La copia que vivía dentro de index.html ya se borró, y la página ya dice
--  «Todavía no hay publicaciones» cuando la lista llega vacía. Pero estas diez
--  también están cargadas en la base, que es de donde las lee el sitio: hasta
--  que se borren de acá, se siguen viendo.
--
--  Qué hace
--  --------
--  Borra las diez filas por su slug, que es el identificador que les puso
--  web/scripts/seed.mjs. Los «me gusta» de esas publicaciones se van con
--  ellas (la clave foránea de reacciones es on delete cascade). No toca
--  ninguna publicación que no esté en esta lista: si mañana hay publicaciones
--  reales, quedan donde están.
--
--  Esto no se puede deshacer desde el panel. Si alguna vez hicieran falta de
--  nuevo, vuelven con `npm run db:seed` desde web/.
--
--  Ojo: `npm run db:seed` las vuelve a cargar. No lo corras contra la base
--  del sitio publicado.
--
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Antes: cuántas hay
-- -----------------------------------------------------------------------------
select count(*) as ejemplos_antes
  from donacompraweb.publicaciones
 where slug in (
   'retiro-con-codigo-seguro',
   'nueva-zona-lambare',
   'temporada-escolar-curva-completa',
   'como-se-arma-un-pedido',
   'bijouterie-por-blister',
   'tope-nivel-bronce',
   'reposicion-de-perfumeria',
   'que-tener-listo-para-la-visita',
   'calzado-por-curva-de-talles',
   'regaleria-para-fechas-fuertes'
 );


-- -----------------------------------------------------------------------------
-- 2. Fuera
-- -----------------------------------------------------------------------------
delete from donacompraweb.publicaciones
 where slug in (
   'retiro-con-codigo-seguro',
   'nueva-zona-lambare',
   'temporada-escolar-curva-completa',
   'como-se-arma-un-pedido',
   'bijouterie-por-blister',
   'tope-nivel-bronce',
   'reposicion-de-perfumeria',
   'que-tener-listo-para-la-visita',
   'calzado-por-curva-de-talles',
   'regaleria-para-fechas-fuertes'
 );


-- -----------------------------------------------------------------------------
-- 3. Comprobación
-- -----------------------------------------------------------------------------
-- ejemplos_despues tiene que dar 0. En publicadas queda lo que haya de
-- verdad: si da 0, la página muestra «Todavía no hay publicaciones», que es
-- justo lo que se pidió.
select
  (select count(*)
     from donacompraweb.publicaciones
    where autor ilike '%(ejemplo)%')                    as ejemplos_despues,
  (select count(*)
     from donacompraweb.publicaciones
    where estado = 'publicada')                         as publicadas,
  (select count(*) from donacompraweb.publicaciones)    as total;
