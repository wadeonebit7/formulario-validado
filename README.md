# Formulario con Validaciones en tiempo real

Aplicacion web de formulario con validaciones de formulario en tiempo real y actualizaciones en vivo.

## Instalación

### 1. Clonar repositorio e instala las dependecias:
```bash
git clone https://github.com/wadeonebit7/formulario-validado
cd formulario-validado
npm install
```

### 2. Crear la base de datos en MySQL:

```sql
CREATE DATABASE actividades_clases;
USE actividades_clases;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    contrasena VARCHAR(255) NOT NULL 
);

INSERT INTO usuarios (nombre, email, contrasena) VALUES 
('Ana Pérez', 'ana.perez@email.com', 'secreta123'),
('Carlos Gómez', 'carlos.g@email.com', 'password456'),
('María López', 'mlopez@email.com', 'acceso789');
```

### 3. Inicar el servidor:

```bash
node server.js
```