"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  guardarPublicacion,
  type EstadoForm,
} from "@/app/admin/publicaciones/form-actions";
import type { Publicacion } from "@/db/schema";
import SubirImagen from "./SubirImagen";

const INPUT =
  "w-full rounded-[var(--radius-button)] border border-navy/25 bg-card px-3.5 py-2.5 text-[15px] text-ink focus:border-terracotta";
const LABEL = "mb-1.5 block text-xs uppercase tracking-[0.08em] text-muted";

function Err({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p role="alert" className="mt-1.5 text-[13px] text-error-ink">
      {msg}
    </p>
  );
}

function Guardar({ nueva }: { nueva: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="cursor-pointer rounded-[var(--radius-button)] bg-navy px-6 py-3 text-sm font-medium text-card hover:bg-navy-deep disabled:opacity-60"
    >
      {pending ? "Guardando…" : nueva ? "Crear publicación" : "Guardar cambios"}
    </button>
  );
}

/** Imágenes que ya están en el proyecto, para no tener que escribir la ruta. */
const DISPONIBLES = [
  "/assets/paso-1.jpg",
  "/assets/paso-2.jpg",
  "/assets/paso-3.jpg",
  "/assets/paso-4.jpg",
  "/assets/hero-1-640.jpg",
  "/assets/hero-2-640.jpg",
  "/assets/hero-3-640.jpg",
  "/assets/hero-4-640.jpg",
  "/assets/hoy-entrega-1400.jpg",
  "/assets/30-dias-pago-1400.jpg",
  "/assets/rubro-ropa.jpg",
  "/assets/rubro-calzado.jpg",
  "/assets/rubro-bijouterie.jpg",
  "/assets/rubro-cosmeticos.jpg",
  "/assets/rubro-perfumes.jpg",
  "/assets/rubro-peluquerias.jpg",
  "/assets/rubro-regaleria.jpg",
  "/assets/rubro-libreria.jpg",
  "/assets/rubro-revendedoras.jpg",
  "/assets/rubro-despensas.jpg",
  "/assets/rubro-comedores.jpg",
  "/assets/rubro-restaurantes.jpg",
];

const hoy = () => new Date().toISOString().slice(0, 10);

