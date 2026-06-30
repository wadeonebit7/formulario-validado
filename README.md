```sql
CREATE DATABASE FormularioValidado;

USE FormularioValidado;

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
