# Plan de mejora visual — ChapiTag NFC

Auditoría de motion + diseño (2026-08-31). Objetivo del usuario: animaciones,
colores, diseño, transiciones, animación de scroll, suavizado de bordes y
degradados. También un pase de responsive/mobile. Sin dependencias nuevas
(Bootstrap descartado — choca con Tailwind v4).

## Estado del proyecto

- Next 16.3.3 · React 19.2 · Tailwind v4 · next-themes. Sin librería de motion.
- Motion: keyframes CSS en `globals.css` + `ScrollReveal` (IntersectionObserver).
- Tokens de easing ya correctos (`--ease-out`, `--ease-in-out` = curvas de Emil
  Kowalski). `prefers-reduced-motion` cubierto.
- Personalidad: consumer app juguetona (Baloo 2, emojis, blobs pastel, bounce-in).

## Orden de ejecución

| # | Plan | Superficie | Riesgo | Estado |
|---|------|-----------|--------|--------|
| 001 | Fundaciones CSS: tokens de duración, `corner-shape`, `.hover-lift`, variantes de reveal, CSS de view-transitions + reduced-motion | globals.css | bajo | DONE |
| 002 | Degradados ricos (3 stops + brillo radial) en los 8 temas + fondo con grano | themes.ts, globals.css | bajo | DONE |
| 003 | `ScrollReveal` con variantes (fade/scale) y stagger por contenedor; aplicarlo a admin + detalle de mascota | ScrollReveal.tsx, páginas | medio | DONE |
| 004 | Crossfade en `PhotoGallery` al cambiar de foto | PhotoGallery.tsx | bajo | DONE |
| 005 | Transición de entrada de página vía `template.tsx` (panel + admin) — NO se usó React `<ViewTransition>` porque en Next 16.3 requiere activar el canal experimental de React (`needsExperimentalReact`), desproporcionado para un pase visual. El CSS de view-transitions queda en globals.css por si se activa a futuro. | panel/template.tsx, admin template | bajo | DONE |
| 006 | Entrada en páginas de auth + estado "pending" del botón submit | ingresar, registro, admin/ingresar, PetForm | bajo | DONE |
| 007 | Mobile: grid de stats del admin, cantidad de blobs en pantallas chicas, touch targets | admin, layouts | bajo | DONE |
| 008 | Count-up en `StatCard` + barras del sparkline al entrar en vista | admin, TagsSparkline | bajo | DONE |

## ⚠️ Por qué "varias animaciones no se ven"

El navegador/SO del usuario tiene **`prefers-reduced-motion: reduce` activo**
(verificado en `document.timeline` + `matchMedia`). El bloque
`@media (prefers-reduced-motion: reduce)` de `globals.css` desactiva casi
todo el motion — es correcto por accesibilidad. Para ver todas las
animaciones: Windows → Configuración → Accesibilidad → Efectos visuales →
"Efectos de animación" = **Activado** (o en Chrome, revisar que no esté
forzado en DevTools › Rendering).

3er pase (2026-08-31): se suavizó el fallback reduced-motion (no "cero"):
anillos NFC laten en opacidad (`ping-fade`), scroll reveals hacen fade de
opacidad sin slide, hover conserva sombra/color. Agregado: `float-a/b` con
escala+rotación; `.text-gradient-animated` (shimmer del headline);
`.btn-sheen` (barrido de brillo en botones); `.hover-glow` (glow índigo en
cards); `tag-wobble`/`phone-bob` en la ilustración NFC; `.bg-drift`
(degradado que deriva, disponible sin usar aún en el perfil).

## Hallazgos que NO se tocan (por diseño)

- `press-scale` se mantiene bajo reduced-motion — es feedback ligado al input,
  documentado, correcto.
- `transform-origin: center` implícito en modales/cards centradas — correcto.
- Tailwind v4 ya aplica `hover:` solo bajo `@media (hover: hover)` — el
  "hover pegado en touch" no es un problema real acá.
