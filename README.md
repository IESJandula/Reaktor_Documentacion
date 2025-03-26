# ¡Trabajemos con proyectos Reaktor!

Si estás aquí es porque quieres lanzar una serie de proyectos Reaktor o quieres adaptar tu proyecto Spring Boot al formato Reaktor.

En esta guía vamos a comenzar aprendiendo [cómo arrancar un proyecto Reaktor en tu entorno local](#lanzando-reaktor-en-tu-máquina-local). Esto conlleva no solo la descarga de dependencias, sino también la generación de una serie de ficheros de configuración, la creación de un proyecto en Google Firebase y la descarga de sus ficheros de configuración para añadirlos a los anteriores. ¡Parece mucho! ¡Pero en esta guía paso a paso verás que es muy fácil! De esta forma, para arrancar el entorno Reaktor tenemos los siguientes apartados:

- [Proyectos necesarios para importar](#proyectos-necesarios-para-importar): verás los proyectos necesarios para poder arrancar el entorno Reaktor.
  
- [Importación y compilación en Eclipse](#importación-y-compilación-en-eclipse): te explicaré cómo importar los proyectos en Eclipse y cómo realizar el proceso de compilación.
  
- [Conocer el fichero de configuración application.yaml](#fichero-de-configuración-applicationyaml): entenderás el fichero de configuración y las propiedades específicas de Reaktor.

- [Cómo configurar Google Firebase y lanzar la web somosjandula](#cómo-configurar-google-firebase): aprenderás a configurar Google Firebase ya que aquí es donde se realizará el proceso de autenticación.
  
- [Creación de usuarios en la BBDD de nuestro microservicio FirebaseServer](#creación-de-usuarios-en-la-bbdd-de-nuestro-microservicio-firebaseserver): será necesario que crees al menos un usuario con tu correo electrónico y con los roles pertinentes para poder acceder a la aplicación.

- [Cómo lanzar la web somosjandula](#cómo-lanzar-la-web-somosjandula): aprenderás a lanzar la web de somosjandula.

## Lanzando Reaktor en tu máquina local

En esta sección iremos paso a paso configurando tu entorno local para que puedas desplegar todo el entorno Reaktor en tu máquina.

### Proyectos necesarios para importar

Los proyectos Maven de Reaktor previos a importar y necesarios para comenzar a trabajar con otros microservicios:

- [Dependencies](https://github.com/IESJandula/Reaktor_Dependencies/): contiene todas las dependencias de los proyectos Reaktor. Realmente, es un pom.xml con todas las librerías básicas, no tiene código Java.

- [Base](https://github.com/IESJandula/Reaktor_Base/): contiene funcionalidades de reinicio automático, entre otras utilidades interesantes que son comunes a cualquier proyecto Reaktor, ya sea cliente o servidor.

- [BaseServer](https://github.com/IESJandula/Reaktor_BaseServer/): posee funcionalidades de seguridad y todas aquellas dependencias comunes a cualquier servidor Spring Boot. Cabe destacar, que la mayoría de los proyectos son servidores, ya que ofrecen recursos a los que insertar, actualizar, consultar y borrar.

- [BaseClient](https://github.com/IESJandula/Reaktor_BaseClient/): posee funcionalidades de para la petición de JWTs al microservicio Firebase y todas aquellas dependencias comunes a cualquier servidor Spring Boot. Destacamos aquí que existen proyectos que son clientes puros como el [cliente de impresión remota](https://github.com/IESJandula/Reaktor_PrintersClient/) que realizan llamadas a servidores para informar o recibir información de estos. Por otro lado, también existen servidores que a su vez son clientes, por ejemplo, el [servidor de reservas de recursos](https://github.com/IESJandula/Reaktor_BookingServer) ya que preguntan cierta información a otro servidor, en este caso a [FirebaseServer](https://github.com/IESJandula/Reaktor_FirebaseServer/)

- [FirebaseServer](https://github.com/IESJandula/Reaktor_FirebaseServer/): es el microservicio que puede recibir peticiones de clientes como la web de [Somos Jándula](https://github.com/IESJandula/somosjandula/), clientes como [cliente de impresión remota](https://github.com/IESJandula/Reaktor_PrintersClient/) o como servidores tales como el [servidor de reservas de recursos](https://github.com/IESJandula/Reaktor_BookingServer). ``FirebaseServer`` se encarga de validar el JWT generado por Google Firebase para generar otro JWT propio de Reaktor que contiene el email, nombre y apellidos, y roles de la persona que se ha logueado a través de [Somos Jándula](https://github.com/IESJandula/somosjandula/). Para las aplicaciones cliente (que no son personas) como [cliente de impresión remota](https://github.com/IESJandula/Reaktor_PrintersClient/) también le asigna un JWT propio pero que en lugar de un email, nombre y apellidos, posee un identificador de aplicación. Por último ``FirebaseServer`` ofrece la posibilidad de consultar datos de los usuarios del sistema entre otro de sus endpoints, siendo útil para el [servidor de reservas de recursos](https://github.com/IESJandula/Reaktor_BookingServer), entre otros.
  
- [Somos Jándula](https://github.com/IESJandula/somosjandula/): es la web con la que se accede mediante el navegador a la plataforma. Necesitarás Node.js instalado. Más abajo existe una sección donde se explica cómo arrancarlo.
  
- Y ahora llega el momento...¿qué microservicio adicional quieres lanzar? Actualmente tenemos varios:
  
    - [Servidor de impresión remota](https://github.com/IESJandula/Reaktor_PrintersServer): recibe peticiones de impresión de usuarios desde la web de [Somos Jándula](https://github.com/IESJandula/somosjandula/) y las deja pendientes hasta que las recoge el [cliente de impresión remota](https://github.com/IESJandula/Reaktor_PrintersClient/)
      
    - [Servidor de reservas de recursos](https://github.com/IESJandula/Reaktor_BookingServer): recibe peticiones de reservas de recursos de usuarios ya sean fijas o temporales desde la web de [Somos Jándula](https://github.com/IESJandula/somosjandula/)
      
    - [Gestión de matrículas](https://github.com/IESJandula/Reaktor_SchoolManagerServer): recibe las matrículas de los alumnos y a partir de ahí nos ofrece la posibilidad de gestionar las asignaturas, profesorado asignado, creación de grupos, etcétera. Todo ello, desde la web de [Somos Jándula](https://github.com/IESJandula/somosjandula/)
      
    - [Gestión de incidencias](https://github.com/IESJandula/Reaktor_IssuesServer): recibe incidencias de usuarios desde la web de [Somos Jándula](https://github.com/IESJandula/somosjandula/) y notifica a la persona que debería resolverla la notificación de dicha incidencia.
 
    - Faltan muchos más proyectos que poco a poco iremos migrando, como: [el servidor de monitorización remota](https://github.com/IESJandula/Reaktor_MonitoringServer) y su [cliente](https://github.com/IESJandula/Reaktor_MonitoringClient), [el servidor para obtener los horarios y ubicaciones del profesorado y alumnado](https://github.com/IESJandula/Reaktor_TimetableServer), [un escaneador de equipos de red](https://github.com/IESJandula/Reaktor_NetworkServer) y [el proyecto Lince](https://github.com/IESJandula/Lince_ServerJava) que nos faltaría modificar su [código Flutter](https://github.com/IESJandula/Lince_Flutter) para que ahora funcione con JWTs. ¿Te animas a migrar alguno de ellos? [Realiza una petición por aquí](https://github.com/IESJandula/Reaktor_Documentacion/issues/new?title=Quiero%20participar%20en%20el%20proyecto...&body=Explica%20aquí%20el%20proyecto%20que%20querrías%20participar...)

### Importación y compilación en Eclipse

A la hora de crear un nuevo proyecto o adaptar uno ya existente para su uso con Reaktor se deben tener en cuenta una serie de proyectos maven que hacen la vez de módulos necesarios para su correcto funcionamiento, ya que cada uno de ellos implementa configuraciones o dependencias necesarias.

Dependiendo del IDE la manera de incluirlos en el proyecto final es ligeramente distinta.

En `eclipse` necesitamos los proyectos dentro del workspace común de nuestro proyecto a adaptar o crear. Para ello los incluimos importándolos como proyecto maven:

![Importar proyecto en Eclipse](imgs/importar_proyecto-Eclipse-1.png)

![Importar proyecto en Eclipse](imgs/importar_proyecto-Eclipse-2.png)

![Importar proyecto en Eclipse](imgs/importar_proyecto-Eclipse-3.png)

En browse elegimos la carpeta raíz del proyecto maven a importar y hacemos click en finish cuando veamos que detecta el POM.

Una vez lo tenemos importado es importante hacerle un clean install, para ello hacemos click derecho y venimos aquí:

![Importar proyecto en Eclipse](imgs/maven_build-Eclipse-1.png)

En maven build, en goals, escribimos clean install y ejecutamos:

![Importar proyecto en Eclipse](imgs/maven_build-Eclipse-2.png)

Así aparece si sale bien:

![Importar proyecto en Eclipse](imgs/maven_build-Eclipse-3.png)

**Importante**: Hay que tener en cuenta el orden a la hora de instalar estos módulos ya que alguno puede depender de que otro esté ya instalado anteriormente

### Fichero de configuración application.yaml

En el archivo de configuración `application.yaml` de nuestro proyecto es necesario añadir una serie de configuraciones. Ejemplo con el proyecto School Manager:

```
reaktor:
 publicKeyFile: C:\claves\public_key.pem
 privateKeyFile: C:\claves\private_key.pem
 googleCredentialsFile: C:\claves\firebaseGoogleCredentials.json
 urlCors: http://localhost:5173, http://192.168.1.209:5173
```

Para poder obtener el valor de estas propiedades, se hace uso de la anotación `@Value`. A continuación se muestran la descripción de las más importantes:

- **reaktor.publicKeyFile**: Ruta al archivo de clave pública, siendo necesaria en todos los proyectos. Se almacena en `C:\claves`. Para conseguirla, genera la clave pública utilizando el siguiente comando:

```
openssl rsa -in C:\claves\private_key.pem -pubout -out C:\claves\public_key.pem
```

- **reaktor.privateKeyFile**: Ruta al archivo de clave privada, siendo solo necesaria en el proyecto FirebaseServer. Se almacena en `C:\claves`. Para conseguirla, genera la clave pública utilizando el siguiente comando:

```
openssl genrsa -out C:\claves\private_key.pem 2048
```

- **reaktor.googleCredentialsFile**: Ruta al archivo JSON de credenciales de Firebase, siendo solo necesaria en el proyecto FirebaseServer. Se almacena en `C:\claves`. Se explica en el apartado siguiente.


- **reaktor.urlCors**: Lista de orígenes permitidos para las solicitudes CORS, siendo necesaria en todos los proyectos. Define los orígenes permitidos, por ejemplo: `http://localhost:5173, http://192.168.1.209:5173`.

### Cómo configurar Google Firebase

Para crear una cuenta en firebase usaremos una cuenta de google, siguiendo estos pasos:

1. Entramos a la [Consola de firebase](https://console.firebase.google.com/)

![configurar Google Firebase - 1](imgs/configurar_Google_Firebase-1.png)

2. Elegimos un nombre y damos a continuar hasta el final (google analytics no es necesario) para crear el proyecto..

![configurar Google Firebase - 2](imgs/configurar_Google_Firebase-2.png)

3. Una vez creado elegimos utilizar firebase en nuestra aplicación web desde este botón:

![configurar Google Firebase - 3](imgs/configurar_Google_Firebase-3.png)

4. Elegimos nombre y registramos

![configurar Google Firebase - 4](imgs/configurar_Google_Firebase-4.png)

5. Esto nos genera el siguiente bloque de código

![configurar Google Firebase - 5](imgs/configurar_Google_Firebase-5.png)

### Creación de usuarios en la BBDD de nuestro microservicio FirebaseServer

Para que el sistema funcione correctamente, es necesario tantos usuarios como personas quieras que accedan a la aplicación. Normalmente, en entorno local solo te bastará con añadir una fila con tu usuario. Para ello, necesitarás hacer un INSERT en la tabla usuario con tu correo electrónico, tu nombre y apellidos, y los roles que quieras tener. En cuanto a los roles, para poder visualizar todas las opciones de la aplicación, se aconseja que el valor sea `PROFESOR,DIRECCION,ADMINISTRADOR`

Repite este paso para cada usuario que necesites agregar al sistema.

### Cómo lanzar la web somosjandula

A continuación, en la raíz del proyecto web [Somos Jándula](https://github.com/IESJandula/somosjandula/) nos creamos el archivo de entorno ``.env`` y utilizamos los datos que nos ha generado para rellenar cada uno de los campos, aquí hay un ejemplo de cómo es:

![configurar somosjandula - 1](imgs/configurar_somosjandula-1.png)

Para lanzar el proyecto web anterior, necesitamos instalar node.js, sino la consola no detecta ``npm``. Tras eso ejecutar el ``npm install`` en la consola cmd, en la raíz del proyecto. Por último, podemos ejecutar el front con ``npm run dev``.

### Anotación necesaria para el arranque de nuestro microservicio

Debemos añadir la anotación siguiente encima de la clase de la aplicación principal de ejecución (la que tiene @SpringBootApplication) del proyecto que se quiere crear o adaptar:

``@ComponentScan(basePackages = {"es.iesjandula"})``

Sin eso no se tendrán en cuenta los módulos añadidos anteriormente y el programa actuará como si no estuvieran.
