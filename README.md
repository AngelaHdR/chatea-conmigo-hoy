# Pasos para instalar una aplicacion de ionic con firebase

## Instalacion

Primero crear un proyecto y una app en la consola de firebase

Luego en ionic iniciar un nuevo proyecto con Angular usando una plantilla. Ejecutar los tres comandos indicados.

Para unir ionic y firebase ejecutar ng add @angula/fire@19.0.0, iniciar la sesion en firebase y seleccionar el proyecto y la aplicacion deseados. Tambien se pueden elegir los servicios de firebase que se desean instalar.

Para inicializar firebase en nuestra app de ionic hay que añadir en el constructor del app.module la siguiente linea: "const app = initializeApp(environment.firebaseConfig);" y copiaremos todas nuestras claves en el fichero environment.ts para poder acceder facilmente.

## Autentificacion

Usando la cuenta de google con un popup
Conseguido hacer login y logout, falta capturar las credenciales