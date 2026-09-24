---
name: ChapiTag NFC
description: La chapita NFC que trae a tu mascota de vuelta. Grabado sobre anodizado.
colors:
  aluminio: "#edebe7"
  superficie: "#fbfaf8"
  hueco: "#e1ddd6"
  linea: "#d6d2cb"
  linea-fuerte: "#aaa399"
  grafito: "#1c1a17"
  grafito-2: "#4c4741"
  grafito-3: "#655f57"
  bronce-chapitag: "#6e4b2a"
  bronce-profundo: "#563a20"
  metal-grabado: "#f4efe8"
  bronce-lavado: "#eee4d8"
  naranja-perdida: "#ff5b14"
  naranja-perdida-hover: "#ff6f30"
  naranja-perdida-profundo: "#c93f00"
  naranja-perdida-lavado: "#fff0e7"
  tinta-alerta: "#15181c"
  verde-ok: "#13704a"
  verde-ok-lavado: "#e2f0e8"
  rojo-peligro: "#b8261c"
  rojo-peligro-lavado: "#fbebea"
  metal-aro: "#9d9f9f"
  metal-brillo: "#e2e1dd"
  verde-whatsapp: "#157a42"
  noche-aluminio: "#141210"
  noche-superficie: "#1c1a17"
  noche-tinta: "#efebe5"
  noche-bronce: "#86592f"
  noche-bronce-texto: "#d6ab7a"
  anod-azul: "#1b46c2"
  anod-rojo: "#b8261c"
  anod-dorado: "#d6a21e"
  anod-dorado-tinta: "#1d1606"
  anod-verde: "#13704a"
  anod-celeste: "#0b6d93"
  anod-violeta: "#5b2bb5"
  anod-rosa: "#b32a64"
  anod-negro: "#23262c"
typography:
  display:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "min(11.4cqw, 3.85rem)"
    fontWeight: 900
    lineHeight: 0.96
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 125"
  headline:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 3.4vw, 3rem)"
    fontWeight: 900
    lineHeight: 0.98
    letterSpacing: "-0.025em"
    fontVariation: "'wdth' 125"
  engraved-name:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "min(0.21 x disco, 0.7 x disco / (letras x 0.92))"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "0.04em"
    fontVariation: "'wdth' 125"
  title:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.025em"
    fontVariation: "'wdth' 112"
  body:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.625
  body-sm:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.12em"
    fontVariation: "'wdth' 112"
  tag-code:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontWeight: 700
    letterSpacing: "0.14em"
    fontFeature: "'tnum' 1"
    fontVariation: "'wdth' 118"
rounded:
  check: "7px"
  field: "12px"
  notice: "14px"
  card: "18px"
  plate: "22px"
  pill: "999px"
spacing:
  gutter: "16px"
  gutter-sm: "24px"
  section: "80px"
  section-lg: "112px"
  container: "80rem"
