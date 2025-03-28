# 📌 Guia de cómo Reaktorizar un proyecto o servicio.
Los ficheros del proyecto deben de encontrarse siempre a nivel de directorio raiz dentro del repositorio. Es decir, en la carpeta raiz del repositorio deberemos tener el fichero `pom.xml` y el directorio `src`.

![image](https://github.com/user-attachments/assets/9b235357-38d6-4f6f-ada1-3f68e5b7c312)

## 📍 Cambios en el POM
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

## 📍 Nombre del proyecto.
El artifactId y el name, deben de seguir la 'convención' de los demás proyectos integrados de reaktor. 
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


