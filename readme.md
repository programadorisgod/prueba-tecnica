# Solución del problema

Primeramente quiero empezar explicando por qué tomé la decisión de resolver el problema usando 3 capas.

Si bien es un problema simple y podría resolverse con una sola función, como lo explican en el README, esto puede tornarse poco legible, mantenible. Además si hay algún fallo, tocaria ir adivinando quién está causando el fallo, pero si se modulariza y se lleva a capas, cada quién va a tener su responsabilidad. En caso de error al leer los datos, nos dirigimos automáticamente a la capa de datos, si hay algún fallo en el cálculo, vamos a la capa de logica; y si no nos gusta como se ve o se está mostrando equivocadamente, vamos a la capa de presentación. Por otro lado, con esta estructura, podemos pasarnos a una estructura usando arquitectura limpia e incluso pasarnos a un framework sin sufrir tanto, porque ya tenemos todo separado.

![Representación de las capas](https://github.com/programadorisgod/prueba-tecnica-images/raw/master/capas.png)

Ya una vez explicado por qué decidí usar capas, para abordar la solución de este problema, veamos por qué utilicé clases. La programación orientada a objetos, podemos decir que es un estandar en el mundo de la programación. Es nuestra manera de llevar o unir el mundo real con el codigo. Por si fuera poco se genera una estructura más organizada, hacemos un desacoplamiento para que el mantenimiento del codigo sea más fácil de mantener.

Perfecto, pero tenemos 3 capas. Creeríamos que a la hora de ejecutar el código comenzaria desde la capa de datos, luego pasando a lógica y por ultimo a presentación. Pero, ¿qué pasa? Estamos usando la entrada estandar **stdin** para poder correr nuestro programa de la siguiente manera.

```bash
cat students.txt | node index.js
```

Entonces nos toca ejecutar nuestro proyecto y que vaya desde la capa de presentación hasta la capa de datos, ahora viene lo interesante, **¿Por qué decidí el enfoque de eventos?** Como el proyecto va en cascada, se necesita saber cuando terminó el flujo de datos a la hora de de leer el archivo, pero claro, solo envío los estudiantes y no hago más nada.

Veamos que sucede en la capa de lógica. Hay una cola de procesos, pero ¿por qué decidí esto? Pues aquí estamos con un archivo pequeño de 6 registros, pero tratándose de la vida real, de una universidad son miles de registros y necesitamos que a la hora de realizar actividades el hilo de nuestra aplicación no se bloquee. Es decir usando una cola de procesos, nuestro codigo está preparado para el futuro. Al implementar una cola de procesos, ganamos programación asíncrona, desacoplamiento, ya que el proceso de agregar y procesar estudiantes es independiente haciendo que nuestro codigo sea fácil de leer y mantener. Esto es lo que buscamos ya que la mayoría del tiempo leemos más codigo que el que escribimos.
También obtenemos tolerancia a fallos y hacemos que nuestra aplicación siga ejecutando otras tareas sin necesidad de esperar que carguemos todos nuestros estudiantes y luego sean procesados como se necesite.

Por ejemplo:
![cola de procesos](https://github.com/programadorisgod/prueba-tecnica-images/raw/master/Captura%20desde%202024-04-21%2017-20-46.png)

Decidí usar la libreria Bull porque es de las mejores que hay. Como expliqué anteriormente, tener una cola de procesos nos permite tener una tolerancia a fallos. La libreria Bull nos permite especificar cuántos intentos realizará para agregar al registro en caso de fallo.

## Ejecución del programa

1. Instalar las dependencias:

```bash
 npm install
```

ó

```bash
 pnpm install
```

2. Ejecutarlo:
Si se va a ejecutar con los ejemplos de la prueba este es el comando.

```bash
cat students.txt | node index.js
```

sino, teniendo en cuenta que los registros deben seguir el esquema proporcionado en el enunciado.

```bash
cat archivo.txt | node index.js
```

### test

Con respecto a los test, decidí usar la libreria jest, para poder hacer mock de la información y así entrar en un entorno simulado, para verificar que el código hace lo que se espera.

ejecutar los test:

```bash
npm run test
```

ó

```bash
pnpm run test
```

Muchas gracias por tomarte este tiempo, para leer.
