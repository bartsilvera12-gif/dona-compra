/**
 * Condiciones Generales de Servicio y de Venta, noviembre 2026.
 *
 * Transcripción fiel del documento contractual que firma el comerciante. No
 * es un resumen ni una reescritura: el texto va como está, artículo por
 * artículo, porque es el documento que manda (artículo 1).
 *
 * Las dos grillas tarifarias —cupos y recargos, y los cinco servicios— NO se
 * copian de acá: se arman desde `niveles.ts`, que es la única fuente de esos
 * números en todo el sitio y está verificada contra este mismo contrato por
 * `npm run check:niveles`. Si alguna vez difieren, salta el check.
 */

export const CGV_VERSION = "Noviembre 2026";

export type ArticuloCGV = {
  n: number;
  titulo: string;
  /** Párrafos sueltos, antes de la lista numerada. */
  intro?: string[];
  /** Puntos numerados del artículo. */
  puntos?: string[];
  /** Grilla que se arma desde niveles.ts, no desde este archivo. */
  tabla?: "analisis" | "cupos" | "recargos" | "servicios";
  /** Párrafos que van después de la lista o la tabla. */
  cierre?: string[];
  /** Segunda grilla, al final del artículo. */
  tablaCierre?: "analisis" | "cupos" | "recargos" | "servicios";
};

