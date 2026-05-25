INSERT INTO empleados (id, nombre, rol, pin_acceso) VALUES
  (1, 'Abraham', 'admin', '2004'),
  (2, 'Ana', 'camarero', '1975'),
  (3, 'Amparo', 'camarero', '1981');

INSERT INTO mesas (id, numero_mesa, estado, capacidad, zona) VALUES
  (1, 1, 'Libre', 4, 'bar'),
  (2, 2, 'Ocupado', 2, 'bar'),
  (3, 3, 'Libre', 6, 'bar'),
  (4, 4, 'Libre', 1, 'bar'),
  (5, 5, 'Libre', 1, 'bar'),
  (6, 6, 'Ocupado', 1, 'bar'),
  (7, 7, 'Libre', 1, 'bar'),
  (8, 8, 'Libre', 1, 'bar'),
  (9, 9, 'Libre', 1, 'bar'),
  (21, 1, 'Libre', 4, 'comedor'),
  (22, 2, 'Libre', 2, 'comedor'),
  (23, 3, 'Libre', 6, 'comedor'),
  (24, 4, 'Libre', 4, 'comedor'),
  (25, 5, 'Libre', 8, 'comedor'),
  (26, 6, 'Libre', 2, 'comedor'),
  (27, 7, 'Libre', 4, 'comedor'),
  (28, 8, 'Libre', 6, 'comedor'),
  (29, 9, 'Libre', 4, 'comedor'),
  (30, 10, 'Libre', 2, 'comedor'),
  (31, 11, 'Libre', 4, 'comedor'),
  (32, 12, 'Libre', 6, 'comedor');

INSERT INTO productos (id, nombre, precio, categoria, cantidad, created_at, updated_at) VALUES
  ('00000000-0000-0000-0000-000000000101', 'Coca Cola grande', 2.50, 'Refrescos', 100, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('00000000-0000-0000-0000-000000000102', 'Coca Cola 0 grande', 2.50, 'Refrescos', 100, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('00000000-0000-0000-0000-000000000201', 'Agua 0,33L', 1.20, 'Agua', 150, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('00000000-0000-0000-0000-000000000301', '1/5 Estrella', 1.70, 'Cerveza', 120, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('00000000-0000-0000-0000-000000000601', 'Cafe solo', 1.50, 'Cafes', 200, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('11111111-1111-1111-1111-111111111111', 'Sopa de cocido', 0.00, '1º plato', 100, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('11111111-1111-1111-1111-111111111112', 'Pasta con atún', 0.00, '1º plato', 100, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('11111111-1111-1111-1111-111111111113', 'Ensalada mixta', 0.00, '1º plato', 100, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('11111111-1111-1111-1111-111111111114', 'Lentejas caseras', 0.00, '1º plato', 100, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('22222222-2222-2222-2222-222222222221', 'Pescado del día', 0.00, '2º plato', 100, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('22222222-2222-2222-2222-222222222222', 'Pollo asado', 0.00, '2º plato', 100, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('22222222-2222-2222-2222-222222222223', 'Filete con patatas', 0.00, '2º plato', 100, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('22222222-2222-2222-2222-222222222224', 'Tortilla española', 0.00, '2º plato', 100, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('33333333-3333-3333-3333-333333333331', 'Tarta de queso', 5.50, 'Postres', 60, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('33333333-3333-3333-3333-333333333332', 'Flan casero', 4.00, 'Postres', 60, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('33333333-3333-3333-3333-333333333333', 'Arroz con leche', 3.50, 'Postres', 60, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO comandas (id, id_mesa, id_empleado, estado, fecha, total) VALUES
  (1, 2, 2, 'Abierta', CURRENT_TIMESTAMP, 4.20),
  (2, 6, 3, 'Abierta', CURRENT_TIMESTAMP, 3.40);

INSERT INTO lineas_comandas (id, id_comanda, id_producto, cantidad, subtotal) VALUES
  (1, 1, 101, 1, 2.50),
  (2, 1, 301, 1, 1.70),
  (3, 2, 301, 2, 3.40);

UPDATE productos SET categoria = '1º plato'
WHERE LOWER(categoria) LIKE '1%' OR LOWER(categoria) LIKE '%primer%';

UPDATE productos SET categoria = '2º plato'
WHERE LOWER(categoria) LIKE '2%' OR LOWER(categoria) LIKE '%segund%';

UPDATE productos SET categoria = 'Postres'
WHERE LOWER(categoria) LIKE '%postre%';

UPDATE productos SET nombre = 'Sopa de cocido', categoria = '1º plato'
WHERE id = '11111111-1111-1111-1111-111111111111';

UPDATE productos SET nombre = 'Pasta con atún', categoria = '1º plato'
WHERE id = '11111111-1111-1111-1111-111111111112';

UPDATE productos SET nombre = 'Ensalada mixta', categoria = '1º plato'
WHERE id = '11111111-1111-1111-1111-111111111113';

UPDATE productos SET nombre = 'Lentejas caseras', categoria = '1º plato'
WHERE id = '11111111-1111-1111-1111-111111111114';

UPDATE productos SET nombre = 'Pescado del día', categoria = '2º plato'
WHERE id = '22222222-2222-2222-2222-222222222221';

UPDATE productos SET nombre = 'Pollo asado', categoria = '2º plato'
WHERE id = '22222222-2222-2222-2222-222222222222';

UPDATE productos SET nombre = 'Filete con patatas', categoria = '2º plato'
WHERE id = '22222222-2222-2222-2222-222222222223';

UPDATE productos SET nombre = 'Tortilla española', categoria = '2º plato'
WHERE id = '22222222-2222-2222-2222-222222222224';

UPDATE productos SET nombre = 'Tarta de queso', categoria = 'Postres'
WHERE id = '33333333-3333-3333-3333-333333333331';

UPDATE productos SET nombre = 'Flan casero', categoria = 'Postres'
WHERE id = '33333333-3333-3333-3333-333333333332';

UPDATE productos SET nombre = 'Arroz con leche', categoria = 'Postres'
WHERE id = '33333333-3333-3333-3333-333333333333';
