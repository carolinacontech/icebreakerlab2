# Routes inventory — Icebreaker Lab

Proyecto: agencia que construye sitios web para pymes.
Overlay de industria aplicado: `verticals/03-local-service-business.md`
(negocio de servicio con área de cobertura, no e-commerce ni SaaS).

Host canónico: `https://icebreakerlab.vercel.app`
(`icebreakerlab.com` **no pertenece al proyecto** — está a la venta en un
registrador. No debe usarse en canonical, og:url ni JSON-LD.)

| Ruta | Clase | Motivo |
|---|---|---|
| `/` | `public-index` | Home comercial |
| `/services` | `public-index` | Servicios y paquetes |
| `/portfolio` | `public-index` | Casos de trabajo |
| `/frost` | `public-noindex` | Cuestionario de intake: es un paso del embudo, no contenido para buscar. Ya está en `Disallow` |
| `/api/contact` | `private` | Endpoint POST |
| `/api/send` | `private` | Endpoint POST |

3 rutas `public-index` → son las que entran en el SEO Score.
