# Coffee Recipe Planner · Sistema visual

## Dirección

Herramienta de preparación de café con una estética editorial cálida: fondos de papel,
superficies claras, acentos terracota y títulos serif. La interfaz prioriza elegir un
método, ajustar variables y comenzar la preparación, en ese orden.

Se aplican los criterios de ui-ux-pro-max para jerarquía, contraste, interacción,
disposición adaptable y accesibilidad. Se adopta la estructura funcional minimalista
y la familia cromática cálida de sus búsquedas; los patrones de venta y tipografías
infantiles de las recomendaciones genéricas no corresponden a esta herramienta.

## Tokens

La fuente de verdad de los valores es `app/globals.css`.

| Rol | Claro | Oscuro |
| --- | --- | --- |
| Fondo (`--paper`) | #faf8f4 | #191917 |
| Superficie (`--surface`) | #ffffff | #21211e |
| Superficie secundaria (`--cream`) | #f0ebe2 | #252520 |
| Texto principal (`--ink`) | #302b25 | #f2ece2 |
| Texto secundario (`--muted`) | #71685e | #bcb4a7 |
| Acción y selección (`--coral`) | #a4482f | #efaa89 |
| Selección suave (`--accent-soft`) | #f6eae2 | #362b25 |

Texto secundario sobre la superficie secundaria: 4.60:1 en claro y 7.50:1 en oscuro.
Texto de los botones principales: 5.58:1 en claro y 9.04:1 en oscuro.
Los estados de selección incluyen bordes y atributos semánticos, además del color.

## Composición

- Contenedor máximo de 1184 px; márgenes de 20 px en móvil.
- Navegación visible de Filtrados y Espresso en todos los tamaños.
- Seis métodos en tres columnas en escritorio, dos columnas en móvil.
- Variables y receta en dos columnas; una columna hasta 760 px.
- Receta visible al desplazarse en escritorio, sin fijación en móvil.
- Preparación móvil con instrucciones desplazables y acciones siempre visibles.
- Espaciado predominante de 8, 12, 16, 24 y 32 px.
- Radios de 8–13 px en controles y 18 px en paneles.

## Tipografía e iconos

- Georgia para títulos; Segoe UI/Arial para controles, datos y texto.
- Sin descargas de fuentes ni imágenes decorativas pesadas en la portada.
- Números tabulares en dosis y temporizador.
- SVG con trazo uniforme; iconos decorativos ocultos a lectores de pantalla.

## Interacción

- Controles con al menos 44 px de altura y foco visible.
- Sliders con etiqueta asociada, valor con unidades y soporte de teclado.
- Los límites de dosis deshabilitan la acción correspondiente.
- Elegir un perfil explica que restablece proporción y temperatura.
- Cambiar variables reinicia la preparación anterior.
- Consultar otro paso pausa el temporizador; continuar recupera la guía automática.
- Diálogos con foco inicial, fondo inerte, ciclo de Tab, Escape y retorno al control.
- Eliminación con Deshacer dentro del diálogo y confirmación accesible.
- Persistencia local con recuperación ante errores; no confirmar un guardado fallido.
- Movimiento reducido respeta la preferencia del sistema.

## Validación

Comprobar ambas rutas y temas en 375, 768, 1024 y 1440 px, incluyendo orientación
horizontal de 812 × 375. Revisar desbordamientos, cálculos, navegación por teclado,
persistencia, carga de recetas, eliminación, restauración y preparación guiada.
