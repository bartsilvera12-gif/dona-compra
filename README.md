# Doña Compra

Landing page de **Doña Compra** — comprá mercadería para tu negocio y pagá después (Gran Asunción, Paraguay).

Sitio estático de una sola página, con ruteo por hash (`#/como-funciona`, `#/niveles-y-tarifas`, etc.).

## Estructura

| Archivo | Para qué sirve |
| --- | --- |
| `index.html` | Página publicada (copia de `Doña Compra.dc.html`) |
| `Doña Compra.dc.html` | Fuente editable en el editor dc |
| `Doña Compra v1.dc.html` | Versión anterior, archivada |
| `support.js`, `image-slot.js` | Runtime dc (generado, no editar a mano) |
| `assets/` | Imágenes usadas por la página |
| `uploads/` | Material fuente (originales, PDFs, capturas). No se publica |

## Ver en local

```bash
npx serve .
```

Y abrir http://localhost:3000

## Deploy en Vercel

El proyecto no necesita build: Vercel sirve los archivos estáticos tal cual.

- **Framework preset:** Other
- **Build command:** (vacío)
- **Output directory:** (vacío / raíz)

`vercel.json` define el cacheo de `assets/` y `.vercelignore` excluye `uploads/` del deploy.

## Al editar

Después de cambiar `Doña Compra.dc.html`, regenerá la página publicada:

```bash
cp "Doña Compra.dc.html" index.html
```