export const CGV: ArticuloCGV[] = [
  {
    n: 1,
    titulo: "Identificación, Objeto y Documentos Contractuales",
    intro: [
      "Las presentes Condiciones Generales regulan el conjunto de las operaciones de adquisición de mercaderías por Doña Compra (RUC 9405073-2, con domicilio en Edificio Diamante 1, Calle Coronel Feliciano Duarte, 111 403 San Lorenzo, Paraguay) por cuenta de los comerciantes asociados y para su reventa a ellos (el «Comerciante»), así como la prestación de los servicios asociados y de los programas colectivos Doña Compra.",
      "El contrato se forma por el siguiente conjunto indisociable:",
    ],
    puntos: [
      "Las presentes Condiciones Generales, incluidas las grillas tarifarias y los cuadros de servicios integrados.",
      "La solicitud de admisión inicial, el diagnóstico previo y las cotizaciones específicas de cada pedido.",
    ],
    cierre: [
      "Todo pedido implica la adhesión íntegra y sin reservas del Comerciante a las presentes condiciones, con exclusión de sus propias condiciones de compra.",
    ],
  },
  {
    n: 2,
    titulo: "Modelo Comercial y Elección de Mercaderías («Elegí tu Mercadería!»)",
    puntos: [
      "El Comerciante selecciona libremente los productos, las cantidades y el mayorista de su elección.",
      "Doña Compra compra las mercaderías en nombre propio y las revende al Comerciante emitiéndole una factura de reventa (conforme al sistema SIFEN/DNIT).",
      "Doña Compra concede un plazo de pago diferido de 30 días calendarios como máximo, calculado a partir del día efectivo del retiro de las mercaderías en el proveedor.",
      "Las mercaderías adquiridas deben destinarse exclusivamente a la actividad profesional de reventa del Comerciante. La operación constituye una venta comercial con pago diferido y no constituye en ningún caso un préstamo de dinero, un crédito bancario ni una apertura de crédito al consumo.",
    ],
  },
  {
    n: 3,
    titulo: "Admisión, Análisis y Niveles",
    puntos: [
      "Admisión y Niveles: el ingreso a la red se realiza según siete niveles progresivos (Hierro, Cobre, Bronce, Plata, Oro, Rubis, Diamante), cada uno de los cuales confiere un cupo de compras y un recargo específico. Los ingresos directos a niveles intermedios requieren Análisis previos pagos y acumulativos.",
      "Análisis: el pago de los análisis cubre los gastos de diagnóstico y la emisión de un informe de recomendaciones. No garantiza ni la aceptación automática del candidato ni el reembolso en caso de rechazo.",
      "Beneficio de devolución de los análisis: cuando este beneficio sea aplicable tras la admisión, el crédito comercial nominal equivalente al 50 % de la evaluación elemental de ingreso se divide en tramos de un tercio aplicables a las primeras compras de los nuevos niveles superiores alcanzados. Caduca un año después de la admisión.",
    ],
    tabla: "analisis",
  },
  {
    n: 4,
    titulo: "Cupos, Pedidos y Cambios de Nivel",
    puntos: [
      "Cada nivel determina un cupo máximo de compromisos de compra.",
      "Por razones de gastos de tramitación, cada pedido debe respetar un monto mínimo de compras (100.000 Gs en Hierro, 150.000 Gs a partir de Cobre).",
      "Acumulación de pedidos: el Comerciante está autorizado a mantener y acumular varios pedidos en curso (con uno o varios mayoristas) siempre que la suma total de los costos de compra de las mercaderías comprometidas y aún no liberadas no supere el cupo global autorizado de su nivel.",
      "Ninguna automaticidad de cambio de nivel se confiere por el solo hecho de superar el cupo de compras: el cambio requiere la cancelación total de los pedidos dentro de 30 días, una solicitud formal, un nuevo análisis y una decisión de la dirección de Doña Compra.",
      "Doña Compra conserva la libertad absoluta de rechazar un pedido por motivo legítimo, aunque el cupo del Comerciante lo permitiera.",
    ],
    tabla: "cupos",
  },
  {
    n: 5,
    titulo: "Formación del Pedido y Retiro",
    puntos: [
      "Todo pedido requiere una validación previa por un canal oficial (WhatsApp, correo electrónico, aplicación, etc.) que detalle la lista de productos, el proveedor y la identidad de la persona habilitada para el retiro.",
      "La entrega de las mercaderías se efectúa en el local del mayorista designado. Doña Compra emite un Código de recepción único. La entrega de la mercadería se efectúa contra presentación de la factura y de este código seguro.",
      "Reserva de dominio: Doña Compra permanece propietaria exclusiva de las mercaderías vendidas hasta el pago íntegro del precio, capital y accesorios.",
    ],
  },
  {
    n: 6,
    titulo: "Facturación, Precio, Prestaciones y Estatus Pagador Rápido",
    intro: [
      "El precio total de cada pedido se compone del costo mayorista facturado por el mayorista, de un recargo comercial porcentual aplicado sobre el costo mayorista, y de la tarifa fija, para cada uno de los niveles, de los Cinco Servicios Doña Compra aplicables.",
      "El recargo se aplica sobre el costo mayorista definido en la cotización, no sobre el precio final de venta.",
    ],
    tabla: "recargos",
    cierre: [
      "Estatus de Reconocimiento y Fidelización «Pagador Rápido». A fin de recompensar el rigor de los comerciantes, se instituye un estatus de Pagador Rápido según las siguientes reglas:",
      "Condiciones de elegibilidad: calculado sobre la base de los 6 últimos pedidos como mínimo completamente saldados, el comerciante debe presentar una duración media de pago estrictamente inferior a 25 días (respecto del plazo teórico de 30 días).",
      "Ventaja para el comerciante: atribución de una reducción de 1 punto porcentual sobre el recargo comercial aplicable a las mercaderías. (Ejemplo: un comerciante de nivel Bronce pasa de un recargo del 16 % al 15 %).",
      "Aplicación no retroactiva: la reducción de un punto se aplica exclusivamente a los nuevos pedidos realizados después de la obtención oficial del estatus, y no retroactúa en ningún caso sobre las facturas anteriores.",
      "Ventajas asociadas: atribución de una insignia distintiva, entrega de un autoadhesivo informativo para el comercio del cliente, acceso personal del comerciante y autorización para que sus propios clientes se adhieran al Club Doña Compra.",
      "Nota: esta reducción solo se refiere al margen sobre las mercaderías; los cinco servicios Doña Compra se siguen facturando según su escala normal. Este estatus se reevalúa periódicamente y se revoca de inmediato en caso de atraso de pago más allá del día J.",
    ],
    tablaCierre: "servicios",
  },
  {
    n: 7,
    titulo: "Venta de Servicios Complementarios",
    intro: [
      "Doña Compra podrá proponer puntualmente servicios complementarios para responder a necesidades específicas del Comerciante (logística excepcional, acompañamiento técnico reforzado, prestaciones publicitarias a medida o capacitaciones). Estos servicios serán objeto de una cotización previa o de una descripción validada por escrito que mencione expresamente su tarifa, su alcance exacto y las modalidades de su facturación distinta, sin modificar las condiciones aplicables a los 5 servicios estándar de base.",
    ],
  },
  {
    n: 8,
    titulo: "Pago, Atrasos y Suspensión",
    puntos: [
      "El pago es exigible a más tardar 30 días calendarios desde el día del retiro de las mercaderías en el proveedor. No se concede ningún descuento por pago anticipado. Se precisa que esta prohibición de descuento no obsta a la aplicación de la reducción de fidelización del estatus «Pagador Rápido» (Artículo 6), la cual depende de la obtención previa de dicho estatus.",
      "Falta de pago (J+1): todo atraso conlleva la suspensión inmediata del acceso a nuevas compras. El desbloqueo queda subordinado a un examen individual de la dirección tras la cancelación de las sumas adeudadas. Este atraso conllevará una exclusión de la red Doña Compra o, en el mejor de los casos, tras un nuevo análisis, una aceptación del comerciante en el nivel Hierro o Cobre, cualquiera que fuera el nivel alcanzado anteriormente.",
      "Los pagos parciales no liberan un nuevo cupo a prorrata.",
    ],
  },
  {
    n: 9,
    titulo: "Reclamos, Vicios y Entregas",
    puntos: [
      "El Comerciante debe verificar la mercadería al recibirla en el mayorista y formular de inmediato toda reserva documentada.",
      "Doña Compra transmite y coordina los reclamos ante el mayorista en su calidad de revendedora, sin asumir una garantía directa superior a la otorgada por el fabricante o el mayorista inicial, sin perjuicio de las disposiciones imperativas de la legislación paraguaya aplicable.",
    ],
  },
  {
    n: 10,
    titulo: "Inactividad, Rescisión y Fin del Contrato",
    puntos: [
      "Un período de tres meses calendarios sin pedido válido conlleva la rescisión del estatus de miembro (previo aviso de 30 y 7 días).",
      "La rescisión no extingue las deudas nacidas con anterioridad.",
    ],
  },
  {
    n: 11,
    titulo: "Garantías, Pagarés y Gastos de Cobranza",
    intro: [
      "Cuando se exija y se convenga por escrito un pagaré de garantía, su monto facial queda estrictamente limitado a 1,25 veces el cupo de compras autorizado del nivel (IVA incluido), conforme a las disposiciones legales vigentes (Ley 7614/2025). Toda cobranza judicial o extrajudicial consecutiva a un impago definitivo correrá íntegramente a cargo del Comerciante moroso (gastos de abogado, honorarios y costas).",
    ],
  },
  {
    n: 12,
    titulo: "Propiedad Intelectual y Consecuencias de la Rescisión",
    intro: [
      "Todas las herramientas metodológicas, programas, denominaciones y soportes de Doña Compra siguen siendo de su propiedad exclusiva. En caso de rescisión, de suspensión o de fin de la relación contractual, el Comerciante no podrá en ningún caso invocar su calidad de miembro de la red Doña Compra ni utilizar sus marcas, logos o elementos distintivos, bajo pena de acciones judiciales inmediatas.",
    ],
  },
  {
    n: 13,
    titulo: "Datos Personales (Conformidad Ley 6534/2020)",
    puntos: [
      "Los datos recolectados son objeto de un tratamiento informático destinado a la gestión de los pedidos, del riesgo de crédito y de la relación comercial, conforme a la Ley 6534/2020 sobre la protección de los datos de carácter personal de la República del Paraguay.",
      "El Comerciante dispone de derechos de acceso, rectificación y oposición que puede ejercer a través de los canales oficiales.",
    ],
  },
  {
    n: 14,
    titulo: "Fuerza Mayor y Prueba Electrónica",
    puntos: [
      "La responsabilidad de las partes no podrá ser exigida en caso de fuerza mayor en el sentido del Código Civil paraguayo.",
      "Conforme a la legislación vigente (en particular la Ley 6822/2021 sobre los servicios de confianza y el comercio electrónico), las comunicaciones electrónicas y los mensajes intercambiados por los canales oficiales designados tienen plena fuerza probatoria.",
    ],
  },
  {
    n: 15,
    titulo: "Derecho Aplicable y Jurisdicción",
    puntos: [
      "Las presentes condiciones se rigen e interpretan conforme a las leyes de la República del Paraguay.",
      "Toda controversia relativa a la validez, la interpretación o la ejecución de las presentes será sometida a la competencia exclusiva de los tribunales ordinarios de la Circunscripción Judicial de San Lorenzo (Paraguay).",
    ],
  },
];
