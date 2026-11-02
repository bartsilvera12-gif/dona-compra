import { and, asc, desc, eq, lte, sql, type SQL } from "drizzle-orm";
import { db } from "./index";
import { publicaciones, reacciones, type Publicacion } from "./schema";
import { DEMO } from "./anuncios-demo";

export const CATEGORIAS = ["Ofertas", "Novedades", "Comunidad"] as const;
export const TIPOS = ["foto", "video"] as const;
export const ORDENES = {
  recientes: "Más recientes",
  antiguos: "Más antiguos",
  "precio-asc": "Menor precio",
  "precio-desc": "Mayor precio",
} as const;

export type Orden = keyof typeof ORDENES;
export const POR_PAGINA = 9;

export type Filtros = {
  categoria?: string;
  ciudad?: string;
  tipo?: string;
  precioMax?: number;
  orden?: Orden;
  pagina?: number;
};

/** Publicación lista para mostrar, con el conteo de me gusta ya resuelto. */
export type ItemFeed = Publicacion & {
  meGusta: number;
  /** true cuando los datos son de ejemplo porque no hay base conectada. */
  esDemo?: boolean;
};

export type ResultadoFeed = {
  items: ItemFeed[];
  total: number;
  pagina: number;
  paginas: number;
  ciudades: string[];
  /** La interfaz avisa cuando lo que se ve es contenido de ejemplo. */
  modoDemo: boolean;
};

function ordenSql(orden: Orden) {
  switch (orden) {
    case "antiguos":
      return asc(publicaciones.fecha);
    case "precio-asc":
      return asc(publicaciones.precio);
    case "precio-desc":
      return desc(publicaciones.precio);
    default:
      return desc(publicaciones.fecha);
  }
}

/* ---------------------------------------------------------------------------
   Respaldo sin base de datos
   Mientras no haya DATABASE_URL se sirve contenido de ejemplo, y la página
   lo dice en pantalla. Es preferible a una pantalla vacía sin explicación,
   y el aviso evita que se confunda con publicaciones reales.
   --------------------------------------------------------------------------- */
function feedDemo(f: Filtros): ResultadoFeed {
  const orden = f.orden ?? "recientes";
  let items = DEMO.filter((p) => {
    if (f.categoria && p.categoria !== f.categoria) return false;
    if (f.ciudad && p.ciudad !== f.ciudad) return false;
    if (f.tipo && p.tipo !== f.tipo) return false;
    if (f.precioMax && f.precioMax > 0 && p.precio > f.precioMax) return false;
    return true;
  });

  items = items.slice().sort((a, b) => {
    if (orden === "precio-asc") return a.precio - b.precio;
    if (orden === "precio-desc") return b.precio - a.precio;
    if (orden === "antiguos") return a.fecha < b.fecha ? -1 : 1;
    return a.fecha > b.fecha ? -1 : 1;
  });

  const total = items.length;
  const pagina = Math.max(1, f.pagina ?? 1);
  const desde = (pagina - 1) * POR_PAGINA;

  return {
    items: items.slice(desde, desde + POR_PAGINA),
    total,
    pagina,
    paginas: Math.max(1, Math.ceil(total / POR_PAGINA)),
    ciudades: [...new Set(DEMO.map((p) => p.ciudad))].sort(),
    modoDemo: true,
  };
}

export async function listarPublicaciones(f: Filtros): Promise<ResultadoFeed> {
  if (!db) return feedDemo(f);

  const orden = f.orden ?? "recientes";
  const pagina = Math.max(1, f.pagina ?? 1);

  // Solo lo aprobado por moderación llega al feed.
  const condiciones: SQL[] = [eq(publicaciones.estado, "publicada")];
  if (f.categoria && (CATEGORIAS as readonly string[]).includes(f.categoria)) {
    condiciones.push(
      eq(publicaciones.categoria, f.categoria as (typeof CATEGORIAS)[number]),
    );
  }
  if (f.ciudad) condiciones.push(eq(publicaciones.ciudad, f.ciudad));
  if (f.tipo && (TIPOS as readonly string[]).includes(f.tipo)) {
    condiciones.push(eq(publicaciones.tipo, f.tipo as (typeof TIPOS)[number]));
  }
  if (f.precioMax && f.precioMax > 0) {
    condiciones.push(lte(publicaciones.precio, f.precioMax));
  }
  const donde = and(...condiciones);

  const [filas, [conteo], ciudadesFilas] = await Promise.all([
    db
      .select({
        p: publicaciones,
        meGusta: sql<number>`(
          select count(*)::int from ${reacciones}
          where ${reacciones.publicacionId} = ${publicaciones.id}
        )`,
      })
      .from(publicaciones)
      .where(donde)
      .orderBy(ordenSql(orden))
      .limit(POR_PAGINA)
      .offset((pagina - 1) * POR_PAGINA),

    db
      .select({ n: sql<number>`count(*)::int` })
      .from(publicaciones)
      .where(donde),

    // Las ciudades del desplegable salen de lo que hay publicado, no de una
    // lista fija que se desactualiza.
    db
      .selectDistinct({ ciudad: publicaciones.ciudad })
      .from(publicaciones)
      .where(eq(publicaciones.estado, "publicada"))
      .orderBy(asc(publicaciones.ciudad)),
  ]);

  const total = conteo?.n ?? 0;
  return {
    items: filas.map((r) => ({ ...r.p, meGusta: r.meGusta })),
    total,
    pagina,
    paginas: Math.max(1, Math.ceil(total / POR_PAGINA)),
    ciudades: ciudadesFilas.map((c) => c.ciudad),
    modoDemo: false,
  };
}

export async function obtenerPorSlug(slug: string): Promise<ItemFeed | null> {
  if (!db) {
    const p = DEMO.find((d) => d.slug === slug);
    return p ? { ...p, esDemo: true } : null;
  }

  const [fila] = await db
    .select({
      p: publicaciones,
      meGusta: sql<number>`(
        select count(*)::int from ${reacciones}
        where ${reacciones.publicacionId} = ${publicaciones.id}
      )`,
    })
    .from(publicaciones)
    .where(
      and(eq(publicaciones.slug, slug), eq(publicaciones.estado, "publicada")),
    )
    .limit(1);

  return fila ? { ...fila.p, meGusta: fila.meGusta } : null;
}

/** Slugs publicados, para el sitemap. */
export async function slugsPublicados(): Promise<
  { slug: string; fecha: string }[]
> {
  if (!db) return DEMO.map((p) => ({ slug: p.slug, fecha: p.fecha }));
  const filas = await db
    .select({ slug: publicaciones.slug, fecha: publicaciones.fecha })
    .from(publicaciones)
    .where(eq(publicaciones.estado, "publicada"))
    .orderBy(desc(publicaciones.fecha));
  return filas;
}