components:
  button-primary:
    backgroundColor: "{colors.bronce-chapitag}"
    textColor: "{colors.metal-grabado}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "0 1.35rem"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.bronce-profundo}"
  button-secondary:
    backgroundColor: "{colors.superficie}"
    textColor: "{colors.grafito}"
    rounded: "{rounded.pill}"
    padding: "0 1.35rem"
    height: "48px"
  button-secondary-hover:
    backgroundColor: "{colors.aluminio}"
  button-ghost:
    textColor: "{colors.grafito}"
    rounded: "{rounded.pill}"
    padding: "0 1.35rem"
    height: "48px"
  button-ghost-hover:
    backgroundColor: "{colors.hueco}"
  button-alert:
    backgroundColor: "{colors.naranja-perdida}"
    textColor: "{colors.tinta-alerta}"
    rounded: "{rounded.pill}"
    padding: "0 1.35rem"
    height: "48px"
  button-alert-hover:
    backgroundColor: "{colors.naranja-perdida-hover}"
  button-danger:
    backgroundColor: "{colors.superficie}"
    textColor: "{colors.rojo-peligro}"
    rounded: "{rounded.pill}"
    padding: "0 1.35rem"
    height: "48px"
  button-danger-hover:
    backgroundColor: "{colors.rojo-peligro-lavado}"
  button-whatsapp:
    backgroundColor: "{colors.verde-whatsapp}"
    textColor: "#f1f7f3"
    rounded: "{rounded.pill}"
    padding: "0 1.35rem"
    height: "48px"
  button-sm:
    padding: "0 1rem"
    height: "40px"
  button-lg:
    padding: "0 1.75rem"
    height: "56px"
  field:
    backgroundColor: "{colors.superficie}"
    textColor: "{colors.grafito}"
    typography: "{typography.body}"
    rounded: "{rounded.field}"
    padding: "0.7rem 0.9rem"
    height: "48px"
  plate:
    backgroundColor: "{colors.superficie}"
    rounded: "{rounded.plate}"
    padding: "24px"
  notice-info:
    backgroundColor: "{colors.bronce-lavado}"
    textColor: "{colors.grafito}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.notice}"
    padding: "0.8rem 1rem"
  notice-ok:
    backgroundColor: "{colors.verde-ok-lavado}"
    textColor: "{colors.grafito}"
    rounded: "{rounded.notice}"
    padding: "0.8rem 1rem"
  notice-error:
    backgroundColor: "{colors.rojo-peligro-lavado}"
    textColor: "{colors.grafito}"
    rounded: "{rounded.notice}"
    padding: "0.8rem 1rem"
  status-chip-lost:
    backgroundColor: "{colors.naranja-perdida}"
    textColor: "{colors.tinta-alerta}"
    rounded: "{rounded.pill}"
    padding: "0 0.625rem"
    height: "28px"
  status-chip-home:
    backgroundColor: "{colors.verde-ok-lavado}"
    textColor: "{colors.verde-ok}"
    rounded: "{rounded.pill}"
    padding: "0 0.625rem"
    height: "28px"
  trait-chip:
    backgroundColor: "{colors.superficie}"
    textColor: "{colors.grafito}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.pill}"
    padding: "0 0.875rem"
    height: "40px"
---

# Design System: ChapiTag NFC

## Overview

**Creative North Star: "Grabado sobre anodizado"**

Cada mascota es una chapita. El sistema entero sale de un objeto real: un disco de aluminio anodizado, con agujero y aro partido, colgado de un exhibidor perforado, al que la fresa le saca el color para escribir el nombre. El color anodizado es la identidad de la mascota; el texto importante no se pinta, se graba. El fondo es aluminio champagne (un gris apenas tibio, no crema), la tinta es grafito tibio, la marca es un bronce anodizado, y el único color que grita es el naranja del modo perdido.

La densidad es de ficha, no de revista: una sola familia tipográfica (Archivo, de Omnibus-Type, Buenos Aires) cambia de ancho en vez de cambiar de fuente. Expandida y negra para lo grabado y los titulares, normal para leer, mayúsculas espaciadas y tabulares para los códigos. El tamaño marca la jerarquía, el color marca el estado. La profundidad es la del objeto (la chapita cuelga, proyecta sombra, se da vuelta); las superficies de interfaz son planas.

El movimiento es el de algo que cuelga: cae al gancho, se mece con la brisa, se hamaca al pasarle por encima, se da vuelta para mostrar el dorso con la bobina NFC. La fresa recorre el nombre de izquierda a derecha. Un perro y un gato planos, de dos tonos y con su chapita en el collar, mueven la cola, parpadean y ladean la cabeza cuando oyen un nombre nuevo. Todo eso se apaga bajo `prefers-reduced-motion`. Se rechaza la landing de mascotas de siempre (pasteles, huellitas, blobs) y su opuesto tech oscuro con neón.

**Key Characteristics:**
- Campos planos de anodizado a escala de región, uno por mascota (8 colores fijos).
- Texto grabado: metal claro con filo oscuro de 1px arriba; relleno de tinta oscura sobre anodizados claros (dorado).
- Una sola familia, Archivo variable, con el eje de ancho como herramienta de jerarquía.
- Naranja de alerta reservado por ley al estado "perdida".
- Silueta de chapita (disco, hueso, gato; siempre con agujero y aro), exhibidor perforado y animales planos de dos tonos con collar y chapita como únicos recursos decorativos; nunca huellitas.
- Íconos lucide de trazo único; las marcas que lucide no trae (Instagram) van con un glifo propio del mismo trazo; nunca emoji.
- Perfil público, afiche y hoja de QR siempre en esquema claro.

## Colors

Aluminio champagne y grafito tibio como base; un bronce anodizado como voz de marca; ocho anodizados como identidad de cada mascota; un naranja que solo significa "perdida".