export default function FormPublicacion({
  p,
  subidaDisponible = false,
}: {
  p?: Publicacion;
  subidaDisponible?: boolean;
}) {
  const [estado, accion] = useActionState(
    guardarPublicacion,
    {} satisfies EstadoForm,
  );
  const [tipo, setTipo] = useState(p?.tipo ?? "foto");
  const [imagen, setImagen] = useState(p?.imagen ?? DISPONIBLES[0]);

  const e = estado.errores ?? {};
  const nueva = !p;

  return (
    <form action={accion} className="grid gap-5">
      {p && <input type="hidden" name="id" value={p.id} />}

      {estado.aviso && (
        <p
          role="alert"
          className="rounded-[var(--radius-card)] border border-error/40 bg-error/10 px-4 py-3 text-[14.5px] text-ink"
        >
          {estado.aviso}
        </p>
      )}

      <div>
        <label htmlFor="titulo" className={LABEL}>Título *</label>
        <input id="titulo" name="titulo" defaultValue={p?.titulo} className={INPUT} />
        <Err msg={e.titulo} />
        {nueva && (
          <p className="mt-1.5 text-xs text-muted">
            La dirección de la publicación se arma con el título. Si ya existe
            una igual, se le agrega un número.
          </p>
        )}
      </div>

      <div>
        <label htmlFor="texto" className={LABEL}>Texto *</label>
        <textarea
          id="texto"
          name="texto"
          rows={4}
          defaultValue={p?.texto}
          className={`${INPUT} min-h-[110px] resize-y`}
        />
        <Err msg={e.texto} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="tipo" className={LABEL}>Tipo *</label>
          <select
            id="tipo"
            name="tipo"
            value={tipo}
            onChange={(ev) => setTipo(ev.target.value as "foto" | "video")}
            className={INPUT}
          >
            <option value="foto">Foto</option>
            <option value="video">Video (9:16)</option>
          </select>
        </div>
        <div>
          <label htmlFor="categoria" className={LABEL}>Categoría *</label>
          <select id="categoria" name="categoria" defaultValue={p?.categoria ?? "Novedades"} className={INPUT}>
            <option value="Ofertas">Ofertas</option>
            <option value="Novedades">Novedades</option>
            <option value="Comunidad">Comunidad</option>
          </select>
        </div>
        <div>
          <label htmlFor="estado" className={LABEL}>Estado *</label>
          <select id="estado" name="estado" defaultValue={p?.estado ?? "pendiente"} className={INPUT}>
            <option value="pendiente">Pendiente (no se ve)</option>
            <option value="publicada">Publicada (visible)</option>
            <option value="rechazada">Rechazada</option>
            <option value="archivada">Archivada</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="ciudad" className={LABEL}>Ciudad *</label>
          <input id="ciudad" name="ciudad" defaultValue={p?.ciudad ?? "Asunción"} className={INPUT} />
          <Err msg={e.ciudad} />
        </div>
        <div>
          <label htmlFor="autor" className={LABEL}>Publica *</label>
          <input id="autor" name="autor" defaultValue={p?.autor ?? "Doña Compra"} className={INPUT} />
          <Err msg={e.autor} />
        </div>
        <div>
          <label htmlFor="precio" className={LABEL}>Precio en Gs.</label>
          <input
            id="precio"
            name="precio"
            inputMode="numeric"
            defaultValue={p?.precio ? String(p.precio) : "0"}
            className={`${INPUT} font-mono`}
          />
          <Err msg={e.precio} />
          <p className="mt-1.5 text-xs text-muted">0 = sin precio.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <div>
          <label htmlFor="imagen" className={LABEL}>Imagen de portada *</label>
          <input
            id="imagen"
            name="imagen"
            list="imagenes-disponibles"
            value={imagen}
            onChange={(ev) => setImagen(ev.target.value)}
            className={INPUT}
          />
          <datalist id="imagenes-disponibles">
            {DISPONIBLES.map((src) => (
              <option key={src} value={src} />
            ))}
          </datalist>
          <Err msg={e.imagen} />
          <p className="mt-1.5 text-xs text-muted">
            Subí un archivo acá abajo, o escribí una ruta de las que ya están
            en el proyecto o una URL completa.
          </p>
        </div>
        {/* Vista previa: evita publicar con una ruta mal escrita. */}
        <div className="flex items-end">
          <span className="block h-[68px] w-[90px] overflow-hidden rounded-[var(--radius-button)] border border-navy/15 bg-grad-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagen}
              alt=""
              className="h-full w-full object-cover"
              onError={(ev) => {
                ev.currentTarget.style.opacity = "0";
              }}
            />
          </span>
        </div>
      </div>

      <SubirImagen disponible={subidaDisponible} onSubida={setImagen} />

      <div>
        <label htmlFor="imagenAlt" className={LABEL}>
          Texto alternativo de la imagen
        </label>
        <input id="imagenAlt" name="imagenAlt" defaultValue={p?.imagenAlt ?? ""} className={INPUT} />
        <p className="mt-1.5 text-xs text-muted">
          Describe la foto para quien no puede verla. Si se deja vacío se arma
          con el título, la categoría y la ciudad.
        </p>
      </div>

      {tipo === "video" && (
        <div>
          <label htmlFor="videoUrl" className={LABEL}>
            URL del reproductor externo
          </label>
          <input
            id="videoUrl"
            name="videoUrl"
            placeholder="https://player.vimeo.com/video/…"
            defaultValue={p?.videoUrl ?? ""}
            className={INPUT}
          />
          <Err msg={e.videoUrl} />
          <p className="mt-1.5 text-xs text-muted">
            Cloudflare Stream, Vimeo o YouTube no listado. Sin esto se muestra
            la portada con un aviso.
          </p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="fecha" className={LABEL}>Fecha que se muestra *</label>
          <input
            id="fecha"
            name="fecha"
            type="date"
            defaultValue={p?.fecha ?? hoy()}
            className={INPUT}
          />
          <Err msg={e.fecha} />
        </div>
        <div>
          <label htmlFor="notaModeracion" className={LABEL}>
            Nota interna
          </label>
          <input
            id="notaModeracion"
            name="notaModeracion"
            defaultValue={p?.notaModeracion ?? ""}
            className={INPUT}
          />
          <p className="mt-1.5 text-xs text-muted">No se muestra en el sitio.</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-navy/10 pt-5">
        <Guardar nueva={nueva} />
        <Link
          href="/admin/publicaciones"
          className="rounded-[var(--radius-button)] border border-navy/25 px-5 py-3 text-sm text-ink hover:border-terracotta"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
