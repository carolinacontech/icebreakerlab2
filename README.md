# Icebreakerlab

Repositorio de desarrollo del sitio web de Icebreakerlab (Next.js 16 / React 19).

## Estructura de trabajo
- **`main`**: rama reservada para la versión aprobada.
- **`develop`**: código completo de la web original importado de `carolinacontech/icebreakerlab` y documentación para el rediseño del hero.
- **Pull request en borrador**: revisión antes de incorporar cualquier cambio en `main`.

## Ejecutar localmente
```bash
npm install
npm run dev
```
Abre http://localhost:3000.

## Próxima iteración — hero 3D
Se implementará el concepto híbrido (iceberg + tarjetas reales de portfolio) y la integración del modelo GLB proporcionado, después de optimizarlo. El código del hero generado previamente en ZIP **todavía no está importado en esta rama**.

Consulta [HERO-REDESIGN.md](HERO-REDESIGN.md) y [ICEBERG-3D.md](ICEBERG-3D.md).

## Política de cambios
No publicar cambios en `main` hasta comprobar compilación, responsive, accesibilidad, tamaño de assets y comportamiento de WebGL.
