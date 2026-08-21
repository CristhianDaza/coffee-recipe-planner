# Coffee Recipe Planner

Aplicación estática creada con Next.js para calcular y guiar recetas de café.

## Desarrollo local

Requiere Node.js 20.9 o superior.

```bash
npm install
npm run dev
```

Abre `http://localhost:3000` en el navegador.

## Publicar en cPanel

1. En tu computador, ejecuta `npm run build`.
2. Se creará la carpeta `out` con el sitio listo para publicar.
3. En el Administrador de archivos de cPanel, entra a `public_html` (o a la carpeta asignada al dominio).
4. Sube **el contenido** de `out` —no la carpeta `out` completa— y extrae los archivos si los comprimes.

No necesitas instalar Node.js, Cloudflare, Codex ni una base de datos en el hosting: el sitio funciona como archivos estáticos HTML, CSS y JavaScript.
