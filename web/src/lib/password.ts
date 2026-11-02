import {
  randomBytes,
  scrypt as scryptCb,
  timingSafeEqual,
  type ScryptOptions,
} from "node:crypto";

// Envoltorio propio en vez de promisify: la version promisificada pierde la
// sobrecarga que acepta opciones, y los parametros de coste son justamente
// lo que hay que poder pasar.
function scrypt(
  clave: string,
  sal: Buffer,
  largo: number,
  opciones: ScryptOptions,
): Promise<Buffer> {
  return new Promise((resolver, rechazar) => {
    scryptCb(clave, sal, largo, opciones, (err, derivado) =>
      err ? rechazar(err) : resolver(derivado as Buffer),
    );
  });
}

/**
 * Hash de contraseñas con scrypt.
 *
 * scrypt viene en Node, así que no hace falta sumar bcrypt ni argon2 como
 * dependencia. Es una función deliberadamente cara en CPU y en memoria, que
 * es lo que encarece probar contraseñas por fuerza bruta.
 *
 * Formato guardado: scrypt$N$r$p$<sal base64>$<derivado base64>.
 * Los parámetros van adentro para poder subirlos más adelante sin invalidar
 * los hashes ya existentes.
 */

const N = 16384; // coste de CPU y memoria (2^14)
const R = 8;
const P = 1;
const LARGO = 64;
const SAL = 16;

export async function hashearPassword(plano: string): Promise<string> {
  const sal = randomBytes(SAL);
  const derivado = await scrypt(plano.normalize("NFKC"), sal, LARGO, {
    N,
    r: R,
    p: P,
    // Node limita la memoria de scrypt por defecto y este N la excede.
    maxmem: 64 * 1024 * 1024,
  });

  return [
    "scrypt",
    N,
    R,
    P,
    sal.toString("base64"),
    derivado.toString("base64"),
  ].join("$");
}

export async function verificarPassword(
  plano: string,
  guardado: string,
): Promise<boolean> {
  try {
    const partes = guardado.split("$");
    if (partes.length !== 6 || partes[0] !== "scrypt") return false;

    const [, n, r, p, salB64, derivadoB64] = partes;
    const sal = Buffer.from(salB64, "base64");
    const esperado = Buffer.from(derivadoB64, "base64");

    const calculado = await scrypt(plano.normalize("NFKC"), sal, esperado.length, {
      N: Number(n),
      r: Number(r),
      p: Number(p),
      maxmem: 64 * 1024 * 1024,
    });

    // Comparación en tiempo constante: una comparación normal corta en el
    // primer byte distinto y filtra información por el tiempo que tarda.
    if (calculado.length !== esperado.length) return false;
    return timingSafeEqual(calculado, esperado);
  } catch {
    return false;
  }
}

/**
 * Hash señuelo, con el mismo coste que uno real.
 *
 * Cuando el correo no existe igual se verifica contra esto, para que entrar
 * con un correo inexistente tarde lo mismo que con uno real. Si no, el tiempo
 * de respuesta delata qué direcciones están registradas.
 */
let senuelo: string | null = null;

export async function gastarTiempoComoSiExistiera(plano: string) {
  if (!senuelo) senuelo = await hashearPassword(randomBytes(32).toString("hex"));
  await verificarPassword(plano, senuelo);
}

/** Reglas mínimas. Largo antes que composición: es lo que más aporta. */
export function validarPassword(p: string): string | null {
  if (p.length < 12) return "La contraseña tiene que tener al menos 12 caracteres.";
  if (p.length > 200) return "La contraseña es demasiado larga.";
  if (/^\s|\s$/.test(p)) return "La contraseña no puede empezar ni terminar con espacios.";
  return null;
}
