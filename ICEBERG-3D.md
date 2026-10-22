# Icebreakerlab — Optimización e integración del GLB real

## Modelo

El modelo proporcionado por el propietario contiene unas 500.000 caras y tres texturas grandes. Se optimizaron las texturas de 4096 px a JPEG de 1536/1024 px, conservando la geometría y las coordenadas UV originales. El tamaño cayó de 51,87 a 16,65 MB (una reducción aproximada del 68%).

## Implementación

- `src/components/HybridHero.tsx`: nuevo hero, CTAs y previews flotantes reales del portfolio.
- `src/components/IcebergGLB.tsx`: carga binaria del modelo y renderizado con WebGL2, textura de color y mapa normal.
- `src/components/hybrid-hero.css`: escena responsive con profundidad y estados hover.
- `scripts/optimize-iceberg.py`: recompresión reproducible del archivo GLB original.

El hero usa efectos de rotación con el cursor y scroll. La carga GLB se deshabilita para móviles (760 px o menos), preferencias de movimiento reducido y navegadores incompatibles con WebGL2; se muestra un iceberg de respaldo.

## Estado exacto

El código del hero está **publicado y compilado** en `develop`. El GLB optimizado se encuentra dentro del ZIP completo entregado por ChatGPT, pero **todavía no está publicado en `public/models/iceberg-web.glb` de GitHub**. No fusionar a `main` hasta subirlo y comprobar la escena visualmente.
