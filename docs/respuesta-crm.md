# Respuesta al correo de Antonio — CRM Doña Compra

> Borrador para revisar antes de enviar. Lo que está marcado **[confirmar]** es
> algo que no podemos responder sin un dato que todavía no tenemos.

---

Estimado Antonio:

Gracias por el detalle. Con esto ya se puede trabajar en serio, así que
respondo por partes y dejo al final las tres preguntas concretas que nos hace.

## 1. Las tarifas ya están cargadas y coinciden

La tabla de siete niveles de su correo coincide exactamente con la de las
Condiciones Generales de noviembre 2026, que es la que ya está implementada en
el sitio web. La comparamos de forma automática contra las dos fuentes por
separado —el contrato y su correo— y las catorce cifras de cada nivel dan
iguales.

También verificamos su ejemplo de Bronce:

| Concepto | Importe |
| --- | ---: |
| Costo mayorista | 500.000 Gs. |
| Recargo comercial 16 % | 80.000 Gs. |
| Los cinco servicios | 9.000 Gs. |
| **Total** | **589.000 Gs.** |

La calculadora del sitio devuelve ese mismo total. El estatus Pagador Rápido
lo bajaría a 584.000 Gs., con los servicios sin cambios.

Una recomendación de fondo: **que estas cifras vivan en un solo lugar**. Hoy
están en el sitio y mañana estarán en el CRM, y dos copias de una tabla de
tarifas se desincronizan siempre. Proponemos que el CRM sea la fuente y el
sitio la lea, o al revés, pero no que cada uno tenga la suya.

## 2. Dos cosas que su correo nos aclaró

Su correo distingue algo que nosotros habíamos juntado, y ya lo corregimos en
el sitio:

- El **cupo** es el costo mayorista máximo comprometido a la vez.
- El **acumulado** es el total de compras que hay que superar para poder pedir
  el ascenso.

No son lo mismo, y el sitio los trataba como si lo fueran.

**[confirmar]** ¿Los importes del acumulado para progresar son los mismos que
los del cupo, o son otra tabla? Las Condiciones Generales no lo precisan y
preferimos no publicar un número inventado.

También tomamos nota de dos reglas que no estaban en el sitio y ahora sí:

- Cada pedido se factura entero con el nivel vigente al confirmarlo, aunque
  haga pasar el acumulado.
- Los pagos parciales no liberan cupo hasta cancelar el pedido completo.

## 3. Formato de archivos

Para los datos de prueba y las estructuras, lo más cómodo para ambos lados es
**CSV en UTF-8, un archivo por entidad**, con la primera fila de encabezados.
Si su equipo trabaja en Excel, `.xlsx` también sirve y lo convertimos nosotros;
lo que conviene evitar es PDF o capturas, porque hay que volver a tipear y ahí
aparecen los errores.

Tres cosas que ayudan mucho si vienen así:

- **Una fila por registro, sin celdas combinadas ni filas de subtítulo.** Las
  tablas pensadas para imprimir cuestan más de importar que de volver a armar.
- **Importes en guaraníes, en número puro**, sin puntos de miles ni "Gs.".
  Es decir `2500000`, no `Gs. 2.500.000`.
- **Fechas en formato `AAAA-MM-DD`.** Evita la ambigüedad entre día y mes.

Para los formularios, su propia guía del CRM ya resuelve el problema: la
numeración `SI01`–`SI57`, `CT01`–`CT06`, `CS01`–`CS03`, `F01`–`F25` y
`MSG01`–`MSG29` es exactamente lo que necesita un sistema para no depender del
texto de las preguntas. Si nos pasan esa lista de códigos como CSV —código,
pregunta, tipo de valor, valores admitidos, nivel en que aplica— la cargamos
tal cual y los formularios quedan generados desde ahí.

Nosotros podemos enviarles las plantillas vacías con las columnas que espera el
sistema, para que las completen sin adivinar. Díganos si prefieren eso o
mandarnos lo que ya tienen y adaptamos nosotros.

## 4. Facturación electrónica

Acá necesitamos un dato antes de poder comprometer nada. En Paraguay hay dos
caminos para emitir factura electrónica por SIFEN/DNIT:

1. **A través de un proveedor habilitado**, que ya resolvió la firma digital,
   el envío a SIFEN y la representación gráfica (KuDE). El CRM se integra con
   la API de ese proveedor. Es el camino más rápido.
