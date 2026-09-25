import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Archivos que se leen en tiempo de ejecución con fs y el bundler no ve:
  // el schema de la base (src/lib/db.ts) y la foto de la mascota de ejemplo
  // (la vista previa al compartir la lee para armar la imagen). En serverless
  // la carpeta public/ no viaja con las funciones.
  outputFileTracingIncludes: {
    "/**": ["./src/lib/schema.sql", "./public/demo/**/*"],
  },
};

export default nextConfig;
