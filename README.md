# Balto · Prototipo navegable

Prototipo en HTML, CSS y JavaScript (sin dependencias ni compilación) de la app **Balto**, construido pantalla por pantalla a partir del diseño en Figma.

- **165 pantallas** en 16 flujos (A · Acceso y cuenta … O · Estados transversales).
- Lienzo de diseño de **390 × 844 px**; el dispositivo se escala para encajar en la pantalla real (por ejemplo 380 × 820) sin deformarse.
- Las pantallas están conectadas siguiendo el flujo de uso: registro → perfil de la mascota → carga inicial → inicio, y desde el inicio a cada módulo.

## Cómo verlo

Abre `index.html` en el navegador. Desde ahí puedes:

- **Iniciar prototipo**: empieza en el splash (`pantallas/a1-splash.html`) y sigue el flujo completo.
- **Ir al inicio de la app**: entra directo a la pantalla principal.
- Abrir cualquier pantalla desde el **mapa**, con buscador y acceso por sección.

En el celular cada pantalla ocupa toda la vista. En el computador se muestra centrada, con una barra superior para volver al mapa.

Para publicarlo basta con servir la carpeta como sitio estático (por ejemplo, GitHub Pages desde la raíz de la rama).

## Estructura

```
index.html          Mapa de pantallas y punto de partida
pantallas/          Una página HTML por pantalla del Figma
css/balto.css       Tokens (colores, tipografía) y componentes
js/app.js           Escalado del dispositivo e interacciones
js/pantallas.js     Registro de pantallas por flujo (código, nombre, archivo)
assets/img/         Imágenes exportadas del Figma
assets/miniaturas/  Capturas pequeñas usadas en el mapa
```

## Interacciones incluidas

Navegación entre pantallas, volver con el historial, formularios con validación (rutas de éxito y error), selectores, chips y filtros, interruptores, casillas y opciones, contadores, búsqueda con resultados y sin resultados, elegir foto o archivo (cámara o galería), copiar enlace, quitar elementos (el carrito vacío lleva a su pantalla) y deslizar entre pantallas de bienvenida.

## Fidelidad con el Figma

Cada pantalla se comparó contra la captura del Figma en el mismo tamaño: la diferencia media es de **0,67 % de píxeles** (máximo 1,9 %), debida sobre todo al suavizado de las fuentes. Se respetaron también las particularidades del diseño original, como textos recortados por cajas de alto fijo, el orden de algunos bloques y los colores tal como aparecen en el archivo.

Las pantallas que en el Figma no tienen ningún botón que lleve a ellas (estados vacíos, errores, permisos, sesión vencida, etc.) aparecen en el mapa con la etiqueta «Estado alterno».
