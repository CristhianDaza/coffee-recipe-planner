# Coffee Recipe Planner

Coffee Recipe Planner es una aplicación interactiva para diseñar recetas de café filtrado y bebidas basadas en espresso. Convierte variables como dosis, proporción, temperatura y perfil de sabor en instrucciones claras que acompañan al usuario durante toda la preparación.

El proyecto busca hacer accesibles los principios del café de especialidad sin exigir conocimientos técnicos previos. Cada ajuste muestra inmediatamente cómo cambia la receta, manteniendo una experiencia visual sencilla, cálida y enfocada en la preparación.

## Funcionalidades

### Métodos filtrados

El planificador incluye cuatro métodos de preparación:

- V60
- Chemex
- AeroPress
- Prensa francesa

Para cada método se puede ajustar:

- Cantidad de café.
- Proporción entre café y agua.
- Temperatura del agua.
- Perfil equilibrado, dulce o intenso.

La aplicación calcula automáticamente la cantidad de agua, molienda recomendada, rango de tiempo y pasos de preparación. Las recomendaciones cambian según el método y el perfil seleccionado.

### Guía de molienda

La guía visual compara cinco niveles de molienda mediante referencias de tamaño y textura. Su objetivo es servir como orientación independiente de la numeración utilizada por cada molino.

### Preparación guiada

Cada receta genera una secuencia de pasos con tiempos y cantidades específicos. El modo de preparación presenta:

- Temporizador integrado.
- Paso activo según el tiempo transcurrido.
- Navegación manual entre instrucciones.
- Controles para iniciar, pausar, continuar y reiniciar.
- Vista de enfoque que evita distracciones durante la preparación.

### Recetas con espresso

El módulo de espresso permite configurar la dosis y elegir entre ristretto, espresso y lungo. A partir del rendimiento calculado, genera recetas para:

- Espresso
- Americano
- Cappuccino
- Latte
- Flat white
- Cortado
- Macchiato
- Mocha

Las cantidades de agua y leche se adaptan proporcionalmente a la dosis seleccionada. También se muestran referencias de extracción, composición de la bebida, temperatura de la leche y recomendaciones de calibración.

### Experiencia visual

- Diseño adaptable para escritorio y dispositivos móviles.
- Tema claro y oscuro con preferencia guardada en el navegador.
- Navegación por secciones dentro de una sola página.
- Estados y controles accesibles mediante etiquetas semánticas.
- Animaciones desactivadas cuando el usuario prefiere movimiento reducido.
- Colección de recetas persistente en el navegador.
- Posibilidad de cargar o eliminar configuraciones guardadas.
- Confirmación visual al guardar o cargar una receta.

## Criterios de cálculo

La cantidad de agua se obtiene multiplicando la dosis de café por la proporción seleccionada. Los tiempos, la temperatura, la molienda y la técnica inicial se determinan mediante perfiles definidos para cada combinación de método y sabor.

En espresso, el rendimiento objetivo se calcula multiplicando la dosis por la proporción del estilo de extracción. Las cantidades complementarias de agua y leche se escalan tomando 18 gramos como dosis de referencia.

Estas recomendaciones funcionan como punto de partida. El molino, el café, el agua, el equipo y el gusto personal pueden requerir ajustes adicionales.

## Arquitectura

El proyecto está construido con Next.js, React, TypeScript y CSS. La interfaz funciona del lado del cliente y está organizada por responsabilidades:

```text
app/
├── components/
│   ├── brew-planner.tsx       # Controles, receta y preparación guiada
│   ├── espresso-planner.tsx   # Configuración y recetas de espresso
│   └── site-chrome.tsx        # Encabezado, portada, pie y notificaciones
├── data/
│   └── coffee.ts              # Métodos, perfiles y constantes
├── lib/
│   └── recipes.ts             # Cálculos y generación de instrucciones
├── globals.css                # Sistema visual y diseño adaptable
├── layout.tsx                 # Metadatos y estructura del documento
└── page.tsx                   # Estado y composición principal
```

Los datos de dominio y las funciones de cálculo están separados de los componentes visuales. Esto facilita añadir métodos, perfiles o bebidas sin mezclar la lógica de recetas con la presentación.

## Alcance actual

La aplicación no requiere cuentas. Las recetas se almacenan localmente en el navegador del usuario, por lo que permanecen disponibles al recargar la página, pero no se sincronizan entre navegadores o dispositivos. Toda la información necesaria para calcular las recetas está incluida en el proyecto y no depende de servicios externos.
