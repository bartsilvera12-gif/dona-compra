/** Formato de moneda y fechas, en es-PY y en un solo lugar. */

const gs = new Intl.NumberFormat("es-PY", { maximumFractionDigits: 0 });

export function precioGs(n: number): string {
  return "Gs. " + gs.format(Math.round(n || 0));
}

const larga = new Intl.DateTimeFormat("es-PY", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

/** Recibe una fecha ISO (YYYY-MM-DD) y la escribe en palabras. */
export function fechaLarga(iso: string): string {
  try {
    // El mediodía evita que el huso horario corra la fecha un día.
    return larga.format(new Date(iso + "T12:00:00"));
  } catch {
    return iso;
  }
}