2. **Como facturador electrónico propio**, generando y firmando los documentos
   nosotros y dialogando directo con SIFEN. Da más control y menos costo por
   documento, pero exige certificado digital, homologación y un plazo de
   habilitación que no depende de nosotros.

**[confirmar]** ¿Doña Compra ya está habilitada como facturador electrónico, o
trabaja con algún proveedor? Si hay uno elegido, con el nombre alcanza: casi
todos publican su documentación de API y podemos estimar la integración.

Dos avisos sobre los plazos, porque afectan el orden de las etapas:

- La habilitación ante DNIT y la aprobación de WhatsApp Business API ante Meta
  son **trámites externos**. Conviene iniciarlos al principio aunque el
  desarrollo correspondiente venga en la tercera etapa; si se arrancan cuando
  toca construirlos, el proyecto se frena esperando a un tercero.
- Mientras tanto el CRM puede registrar los pedidos y emitir las cotizaciones
  igual, y la factura se conecta después. No es un bloqueo para empezar.

**[confirmar]** También necesitaremos el timbrado vigente y los puntos de
expedición que correspondan. Eso ya cuando estemos armando la integración.

## 5. Permisos y seguridad de los datos

Su organización por funciones se traduce bien a cinco roles:

| Rol | Alcance |
| --- | --- |
| Dirección | Todo, incluidas admisiones, ascensos, excepciones y autorizaciones financieras. |
| Asesor | Solo los expedientes asignados a esa persona, con sus formularios y documentos. |
| Coordinación | Solicitudes, visitas y avance de expedientes. Sin datos financieros. |
| Contabilidad | Facturas, pagos, conciliaciones y reportes. Sin el contenido de las evaluaciones. |
| Community Manager | Prospección, campañas y distintivos públicos autorizados. Sin acceso financiero. |

Sobre cómo lo implementamos, tres decisiones que vale la pena que conozca:

**Los permisos los aplica la base de datos, no el código.** Cada consulta pasa
por reglas de acceso a nivel de fila, de modo que un error de programación no
puede exponer un expediente que esa persona no debería ver. Es más trabajo al
principio y mucho menos riesgo después.

**Las decisiones quedan registradas con quién y cuándo.** Quién cambió un
nivel, quién autorizó una excepción, quién marcó un pago. No es solo
trazabilidad interna: si alguna vez hay una discusión sobre una operación, esa
bitácora es la prueba.

**Las autorizaciones CT01 a CT06 se guardan como lo que son:** permisos
separados, con su fecha, nunca marcados por defecto y revocables. El sistema
tiene que poder responder "¿este comerciante autorizó aparecer en la web?" con
un sí o un no fechado, no con una inferencia.

Sobre los datos personales, el marco es la **Ley 6534/2020**. En la práctica
eso significa guardar lo necesario, poder mostrarle al comerciante qué tenemos
sobre él, poder corregirlo y poder borrar lo que ya no corresponda.

**Una recomendación sobre los accesos técnicos.** En su correo menciona que los
accesos a Meta Business se concederán con permisos específicos. Le pedimos lo
mismo para todo lo demás: credenciales nominales por persona, nunca una
compartida, y tokens con el alcance mínimo. Y si alguna credencial viaja por
correo o por chat, conviene rotarla después de usarla: cualquier canal de
mensajería guarda copia.

## 6. Sobre las etapas

El orden que propone nos parece correcto. Dos ajustes menores:

- Como decíamos, **arrancar los trámites externos** (DNIT y Meta) junto con la
  primera etapa, aunque el desarrollo sea de la tercera.
- Agregar a la primera etapa la **bitácora de cambios**. Es mucho más barato
  construirla desde el inicio que agregarla sobre datos que ya existen sin
  historial.

Quedamos atentos a los documentos operativos y a los textos de los mensajes
cuando los tengan listos.

Saludos cordiales,

---

## Preguntas abiertas, en una lista

Para no perderlas entre el texto:

1. ¿El acumulado para progresar usa los mismos importes que el cupo, u otra tabla?
2. ¿Doña Compra factura electrónicamente ya? ¿Con proveedor habilitado o como facturador propio? ¿Cuál?
3. Timbrado y puntos de expedición, cuando llegue la integración.
4. ¿Prefieren plantillas vacías nuestras, o nos mandan lo que ya tienen?
5. Número definitivo de WhatsApp Business y estado de la cuenta de Meta Business.
6. El Legajo de buena gestión a Gs. 300.000 figura en el sitio pero no en ninguno de los documentos que nos pasaron. ¿Sigue vigente?
