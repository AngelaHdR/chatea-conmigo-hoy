# Chatea conmigo
Esta applicación de mensajería es un prototipo que con unas ligeras modificaciones se puede usar como chatBot de consultas, como mensajería entre varios usuarios o inclusive una mezcla de ambas opciones.

*Creado por Àngela Hermosilla del Rio*

## Indice
- [Tecnologias utilizadas](#tecnologías-utilizadas)
- [Funcionalidades](#funcionalidades)
- [Estructura de carpetas](#estructura-de-carpetas)

## Tecnologías utilizadas
La base del proyecto está creada con Ionic usando el framework de Angular. Gracias a los componentes propios de ionic para crear la interfaz atractiva la experiencia del usuario es fácil y agradable. Por otro lado, el backend está simulado gracias a Firebase, las dos herramientas utilizadas han sido la autentificación y la base de datos.

## Funcionalidades
Entre las acciones que puede realizar el usuario en la web se distinguen dos tipos:
- Autentificación: hacer login con su cuenta de google y cerrar la sesión (de manera manual o automática al recargar la página).
- Mensajeria: cargar los mensajes (de manera progresiva gracias a un scroll inverso), enviar un mensaje nuevo, editar uno de los mensajes mandados anteriormente, borrar un mensaje y borrar el chat entero.

## Estructura de carpetas
El proyecto sigue una estructura de carpetas simple para una fácil comprensión: 
1. **Core:** se encuentran los modelos usados en la aplicación.
2. **Pages:** todas las páginas que el usuario puede visitar
3. **Shared:** conjunto de carpetas usadas en toda la aplicación (servicios, guardas y componentes generales)