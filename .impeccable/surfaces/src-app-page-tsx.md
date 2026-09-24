---
version: 1
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: ["src/app/p/[code]/page.tsx","src/app/panel","src/app/admin"]
---

# Surface brief — ChapiTag (rediseño completo)

Scope: toda la app web. Primera superficie: landing `/` (Persuade). Se extiende con el mismo mundo a: perfil público `/p/[code]` (Operate, quien encuentra), panel del dueño `/panel/**` (Operate), admin `/admin/**` (Operate, denso), auth (`/ingresar`, `/registro`, `/recuperar`), afiche imprimible y hoja de QR para imprenta.

Audiencia y acción: dueño de mascota en Argentina que decide comprar/activar una chapita (landing); quien encuentra a la mascota y tiene que contactar al dueño en segundos (perfil); dueño que administra, activa modo perdido y ve escaneos (panel); operador que genera, imprime y da de baja lotes (admin).

Prueba disponible: el mecanismo mismo (perfil de ejemplo Firulais, código DEMO, marcado como ejemplo). Sin testimonios, precios ni cifras: no inventar.

Restricciones: voseo rioplatense; WCAG AA al aire libre; objetivos ≥48px en el perfil; reduced-motion; sin nuevas dependencias pesadas (se permiten lucide-react y qrcode).

## Direction contract

THESIS: Cada mascota es una chapita. El color anodizado ES su identidad y todo texto importante está grabado: metal claro que aparece al sacar el color. Rechaza la landing de mascotas de siempre (pasteles, huellitas, blobs, foto de perro con botón "Comprar") y su opuesto tech oscuro con neón.

OWN-WORLD: Fondo aluminio champagne (#EDEBE7, gris apenas tibio, no crema), tinta grafito tibia (#1C1A17), marca en bronce anodizado (#6E4B2A) — cambio de paleta aprobado por el usuario en una página de decisión (antes: aluminio frío #F1F3F5 + azul #1B46C2, que queda solo como color de chapita "Azul"). Campos planos de anodizado a escala de región: un color por mascota (azul, rojo, dorado, verde, celeste, violeta, rosa, negro); el dorado acompaña a la marca por defecto. Texto sobre anodizado en metal claro con un filo oscuro arriba (grabado hundido). Naranja de alerta #FF5B14 reservado por ley para "perdida". Una sola familia: Archivo (Omnibus-Type, Buenos Aires). Siluetas de chapita (disco, hueso, cabeza de gato, siempre con agujero y aro partido), exhibidor perforado, collar colgado y — pedido del usuario — perro y gato planos en grafito con su chapita. Íconos de trazo único (lucide). Sin degradés de texto, sin blobs, sin emojis, sin huellitas.

STORY: El visitante ve su futura chapita colgando del exhibidor, le graba el nombre de su mascota, la da vuelta y ve lo que abre cualquier celular. Entiende: sin app, perfil vivo, modo perdido, aviso por email cuando la escanean. Hace: "Quiero mi chapita" o activa una que ya tiene.

FIRST VIEWPORT: Desktop: izquierda (5/12) titular grande en Archivo expandido, bajada de dos líneas, dos acciones (primaria azul "Activar mi chapita", secundaria "Ver perfil de ejemplo" — no hay canal de venta todavía, así que no se promete compra) y debajo el campo "¿Cómo se llama?" con los 8 colores. Derecha (7/12): exhibidor perforado a sangre con 7 chapitas anodizadas colgando de ganchos; la central, grande, se graba en vivo con el nombre tipeado. Mobile: la chapita central arriba, titular y acciones debajo, todo en un viewport.

FORM: Grabado sobre anodizado — posición 3 de mi lista ordenada (1 SUBE/validador, 2 libreta sanitaria, 3 chapita anodizada grabada, 4 afiche Se busca, 5 señalética porteña, 6 reflectivos, 7 DNI). Seed 0d43930d. Raises: tamaño = jerarquía (afiche pintado); estado = ley de paleta (arcade); una sola familia (anuario); frente/dorso registrados (plegado); unidades idénticas en fila en admin (vúmetros); texto siempre en el plano más cercano (capas).

Signature interaction: grabado en vivo del nombre sobre la chapita + giro frente/dorso (la chapita se da vuelta y muestra chip, código y "acercá el celular"). Motion: péndulo desde el gancho al tocar/hover; nada de entradas idénticas por sección.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