### Primary
- **Bronce ChapiTag** (bronce-chapitag): el anodizado de marca. Botón primario fuera de un contexto de mascota, casilla marcada, foco, cursor, selección de texto, enlaces, borde de campo enfocado, el mail transaccional, y el fallback de `--anod` en todo campo anodizado sin tema. En oscuro el campo sube a noche-bronce y el texto-enlace y el foco pasan a noche-bronce-texto para mantener contraste.
- **Bronce profundo** (bronce-profundo): hover del primario; el "deep" del anodizado de marca.
- **Metal grabado** (metal-grabado): la tinta del grabado sobre el bronce: texto de botón primario, tilde de la casilla, texto de campos anodizados sin tema. Pasa AA sobre el bronce en claro y en oscuro.
- **Bronce lavado** (bronce-lavado): fondo de los avisos informativos.

El azul #1b46c2 ya no es de marca: sobrevive solo como el anodizado "Azul" del catálogo de mascotas.

### Secondary: anodizados por mascota
Ocho pares `color / deep / ink` definidos en `src/lib/themes.ts` y aplicados con variables `--anod`, `--anod-deep`, `--anod-ink` sobre el contenedor. El dueño elige uno; tiñe el campo superior del perfil, la chapita dibujada y el botón primario de ese contexto.
- **Azul** (anod-azul), **Rojo** (anod-rojo), **Verde** (anod-verde), **Celeste** (anod-celeste), **Violeta** (anod-violeta), **Rosa** (anod-rosa), **Negro** (anod-negro): grabado claro (metal a la vista).
- **Dorado** (anod-dorado): el único anodizado claro; su grabado va relleno de tinta oscura (anod-dorado-tinta) y marca `data-engrave="dark"`. Es el anodizado que acompaña a la marca bronce: chapita por defecto del hero de la landing, del perfil de ejemplo y de las pantallas de ingreso.

### Tertiary: estado
- **Naranja perdida** (naranja-perdida): franja de alerta del modo perdido, chip "Perdida", botón que activa el modo perdido, cabecera del afiche "Se busca". Siempre con tinta-alerta (grafito frío, fijo en claro y oscuro) encima, nunca blanco. Hover del botón a naranja-perdida-hover.
- **Naranja profundo / lavado** (naranja-perdida-profundo, naranja-perdida-lavado): borde de 2px y fondo de la recompensa y del formulario de modo perdido.
- **Verde ok** y **rojo peligro** (verde-ok, rojo-peligro, y sus lavados): avisos de éxito/error, chip "En casa", botón destructivo con contorno.
- **Verde WhatsApp** (verde-whatsapp): exclusivo del botón de WhatsApp.

### Neutral
- **Aluminio champagne** (aluminio): fondo de página y del mail; también el `theme-color` del navegador. Un gris tibio de metal, no un crema.
- **Superficie** (superficie): placas, campos, tarjetas.
- **Hueco** (hueco): fondo del exhibidor perforado y del hover fantasma.
- **Línea / línea fuerte** (linea, linea-fuerte): divisores y bordes de placa; bordes de campo y botón secundario.
- **Grafito 1-3** (grafito, grafito-2, grafito-3): texto principal, secundario (bajadas), terciario (placeholders, pistas); grafito tibio, del mismo tono que el aluminio. También dibuja a los animales.
- **Metal aro / brillo** (metal-aro, metal-brillo): el aro partido, el gancho del exhibidor y la hebilla del collar.
- **Noche** (noche-aluminio, noche-superficie, noche-tinta, noche-bronce, noche-bronce-texto): el esquema oscuro del panel, landing y auth, en la misma familia tibia; los anodizados de mascota no cambian.

### Named Rules
**The Perdida Rule.** El naranja #ff5b14 existe solo para el estado "perdida" y lo que lo anuncia (franja, chip, botón que lo activa, afiche, la sección de la landing que lo explica). Ningún CTA, ícono, gráfico ni acento usa naranja por otro motivo.

**The Anodized Identity Rule.** El color de la mascota es su identidad: se aplica en campos planos a escala de región (cabecera del perfil, chapita, primario del contexto), nunca como acento suelto ni en degradé.

