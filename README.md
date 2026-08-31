# ChapiTag NFC

App web para chapitas/tarjetas NFC de mascotas perdidas. Cuando alguien
encuentra a la mascota, acerca el celular a la tarjeta (sin instalar nada) y
se abre un perfil público con el nombre de la mascota, datos médicos y los
contactos del dueño para avisarle al instante.

Incluye:

- **Perfil público** (`/p/[codigo]`): lo que se abre al escanear la tarjeta.
  Es totalmente personalizable: tema de color/plantilla visual, galería de
  varias fotos, insignias de estado (vacunado, sociable, necesidades
  especiales, etc.), datos de veterinario y seguro, personalidad de la
  mascota y un contacto de emergencia alternativo.
- **Cuenta de dueños**: registro/login, alta de mascotas asociando el código
  de una tarjeta ya comprada, edición de datos y foto.
- **Panel de administración**: generar lotes de códigos únicos para tarjetas
  nuevas, ver el estado de cada una (sin usar / asignada / dada de baja) y
  dar de baja tarjetas perdidas o robadas.

## Cómo funciona el NFC (importante)

Una tarjeta NFC para este uso **no necesita programación especial ni una app
propia**: simplemente se graba en el chip la URL pública de la mascota (por
ejemplo `https://tudominio.com/p/K7M2P9XQ`). Cualquier celular moderno, al
acercarlo a la tarjeta, abre esa URL en el navegador automáticamente.

Flujo sugerido para operar el negocio:

1. Comprás tarjetas/chapitas NFC en blanco (chips NTAG213/215, muy baratos,
   se consiguen en Mercado Libre/AliExpress como stickers o tarjetas PVC).
2. Desde **Admin → Generar tarjetas** generás un lote de códigos únicos.
3. Con una app gratuita como **NFC Tools** (Android/iOS) grabás en cada
   tarjeta la URL `https://tudominio.com/p/<CODIGO>` (una por una, o en serie
   si tenés un grabador NFC de escritorio).
4. Le vendés/entregás la tarjeta ya grabada al dueño de la mascota, quien
   entra a su cuenta y la activa cargando el mismo código en
   **Registrar mascota**.

## Requisitos

- Node.js **22.5 o superior** (usa el módulo nativo `node:sqlite`, no hace
  falta instalar ninguna base de datos aparte).

## Puesta en marcha (desarrollo)

```bash
npm install
cp .env.example .env
# Editá .env y poné un JWT_SECRET propio (una cadena larga al azar).
# Podés generar uno con: openssl rand -hex 32

npm run seed   # crea el usuario administrador y una mascota de ejemplo
npm run dev
```

Abrí http://localhost:3000

Credenciales que crea `npm run seed` (cambiala apenas entres):

- **Admin**: `admin@chapitag.demo` / `Admin1234!` → http://localhost:3000/admin/ingresar
- **Dueño de ejemplo**: `demo@chapitag.demo` / `Demo1234!`
- **Perfil de ejemplo**: http://localhost:3000/p/demo

## Estructura del proyecto

```
src/
  app/
    page.tsx                 → landing page
    registro/, ingresar/      → alta e ingreso de dueños
    panel/                    → panel del dueño (protegido)
      mascotas/nueva/         → alta de mascota + código de tarjeta
      mascotas/[id]/          → edición de mascota
    p/[code]/                 → perfil público (lo que abre la tarjeta NFC)
    admin/                    → panel de administración (protegido)
      ingresar/                → login de admin (único endpoint público bajo /admin)
      (dashboard)/             → generación y listado de tarjetas
    api/uploads/[filename]/   → sirve las fotos subidas por los dueños
  lib/
    db.ts                     → conexión a SQLite (node:sqlite)
    schema.sql                → esquema de la base de datos
    auth.ts                   → sesiones (JWT en cookie httpOnly) y hashing
    repo/                     → funciones de acceso a datos (users, pets, tags, admins)
    upload.ts                 → guardado de fotos subidas
scripts/seed.mjs              → siembra inicial (admin + mascota de ejemplo)
```

## Base de datos

Usa SQLite a través del módulo nativo `node:sqlite` de Node (sin
dependencias binarias externas: nada que descargar ni compilar). El archivo
vive en `data/app.db` (configurable con `DB_PATH` en `.env`). El esquema se
aplica automáticamente al arrancar (`CREATE TABLE IF NOT EXISTS`), así que no
hace falta correr migraciones.

Para inspeccionar la base a mano podés usar la CLI `sqlite3` o cualquier
cliente de SQLite apuntando a `data/app.db`.

## Producción / despliegue

Este proyecto guarda datos en disco (la base SQLite y las fotos subidas en
`data/uploads/`), así que necesita un **servidor con disco persistente**:
un VPS, Docker, Railway, Render, Fly.io, etc. — con `npm run build` seguido
de `npm run start`.

**No es apto tal cual para Vercel u otras plataformas serverless**, porque
ahí el sistema de archivos es efímero entre invocaciones (perderías la base
y las fotos). Para desplegar en serverless habría que:

- Cambiar `src/lib/db.ts` por una base de datos administrada (Postgres en
  Neon/Supabase, Turso, etc.) — el resto del código (las funciones en
  `src/lib/repo/*`) quedaría prácticamente igual, solo cambia cómo se abre
  la conexión.
- Cambiar `src/lib/upload.ts` y `src/app/api/uploads/[filename]/route.ts`
  por un storage externo (Vercel Blob, S3, Cloudinary, etc.).

Antes de salir a producción:

- [ ] Generá un `JWT_SECRET` nuevo y secreto (no uses el de ejemplo).
- [ ] Corré `npm run seed` una sola vez y **cambiá la contraseña del admin**
      de ejemplo (por ahora no hay pantalla para cambiarla — se puede
      actualizar directo en la tabla `admin_users`, o simplemente creá un
      admin nuevo a mano y borrá el de ejemplo).
- [ ] Serví la app con HTTPS (necesario para que el navegador confíe en los
      links `tel:`/`wa.me` sin advertencias y para la seguridad de las
      cookies de sesión).
- [ ] Hacé backup periódico de `data/app.db` y `data/uploads/`.

## Ideas para seguir (no implementadas)

- Recuperación de contraseña / verificación de email.
- Botón en el perfil público para que quien encontró a la mascota marque
  "la vi acá" con ubicación aproximada.
- Historial de tarjetas por mascota (reemplazo si se pierde la chapita).
- Exportar un lote de tarjetas generadas como planilla/PDF con los códigos
  en QR, listo para mandar a imprenta.
- Notificación (email/WhatsApp) automática al dueño cuando se visita el
  perfil de su mascota.
