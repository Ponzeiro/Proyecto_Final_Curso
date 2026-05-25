# Table Tale Magic

Aplicacion web para la gestion de mesas, comandas y productos de un bar o restaurante. El proyecto esta dividido en un frontend en React y un backend en Spring Boot, conectados mediante una API REST y una base de datos MySQL.

## Descripcion

Table Tale Magic permite gestionar el flujo principal de un local de hosteleria:

- Visualizar mesas por zona.
- Consultar el estado de cada mesa.
- Crear y gestionar comandas.
- Administrar productos, platos y postres.
- Registrar lineas de comanda.
- Pagar comandas abiertas.
- Consultar empleados, mesas, productos y pedidos desde el backend.

El proyecto esta planteado como una aplicacion full stack, con separacion entre interfaz de usuario, logica de negocio y persistencia de datos.

## Tecnologias Utilizadas

### Frontend

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- shadcn/ui
- Radix UI
- TanStack React Query
- Vitest

### Backend

- Java 21
- Spring Boot
- Spring Web
- Spring Data JPA
- Bean Validation
- Maven Wrapper
- MySQL

## Estructura del Proyecto

```text
Proyecto_Final/
|-- table-tale-backend/   # API REST con Spring Boot
|-- table-tale-magic/     # Aplicacion frontend con React + Vite
|-- .gitignore
`-- README.md
```

### Backend

```text
table-tale-backend/src/main/java/com/tabletale/backend
|-- config/        # Configuracion de CORS
|-- controller/    # Controladores REST
|-- mapper/        # Conversion entre entidades y DTOs
|-- model/         # Entidades, DTOs, enums y value objects
|-- repository/    # Repositorios JPA
`-- service/       # Logica de negocio
```

### Frontend

```text
table-tale-magic/src
|-- assets/        # Imagenes y recursos visuales
|-- components/    # Componentes reutilizables
|-- context/       # Estado global de la aplicacion
|-- data/          # Datos auxiliares
|-- hooks/         # Hooks personalizados
|-- pages/         # Pantallas principales
|-- test/          # Configuracion y pruebas
`-- types/         # Tipos TypeScript
```

## Requisitos Previos

Antes de ejecutar el proyecto es necesario tener instalado:

- Java 21
- Node.js LTS
- npm
- MySQL
- Un gestor como phpMyAdmin, MySQL Workbench o similar

No es obligatorio instalar Maven de forma global, ya que el backend incluye Maven Wrapper.

## Configuracion de la Base de Datos

El backend utiliza MySQL y crea o usa una base de datos llamada:

```text
table_tale
```

La configuracion principal esta en:

```text
table-tale-backend/src/main/resources/application.properties
```

Configuracion por defecto:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/table_tale?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=Europe/Madrid&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=
```

Si tu usuario de MySQL tiene contrasena, modifica:

```properties
spring.datasource.password=TU_PASSWORD
```

Los datos iniciales se cargan desde:

```text
table-tale-backend/src/main/resources/data.sql
```

## Instalacion y Ejecucion

### 1. Clonar el repositorio

```powershell
git clone URL_DEL_REPOSITORIO
cd Proyecto_Final
```

### 2. Ejecutar el backend

Abre una terminal en la raiz del proyecto:

```powershell
cd table-tale-backend
.\mvnw.cmd spring-boot:run
```

El backend se ejecutara en:

```text
http://localhost:8080
```

### 3. Ejecutar el frontend

Abre otra terminal en la raiz del proyecto:

```powershell
cd table-tale-magic
npm install
npm run dev
```

El frontend se ejecutara normalmente en:

```text
http://localhost:5173
```

## Variables de Entorno

El frontend se conecta por defecto al backend en:

```text
http://localhost:8080/api
```

Si se quiere cambiar la URL de la API, se puede crear un archivo `.env` dentro de `table-tale-magic`:

```env
VITE_API_URL=http://localhost:8080/api
```

## Endpoints Principales

### Productos

```text
GET    /api/productos
GET    /api/productos/{id}
POST   /api/productos
PUT    /api/productos/{id}
DELETE /api/productos/{id}
```

### Mesas

```text
GET /api/mesas
GET /api/mesas/{id}
```

### Empleados

```text
GET /api/empleados
GET /api/empleados/{id}
```

### Comandas

```text
GET  /api/comandas
GET  /api/comandas/{id}
POST /api/comandas
POST /api/comandas/{id}/pagar
```

### Lineas de Comanda

```text
GET    /api/lineas-comandas
GET    /api/lineas-comandas/{id}
POST   /api/lineas-comandas
PUT    /api/lineas-comandas/{id}
DELETE /api/lineas-comandas/{id}
```

## Comandos Utiles

### Backend

Ejecutar tests:

```powershell
cd table-tale-backend
.\mvnw.cmd test
```

Arrancar la API:

```powershell
cd table-tale-backend
.\mvnw.cmd spring-boot:run
```

### Frontend

Instalar dependencias:

```powershell
cd table-tale-magic
npm install
```

Arrancar en desarrollo:

```powershell
npm run dev
```

Compilar para produccion:

```powershell
npm run build
```

Ejecutar tests:

```powershell
npm run test
```

Ejecutar linter:

```powershell
npm run lint
```

## Flujo Recomendado de Arranque

1. Iniciar MySQL.
2. Ejecutar el backend con Spring Boot.
3. Ejecutar el frontend con Vite.
4. Abrir `http://localhost:5173` en el navegador.

## Funcionalidades

- Gestion visual de mesas.
- Separacion por zonas del local.
- Gestion de productos desde la interfaz de administrador.
- Conexion del frontend con la API REST.
- Persistencia en MySQL.
- Carga automatica de datos iniciales.
- Arquitectura backend por capas.
- Componentes frontend reutilizables.

## Notas

- La carpeta `node_modules`, la carpeta `dist` del frontend y la carpeta `target` del backend no deben subirse al repositorio.
- El archivo `.env` se debe mantener fuera de Git si contiene configuracion local.
- Para que el frontend funcione correctamente con datos reales, el backend debe estar arrancado en el puerto `8080`.

## Autor

Proyecto final desarrollado por Abraham Blanco.