**The Always-Light Rule.** El perfil público, el afiche "Se busca", la hoja de QR para imprenta y el mail de ejemplo se renderizan con `.scheme-light`, aunque el dispositivo esté en oscuro: se leen al sol o en papel.

## Typography

**Display Font:** Archivo variable, eje `wdth` al 125% (con ui-sans-serif, system-ui)
**Body Font:** Archivo al 100%
**Label/Mono Font:** Archivo al 112% (etiquetas) y 118% tabular (códigos); no hay monoespaciada

**Character:** Una sola familia argentina que se estira. Expandida y en negra parece letra de estampa o de grabado; al ancho normal es una grotesca de lectura tranquila.

### Hierarchy
- **Display** (900, min(11.4cqw, 3.85rem), 0.96, expandida): titular del hero; se dimensiona por container query para que la palabra más larga entre justa.
- **Headline** (900, clamp(2rem, 3.4vw, 3rem), 0.98, expandida, tracking ajustado): titulares de sección. En el panel, el nombre de la mascota va en 2.5-3.25rem y mayúsculas.
- **Engraved name** (800, calculado por largo del nombre, expandida, mayúsculas, 0.04em): nombre grabado sobre la chapita y el perfil; el tamaño lo resuelve `engravedNameSize` para que entre en el disco.
- **Title** (700, 1.25rem, semiexpandida): títulos de paso y de tarjeta.
- **Body** (400-500, 1.0625rem, 1.625): bajadas y texto corrido, en grafito-2, a 28-36rem de ancho.
- **Body small** (0.9375rem): navegación, avisos, pistas de formulario.
- **Label** (700, 0.8125rem, 0.12em, mayúsculas, semiexpandida): encabezado de bloque de datos en el perfil ("Cómo es", "Salud"), en grafito-2. Es el encabezado del bloque, no una etiqueta encima de otro titular.
- **Tag code** (700, 118%, 0.14em, tabular, mayúsculas): códigos de chapita en campos, dorso y admin.

### Named Rules
**The One Family Rule.** Todo es Archivo. La jerarquía se hace con ancho (88 / 100 / 112 / 118 / 125%), peso y tamaño; nunca se suma una segunda familia ni una monoespaciada.

**The Engraved Width Rule.** Lo que va grabado sobre anodizado usa el ancho expandido (125%) en 800-900. El ancho normal es para leer.

## Layout

Contenedor de 80rem (`max-w-7xl`) con márgenes de 16px en mobile y 24px desde `sm`. Grilla de 12 columnas en `lg`: el hero parte 5/12 texto y 7/12 exhibidor a sangre hasta el borde derecho (el texto se alinea con el contenedor calculando el margen del viewport). Las secciones de la landing respiran 80px arriba y abajo en mobile y 96-112px en `lg`, separadas por una línea de 1px, alternando aluminio, superficie, franja naranja y exhibidor perforado como fondo de sección.

El perfil público es de una columna para celular, con el campo anodizado a todo el ancho arriba, los contactos en una barra fija abajo al alcance del pulgar y objetivos táctiles de 48px o más. El panel y el admin son de filas de unidades idénticas; el admin es denso. En mobile el hero pone la chapita arriba y titular y acciones debajo.

Las piezas colgadas se ubican en pares de gancho + chapita; el texto de cada pieza queda afuera del exhibidor, sobre fondo liso.

## Elevation & Depth

Híbrido: la interfaz es plana (placas con un borde de 1px y una sombra casi imperceptible), y la profundidad real la tienen los objetos que cuelgan. La chapita proyecta sombra proporcional a su tamaño, el gancho una sombra corta, el mail de ejemplo flota sobre la franja naranja. El material del anodizado sale del color, con un cepillado horizontal casi invisible (líneas blancas al 2.8% cada 3px), no de brillos ni reflejos.

### Shadow Vocabulary
- **Placa** (`box-shadow: 0 1px 2px rgb(28 26 23 / 0.06), 0 8px 24px -12px rgb(28 26 23 / 0.18)`): tarjetas y paneles de interfaz. En oscuro, mismo dibujo al 0.4 / 0.6 de negro.
- **Chapita** (`filter: drop-shadow(0 max(2px, 10·escala) max(3px, 12·escala) rgb(21 24 28 / .32))`): la silueta colgada.
- **Filo del grabado** (`text-shadow: 0 -1px 0 rgb(0 0 0 / 0.32), 0 1px 0 rgb(255 255 255 / 0.12)`): texto grabado claro; en `data-engrave="dark"` se invierte a `0 1px 0 rgb(255 255 255 / 0.35), 0 -1px 0 rgb(0 0 0 / 0.1)`.
- **Presionado** (`box-shadow: inset 0 2px 3px rgb(0 0 0 / 0.28)`): solo el primario al hacer clic, junto a 1px de descenso.

