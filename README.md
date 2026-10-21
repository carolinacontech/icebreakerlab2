# Icebreakerlab — 3D hero redesign

Sitio Next.js 16 / React 19. Diseño del hero híbrido con iceberg tridimensional, previews de NODO Academy y Market Open Media, y animaciones con Framer Motion.

## Ramas

- `main`: versión principal sin modificaciones de la nueva web.
- `develop`: versión original importada del repositorio anterior, además del hero 3D y su código.
- Pull Request #1 (borrador): https://github.com/carolinacontech/icebreakerlab2/pull/1

## Desarrollo local

```bash
npm install
npm run dev
```

Visita http://localhost:3000. El diseño y las tarjetas flotantes se cargan aun sin el archivo GLB; en ese caso se muestra una ilustración de respaldo.

## Modelo GLB necesario

El componente `src/components/IcebergGLB.tsx` descarga **`public/models/iceberg-web.glb`**. El archivo real optimizado pesa 16,65 MB y está incluido en el ZIP completo entregado en ChatGPT. **Este binario aún NO se ha subido a GitHub** porque el conector de escritura no permite transferir directamente el archivo local. Debe incorporarse a `public/models/` en la rama `develop` (por ejemplo mediante GitHub Upload files). Consulta [public/models/README.md](public/models/README.md).

El script para reproducir la compresión a partir del GLB original está en `scripts/optimize-iceberg.py`.

## Verificaciones

GitHub Actions ejecuta `npm ci`, `npx tsc --noEmit` y `npm run build`. Antes de fusionar con `main`, comprobar el modelo en navegador, métricas de carga, móviles y accesibilidad.
