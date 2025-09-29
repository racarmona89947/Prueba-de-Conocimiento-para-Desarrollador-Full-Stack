-- Crear base de datos (si no existe)
CREATE DATABASE IF NOT EXISTS prueba_labtica CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE prueba_labtica;

-- Tabla items
CREATE TABLE IF NOT EXISTS items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seleccionar todos los elementos
SELECT * FROM items;

-- Insertar un elemento
INSERT INTO items (nombre, descripcion) VALUES ('Producto de prueba', 'Este es un producto de ejemplo');

-- Actualizar un elemento
UPDATE items SET nombre = 'Producto actualizado', descripcion = 'Descripción actualizada' WHERE id = 1;

-- Eliminar un elemento
DELETE FROM items WHERE id = 1;