### Named Rules
**The Object-Has-Depth Rule.** Solo las cosas que cuelgan (chapita, gancho, aro) tienen volumen. Botones, campos y placas son planos; no llevan bisel ni brillo.

## Shapes

Redondeo generoso y constante: 22px en placas y tramos de exhibidor, 18px en tarjetas internas (bloques de salud, avisos de cuidado, recompensa), 14px en avisos, 12px en campos, 7px en la casilla, y píldora completa en botones, chips y discos de ícono. La silueta decorativa es siempre una chapita dibujada en un viewBox de 200×250: disco, hueso o cabeza de gato, todas con el agujero en el mismo punto y el aro partido detrás, para colgar igual del gancho. El exhibidor perforado es una trama de agujeros cada 30px. Los animales (perro, gato) son siluetas planas de dos tonos: cuerpo en grafito y detalles (ojos, brillo, patas) en el color del fondo, con el collar y la chapita anodizada como único color; el collar suelto cuelga de un gancho como una pieza más. No hay otras formas decorativas.

## Components

### Buttons
Campos anodizados planos, en píldora.
- **Shape:** píldora (999px), alto 48px (40 en `sm`, 56 en `lg`), peso 650, borde transparente de 1.5px. El ícono de un botón nunca se achica, aunque el botón quede angosto.
- **Primary:** el anodizado del contexto (`--anod`, por defecto bronce ChapiTag) con tinta de grabado. Hover al tono profundo; al presionar, sombra interior y 1px abajo.
- **Secondary:** superficie con borde línea-fuerte; hover oscurece el borde a grafito-2 y el fondo a aluminio.
- **Ghost:** transparente; hover a hueco.
- **Alert:** naranja perdida con tinta-alerta; hover a naranja-perdida-hover; solo para activar el modo perdido.
- **Danger:** superficie con texto y borde rojo al 45%; hover a rojo lavado.
- **WhatsApp:** verde propio, solo para ese canal.
- **Instagram:** secundario grande a todo el ancho en la barra de contacto del perfil, con el glifo propio de Instagram (trazo 2 redondeado, como lucide) y el @usuario truncado. Sin color de marca de Instagram.
- **Focus:** contorno de 3px en el color de foco, separado 3px.

### Chips
- **Estado:** "Perdida" en franja naranja, mayúsculas y megáfono; "En casa" en verde lavado con casa. 28px de alto, píldora.
- **Rasgos del perfil:** píldora de 40px, superficie con borde línea-fuerte, ícono lucide de 18px.

### Cards / Containers
- **Corner Style:** 22px (placa), 18px (tarjeta interna).
- **Background:** superficie sobre aluminio.
- **Shadow Strategy:** sombra de placa (ver Elevation & Depth); las tarjetas internas usan solo borde.
- **Border:** 1px línea; 2px naranja cuando la mascota está perdida; 1.5px grafito interior para avisos de cuidado.
- **Internal Padding:** 24px, 40px en `sm` para placas de acción.

### Inputs / Fields
- **Style:** superficie, borde 1.5px línea-fuerte, radio 12px, 48px de alto, texto 1rem. Hover oscurece el borde a grafito-3.
- **Focus:** borde bronce y halo de 3px del bronce al 22%.
- **Error / Disabled:** borde rojo peligro con `:user-invalid`; los botones deshabilitados bajan a 55% de opacidad.
- **Select:** flecha lucide inline; archivo con botón en píldora.
- **Casilla:** 22px, radio 7px, se llena de bronce con tilde en tinta de grabado.

### Navigation
Cabecera plana sobre aluminio con línea inferior: marca a la izquierda, enlaces de texto en grafito-2 a 0.9375rem semibold (44px de alto, hover a grafito), selector de tema, y el primario "Activar chapita" en `sm`. En mobile quedan "Ingresar", el selector y la marca.

