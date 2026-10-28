# Comodidad Diaria

Guía web para distribuidores independientes de productos E-Energy by Nipponflex. Incluye catálogo, asistente de mensajes para WhatsApp, test "¿Cuál es para mí?" y una lista de clientes que se guarda en el propio dispositivo.

Sitio en producción: https://comodidad-diaria-n3vw.onrender.com/

## Cómo está hecho

Es un **sitio estático**: solo HTML, CSS y JavaScript, sin dependencias, sin servidor y sin base de datos.

| Archivo | Para qué sirve |
| --- | --- |
| `index.html` | Página principal |
| `app.js` | Lógica: catálogo, asistente, quiz, lista de clientes |
| `styles.css` | Estilos |
| `404.html` / `500.html` / `error.css` | Páginas de error |
| `privacidad.html` | Aviso de privacidad y términos de uso |
| `sw.js`, `site.webmanifest` | App instalable y uso sin conexión |
| `render.yaml` | Configuración de Render (sitio estático y encabezados de seguridad) |

## Correr en tu computadora

No hay nada que instalar. Sirve la carpeta con cualquier servidor estático, por ejemplo:

```bash
python -m http.server 8000
```

y abre http://localhost:8000. (Abrir `index.html` con doble clic también funciona, pero sin service worker.)

## Configuración

- **Número de WhatsApp:** en `app.js`, cambia `const WHATSAPP = ""` por tu número con código de país, sin `+` ni espacios (ejemplo México: `5215512345678`).
- **Secretos:** el sitio no necesita llaves. Si usas la API de Render desde tu computadora, copia `.env.example` a `.env` y pon ahí `RENDER_API_KEY`. `.env` está en `.gitignore` y nunca debe subirse.

## Despliegue en Render

Cada `push` a `main` se publica automáticamente en Render. La configuración vive en `render.yaml`. Si hay que crear el servicio desde cero: en Render, **New → Blueprint** y elige este repositorio.

## Seguridad y calidad

- **Secretos:** ninguna llave en el código; `.env` ignorado por git.
- **XSS:** todo el HTML dinámico pasa por la plantilla `html``...``, que escapa cada valor. No hay scripts ni estilos en línea, y una **Content Security Policy** estricta solo permite recursos propios y Google Fonts.
- **Encabezados:** HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy` y `Permissions-Policy` (en `render.yaml`). Render sirve todo por HTTPS.
- **Validación y límites:** nombre ≤ 60, teléfono de 8 a 15 dígitos, notas ≤ 200, dudas ≤ 200 caracteres y máximo 1000 clientes. Los datos guardados se vuelven a validar al cargar. El CSV exportado está protegido contra inyección de fórmulas.
- **Errores:** página 404 propia, página 500 sin detalles técnicos y aviso amable si ocurre un error en el navegador o no se puede guardar.

**No aplican** porque no hay servidor ni base de datos: validación en servidor, inyección SQL, autenticación y permisos, rate limiting, CORS, `npm audit` (no hay dependencias), logs de servidor y respaldos de base de datos. Si en el futuro se agrega un backend (por ejemplo, para guardar clientes en la nube), habrá que implementarlos todos.

**Respaldo de datos:** la lista de clientes vive solo en el navegador de cada persona. Usa **Descargar lista (CSV)** para respaldarla.
