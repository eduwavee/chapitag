# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Dueños de mascotas en Argentina** (perros y gatos, sobre todo). Compran una chapita/tarjeta NFC, crean una cuenta y arman el perfil de su mascota: fotos, datos médicos, contactos. Vuelven al panel cuando cambian un dato, cuando la mascota se pierde (momento de pánico) y cuando alguien escanea la chapita.
- **Quien encuentra a la mascota**: cualquier persona, en la calle, con su celular, sin app ni cuenta. Acerca el teléfono a la chapita (o escanea el QR) y tiene que entender en segundos de quién es el animal y cómo avisarle al dueño. Suele estar sosteniendo al animal con una mano, afuera, con luz de día y datos móviles.
- **Operador de ChapiTag (admin)**: el negocio. Genera lotes de códigos, graba la URL en cada chip con NFC Tools, los manda a imprenta/grabado y da de baja tarjetas perdidas o robadas.

## Product Purpose

Que una mascota perdida vuelva a casa rápido. La chapita NFC abre un perfil público actualizado con el nombre, fotos, datos médicos y los contactos del dueño, sin que quien la encuentra tenga que instalar nada. Éxito = el que la encuentra contacta al dueño en el primer minuto, y el dueño se entera en el momento en que alguien escanea la chapita.

## Positioning

La chapita no tiene datos grabados: guarda un link a un perfil vivo que el dueño edita cuando quiere. A diferencia de una chapita grabada con un teléfono, la información se actualiza, puede tener varios contactos, datos médicos y fotos, y puede pasar a "modo perdido". A diferencia de un rastreador GPS, no necesita batería, carga ni suscripción de datos: funciona con cualquier celular moderno por NFC (y QR de respaldo).

## Operating Context

- El chip es NTAG213/215 con la URL `https://<dominio>/p/<CÓDIGO>` grabada. Código de 8 caracteres sin ambiguos (sin 0/O, 1/I/L), impreso en la chapita para activarla a mano.
- Flujo comercial: el operador genera un lote → graba cada chip con NFC Tools → entrega/vende la chapita → el dueño la activa cargando el código (o escaneándola) en su cuenta.
- Contacto del que encuentra: llamada telefónica y WhatsApp (canal dominante en Argentina).
- Avisos al dueño por email vía Resend cuando se escanea la chapita.

## Capabilities and Constraints

- Next.js 16 (App Router, Server Actions) + React 19 + Tailwind v4. SQLite vía libSQL: en la compu, archivo y fotos en disco (`data/`); publicada en Vercel, la base en Turso y las fotos en un store privado de Vercel Blob.
- Roles: dueño (OWNER) y administrador (ADMIN), sesión JWT en cookie httpOnly.
- Perfil público personalizable: tema de color, galería de hasta 5 fotos, insignias de estado, veterinario, seguro, personalidad, contacto alternativo, recompensa, ubicación (ciudad o dirección exacta, a elección del dueño).
- En construcción: modo perdido, registro de escaneos con ubicación opcional del que encuentra, avisos por email (Resend), gestión de cuenta (datos, contraseña, recuperación), borrar mascota, reemplazar chapita, activar chapita al escanearla, QR por mascota, afiche "Se busca" imprimible, vista previa al compartir, herramientas de admin para imprenta (búsqueda, filtros, CSV, hoja de QR).
- Sin decidir: precio de la chapita, canal de venta (tienda propia, Mercado Libre, veterinarias), dominio definitivo.

## Brand Commitments

- Nombre: **ChapiTag NFC** ("ChapiTag" como marca corta).
- Voz: español rioplatense con voseo ("acercá", "registrá", "ingresá"), cercano y claro; en el perfil público, directo y urgente sin dramatismo.

## Evidence on Hand

- Mascota de ejemplo "Firulais" (código `DEMO`, generada por `npm run seed`) — es demo, no un caso real.
- No hay testimonios, clientes, cantidad de mascotas recuperadas, precios, notas de prensa ni fotos reales del producto físico. No inventarlos: cualquier material ilustrativo se marca como ejemplo.

## Product Principles

1. **El que encuentra primero.** En el perfil público, en 3 segundos se entiende qué pasa y qué hacer; llamar/WhatsApp siempre al alcance del pulgar.
2. **El dueño decide qué es público.** Privacidad por defecto (ciudad en vez de dirección, perfil fuera de buscadores); nada sensible se muestra sin que el dueño lo elija.
3. **Sin apps, sin fricción.** Todo funciona en el navegador de cualquier celular, con mala conexión y sin registrarse.
4. **Información viva.** El perfil muestra que está actualizado y el dueño se entera de cada escaneo.

## Accessibility & Inclusion

- WCAG 2.2 AA como mínimo. El perfil público se usa al aire libre, con sol, por personas de cualquier edad: contraste alto, texto grande, objetivos táctiles ≥ 48px, sin depender del color para comunicar estado.
- Respetar `prefers-reduced-motion`.
