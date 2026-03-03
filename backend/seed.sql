SET client_encoding = 'UTF8';

BEGIN;

TRUNCATE TABLE review, rating, product_variants, product_content, discounts, products RESTART IDENTITY CASCADE;

INSERT INTO products (id, product_id, title, description, gender)
VALUES
    (1, 1001, 'Худи Urban Wave', 'Теплое оверсайз-худи из хлопка с минималистичным принтом.', 'M'),
    (2, 1002, 'Платье Summer Breeze', 'Легкое миди-платье из вискозы для повседневных прогулок.', 'F'),
    (3, 1003, 'Футболка Basic Fit', 'Базовая футболка прямого кроя на каждый день.', 'U');

INSERT INTO product_variants (product_id, price, stock, "S", "M", "L", "XL", "XXL")
VALUES
    (1001, 4590.00, 45, 8, 12, 11, 9, 5),
    (1002, 5290.00, 38, 6, 10, 9, 8, 5),
    (1003, 1990.00, 72, 15, 18, 16, 14, 9);

INSERT INTO rating (product_id, rating_avg, rating_count)
VALUES
    (1001, 4.7, 126),
    (1002, 4.5, 94),
    (1003, 4.3, 210);

INSERT INTO review (product_id, review, estimate)
VALUES
    (1001, 'Отличная посадка и плотная ткань, после стирки форма сохранилась.', 5),
    (1002, 'Материал приятный, но на высокий рост хотелось бы длину чуть больше.', 4),
    (1003, 'Хорошая базовая футболка, цвет не вымывается.', 5);

INSERT INTO discounts (product_id, discount, t_start, t_end)
VALUES
    (1001, 15, '2026-03-01 00:00:00', '2026-03-10 23:59:59'),
    (1002, 20, '2026-03-05 00:00:00', '2026-03-15 23:59:59'),
    (1003, 10, '2026-03-02 00:00:00', '2026-03-20 23:59:59');

INSERT INTO product_content (product_id, image, video)
VALUES
    (1001, 'https://cdn.example.com/products/1001/main.jpg', 'https://cdn.example.com/products/1001/preview.mp4'),
    (1002, 'https://cdn.example.com/products/1002/main.jpg', 'https://cdn.example.com/products/1002/preview.mp4'),
    (1003, 'https://cdn.example.com/products/1003/main.jpg', 'https://cdn.example.com/products/1003/preview.mp4');

COMMIT;