### Chapita (componente firma)
El disco anodizado con aro partido de dos vueltas en metal, canto oscuro, anillo interior sutil en la redonda y agujero con borde. Lleva encima una capa HTML con el contenido grabado: nombre (`EngravedName`), ícono lucide grabado (`EngravedIcon`, trazo 2.1 con el mismo filo), o dorso con bobina NFC (`NfcCoil`) y código. Cuelga de un gancho metálico y gira sobre el borde superior del aro.

### Animales y objetos
Perro y gato planos de dos tonos (grafito con detalles en el color del fondo, hocico y orejas mezclados entre ambos), sentados, con collar y una chapita anodizada colgando que toma el tema que se le pase. El collar suelto cuelga de un gancho con hebilla metálica y su chapita. Se asoman desde abajo en el hero y acompañan la landing, el panel y el 404. Las chapitas dibujadas usan tres siluetas: disco, hueso y cabeza de gato. Nunca huellitas.

### Motion
- **Péndulo** (`swing`, 1.5s lineal, amortiguado 7° a 0°): al hover (solo punteros finos) o al cambiar de color.
- **Caer al gancho** (`hang-in`, 0.9s, ease-out 0.23/1/0.32/1, escalonado 70-90ms): entrada de piezas colgadas al verse.
- **Brisa** (`sway`, ±1.2°, 5-7s, desfasada por pieza): lo que cuelga del exhibidor.
- **Grabado** (`engrave`, 0.55s en 14 pasos, con punto láser): revelado del nombre de izquierda a derecha.
- **Giro** (0.7s, ease-in-out 0.77/0/0.175/1): frente/dorso; en el dorso salen ondas NFC.
- **Colgar al verse** (`hang-on-view`, 0.9s, escalonado 90ms): la caída al gancho disparada al entrar en pantalla.
- **Asomarse** (`peek-up`, 0.8s ease-out, con demora): los animales suben desde el borde en el hero.
- **Animales**: cola (perro 3.2s, gato 5.5s), parpadeo (4.6s y 7s), oreja que se sacude (6.5s), cabeza ladeada al grabar un nombre nuevo (1.3s), chapita del collar que se hamaca (±7°, 2.4s). Loops lentos y desfasados.
- **Ondas NFC** (1.8s, escalonadas 0.6s): salen de la bobina cuando la chapita muestra el dorso.
- **Interfaz**: transiciones de 140ms; aparición de 0.28s con 4px.
- **Reducido:** bajo `prefers-reduced-motion` todas las animaciones se apagan (incluidos animales, brisa, asomarse y ondas NFC), lo que espera caer se muestra directo, el láser se oculta, el giro pasa a cambio directo y el botón no se hunde.

## Do's and Don'ts

### Do:
- **Do** grabar el texto importante sobre anodizado: tinta metal-grabado con filo oscuro de 1px arriba, y relleno oscuro con `data-engrave="dark"` sobre el dorado.
- **Do** usar el anodizado de la mascota como campo plano a escala de región (cabecera del perfil, chapita, primario), a través de `--anod`, `--anod-deep`, `--anod-ink`.
- **Do** hacer la jerarquía con Archivo: expandida 125% en 800-900 para lo grabado y titulares, 100% para leer, 118% tabular espaciado para códigos.
- **Do** usar íconos lucide de trazo único, a 18-24px, heredando color; para una marca que lucide no trae, dibujar un glifo SVG propio con el mismo trazo.
- **Do** colgar las piezas decorativas de un gancho con la silueta de chapita, con su aro y su agujero.
- **Do** renderizar perfil público, afiche y hoja de QR con `.scheme-light`.
- **Do** dar a cada animación una alternativa quieta dentro del bloque `prefers-reduced-motion`.

### Don't:
- **Don't** usar el naranja #ff5b14 para nada que no sea el estado "perdida".
- **Don't** agregar bisel, brillo ni degradé a botones, campos o placas; son campos planos.
- **Don't** usar texto con degradé, blobs ni motivo de huellitas.
- **Don't** usar emoji como ícono ni como decoración.
- **Don't** sumar una segunda familia tipográfica ni una monoespaciada.
- **Don't** poner texto blanco sobre el naranja de alerta; va en grafito.
- **Don't** inventar anodizados fuera de los ocho del catálogo.
- **Don't** usar el azul #1b46c2 como color de marca; es solo el anodizado "Azul" de una mascota.
