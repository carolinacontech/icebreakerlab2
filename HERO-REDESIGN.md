# Hero híbrido — Icebreakerlab

## Diseño implementado

El nuevo `HybridHero` sustituye el scroll-video en la página principal. A la izquierda hay tipografía editorial, una breve promesa de valor y CTAs a contacto y portafolio. A la derecha se presenta el iceberg GLB junto a dos browser cards reales (NODO Academy y Market Open Media) y una tarjeta de SEO/performance.

### Copy

**We build websites that break the ice.**

Beautiful on the surface. Strategic underneath. Websites built to get your business found, remembered, and chosen.

CTAs: **Start a project** / **Explore our work**.

## Movimiento

Flotación ambiental, parallax de cursor y una transición sutil durante el scroll. En móvil y cuando hay preferencia de movimiento reducido se muestra el fallback sin descargar el GLB.

## Estado

Código del hero implementado en `develop`; dependiente de publicar el archivo GLB optimizado. La compilación TypeScript/Next.js de la rama pasó GitHub Actions. Ver detalles en [ICEBERG-3D.md](ICEBERG-3D.md).
