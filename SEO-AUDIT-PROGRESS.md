# SEO audit — progreso

Proyecto: **Icebreaker Lab** (agencia de sitios web para pymes)
Host auditado: `https://icebreakerlab.vercel.app`
Overlay: `verticals/03-local-service-business.md`
Herramienta: `seo-audit.mjs` · base de conocimiento `docs/01`–`docs/17`

## Línea base vs. estado actual

| | Antes | Ahora |
|---|---|---|
| SEO Score (tool) | 90/100 | **99/100** (4 páginas) |
| P1 | 0 | 0 |
| P2 | 3 | **0** |
| P3 | 5 | **1** |

## Arreglado y verificado en producción

| Hallazgo | Regla | Evidencia |
|---|---|---|
| Sin `rel=canonical` en las 3 páginas | `docs/01` | `curl` → canonical autorreferencial en `/`, `/services`, `/portfolio` |
| `robots.txt` sin postura sobre crawlers de IA | `docs/10` | `robots.txt` nombra agentes de recuperación y de entrenamiento |
| `/frost` en `Disallow` pero enlazado internamente | `docs/13` | ahora rastreable + `<meta robots>` = `noindex, follow` |
| Sitemap con `priority`/`changefreq` | `docs/06` | 0 ocurrencias en `sitemap.xml` |
| `lastmod` = fecha de build (poco creíble) | `docs/06` | fijado a fecha de contenido real |
| Home sin `<h1>` | `docs/04` | `<h1>` = "We break the ice." |
| `/portfolio` saltaba de h1 a h3 | `docs/04` | `<h2 class="sr-only">Projects</h2>` |
| Palabras del h1 pegadas ("Webreaktheice") | `docs/04` | `<h1>` legible para rastreadores |

**Causa raíz que bloqueaba todo:** `IcebergScene.tsx` (prototipo 3D) estaba
commiteado en `main` e importaba `three` / `@react-three/fiber`, ausentes del
`package.json` de esa rama. Compilaba en local porque `node_modules` las tenía
desde la rama `hero-3d`, pero Vercel instala desde cero y **el build fallaba**:
los deploys no salían y producción seguía sin los arreglos. Resuelto en
`c738b1b`; el prototipo sigue intacto en `hero-3d`.

## Segunda ronda (mejora de puntuación)

| Cambio | Regla | Evidencia en producción |
|---|---|---|
| `@graph` por página: `WebSite` + `WebPage` + `ProfessionalService` | `docs/08` | 5 tipos distintos en `/portfolio` |
| `BreadcrumbList` + migas **visibles** en `/services`, `/portfolio`, `/about` | `docs/08` | `aria-label="Breadcrumb"` presente |
| Nodos anidados sin `@type` (publisher, isPartOf, about) | `docs/08` | 0 nodos sin tipo en las 4 páginas |
| Nueva `/about` como hogar de la entidad, con respuestas citables y tabla de datos | `docs/10` | canonical propio, en sitemap, enlazada desde el navbar |

## Abierto

| Ítem | Severidad | Por qué sigue abierto |
|---|---|---|
| `http://` responde 308 en vez de 301 | P3 | Comportamiento de la plataforma (Vercel), no del código |
| `sameAs: []` vacío en el JSON-LD | GEO alto | Requiere URLs reales de perfiles (LinkedIn, Instagram, Google Business) |
| Sin `address` / `telephone` en el JSON-LD | V03 | NAP debe coincidir **carácter por carácter** con Google Business; inventarlo perjudica |
| 13 de 18 proyectos del portfolio son conceptos ficticios mezclados con clientes reales | `docs/14` | Decisión de producto: separar "Client work" de "Concepts" |
| Sin datos de campo (CrUX) | — | Requiere tráfico real; CWV puntuado por heurística |
