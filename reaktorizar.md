# 📌 Guia de cómo Reaktorizar un proyecto o servicio.
Los ficheros del proyecto deben de encontrarse siempre a nivel de directorio raiz dentro del repositorio. Es decir, en la carpeta raiz del repositorio deberemos tener el fichero `pom.xml` y el directorio `src`.

![image](https://github.com/user-attachments/assets/9b235357-38d6-4f6f-ada1-3f68e5b7c312)

# 📌 Actualizar nombre paqueteria y queries de DTOs.
Al actualizar los nombres de los paquetes como es posible que hayamos hecho a este punto, será importante actualizar las queries presentes en los distintos repositorios que crean DTOs en el proyecto para que reflejen la nueva paqueteria. 

# 📌 Cambios en el POM
En el pom ya no partimos desde el `parent` sino que ahora se parte del siguiente proyecto.
Este proyecto es simplemente un conjunto de dependencias pre-configuradas.
   
```xml
<parent>
  <groupId>es.iesjandula.reaktor</groupId>
  <artifactId>Dependencies</artifactId>
  <version>1.0.0</version>
  <relativePath /> <!-- lookup parent from repository -->
</parent>
```

## 📍 Versión, nombre del proyecto.
Borramos la versión de Java especificada en el pom. Además el `artifactId` y el `name`, deben de seguir la _convención_ de los demás proyectos integrados de reaktor. 
```xml
	<groupId>es.iesjandula.reaktor</groupId>
	<artifactId>ProjectorServer</artifactId>
	<version>0.0.1-SNAPSHOT</version>
	<name>ProjectorServer</name>
```

## 📍 Para proyectos de servidor de spring.
En el fichero `pom.xml` no deben de existir dependencias que no sean las siguientes, excepto casos especiales como lo son dependencias especificas de proyecto.


>[!CAUTION]
> Es importante clonar e importar los siguientes proyectos del repositorio de IES Jándula.
> - Reaktor_base
> - Reaktor_base_server
> - Reaktor_Dependencies

```xml
  <!-- Utilidades comunes a todos los servidores -->
  <dependency>
    <groupId>es.iesjandula.reaktor</groupId>
    <artifactId>BaseServer</artifactId>
    <version>1.0.0</version>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
  </dependency>
  <dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
  </dependency>
```

## 📍 Build
Copiamos la siguiente configuración de `<build>`.

>[!IMPORTANT]
>Es importante actualizar la `mainClass` para que corresponda a la clase de lanzamiento del proyecto que deseamos reaktorizar.

```xml
<build>
  <!-- Util para la asignación de secretos desde Github -->
  <resources>
    <resource>
      <directory>src/main/resources</directory>
      <filtering>true</filtering> <!-- Activar filtrado de recursos -->
      <excludes>
        <exclude>**/*.p12</exclude> <!-- Excluir archivos .p12
        (keystore) del filtrado -->
        <exclude>**/*.pem</exclude> <!-- Excluir archivos .pem
        (keystore) del filtrado -->
        <exclude>**/*.csv</exclude> <!-- Excluir archivos .csv del
        filtrado -->
      </excludes>
    </resource>
    <!-- Añadir otra sección de recursos para incluir archivos binarios
    sin filtrado -->
    <resource>
      <directory>src/main/resources</directory>
      <filtering>false</filtering> <!-- No aplicar filtrado a archivos
      binarios -->
      <includes>
        <include>**/*.p12</include>
        <include>**/*.pem</include>
        <include>**/*.csv</include>
      </includes>
    </resource>
    <!-- FIN - Util para la asignación de secretos desde Github -->
  </resources>
  <plugins>
    <!-- Util para la asignación de secretos desde Github -->
    <plugin>
      <groupId>org.apache.maven.plugins</groupId>
      <artifactId>maven-resources-plugin</artifactId>
      <configuration>
        <encoding>UTF-8</encoding>
        <useDefaultDelimiters>true</useDefaultDelimiters> <!--
        Asegura el uso de delimitadores por defecto (${...}) -->
        <filters>
          <filter>
            src/main/resources/application-VPS-filter.properties</filter>
        </filters>
      </configuration>
    </plugin>
    <!-- FIN - Util para la asignación de secretos desde Github -->
    <plugin>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-maven-plugin</artifactId>
      <configuration>
        <excludes>
          <exclude>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
          </exclude>
        </excludes>
      </configuration>
      <executions>
        <execution>
          <goals>
            <goal>repackage</goal>
          </goals>
          <configuration>
            <classifier>jar-with-dependencies</classifier>
            <mainClass>
              es.iesjandula.reaktor.booking_server.ReaktorBookingServerApplication</mainClass>  -> IMPORTANTE CAMBIAR ESTA LINEA PARA LA CLASE REFERENTE EN TU PROYECTO.
          </configuration>
        </execution>
      </executions>
    </plugin>
  </plugins>
</build>
```

# 📌 Copiamos ficheros de configuración de proyecto `yaml`.
Copiamos los siguientes ficheros desde otro proyecto ya reactorizado como por ejemplo Reaktor Booking Server.
![image](https://github.com/user-attachments/assets/b23abe99-e882-4fb2-9d91-2de1f8cc50f0)

Tras copiar esos ficheros deberemos adaptar los `yaml` recien copiados para que coincidan los puertos, nombres y otros datos que hacen referencia al proyecto. 
Para proyectos que además de servidor fungen de cliente, deberemos configurar un `clientId`.

<!-- En el fichero `application-VPS.yaml` modificamos según nustro proyecto: -->

>[!TIP]
> Lo que nos interesa es traernos una configuración pre-existente de otros proyectos de reaktor, tomarla como base y adaptarla a nuestro proyecto según sus necesidades.

>[!NOTE]
> La primera vez que lanzamos el proyecto lo haremos en modo `create`, y a partir del segundo lanzamiento en modo `none`.

# 📌 Aplicar seguridad.
Para securizar el proyecto debemos de introducir unas anotaciones especiales encima de los endpoints. Podemos copiar estas anotaciones de un proyecto ya reaktorizado como referencia.

Ejemplo anotación:
```java
@PreAuthorize("hasRole('" + BaseConstants.ROLE_PROFESOR + "')")
```

![image](https://github.com/user-attachments/assets/1f827a2e-0add-489a-b24f-7b85a0d87dba)

![image](https://github.com/user-attachments/assets/b07b398f-8bf6-497c-b071-c944d70f1b95)

Para casos con mas de un rol se utiliza la siguiente sintaxis.
![image](https://github.com/user-attachments/assets/9b9a5112-75d0-4d93-8398-730ec11509f3)

# 📌 Pruebas de compilación.
Con los ficheros `yaml` ya adaptados a nuestro proyecto, procedemos a probar la compilación del proyecto. 

