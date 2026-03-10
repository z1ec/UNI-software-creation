SET client_encoding = 'UTF8';

BEGIN;

TRUNCATE TABLE review, rating, product_variants, product_content, discounts, products RESTART IDENTITY CASCADE;

INSERT INTO products (id, title, description, gender)
VALUES
    (1, 'Худи Urban Wave', 'Теплое оверсайз-худи из хлопка с минималистичным принтом.', 'M'),
    (2, 'Платье Summer Breeze', 'Легкое миди-платье из вискозы для повседневных прогулок.', 'F'),
    (3, 'Футболка Basic Fit', 'Базовая футболка прямого кроя на каждый день.', 'U'),
    (4, 'Куртка North Street', 'Демисезонная куртка с ветрозащитной пропиткой.', 'U');

INSERT INTO product_variants (product_id, price, stock, "S", "M", "L", "XL", "XXL", new, brand, product_type)
VALUES
    (1, 4590.00, 45, 8, 12, 11, 9, 5, TRUE, 'UrbanLab', 'hoodie'),
    (2, 5290.00, 38, 6, 10, 9, 8, 5, FALSE, 'BreezeLine', 'dress'),
    (3, 1990.00, 72, 15, 18, 16, 14, 9, FALSE, 'BaseWear', 't-shirt'),
    (4, 7990.00, 24, 3, 6, 7, 5, 3, TRUE, 'NorthWay', 'jacket');

INSERT INTO rating (product_id, rating_avg, rating_count)
VALUES
    (1, 4.7, 126),
    (2, 4.5, 94),
    (3, 4.3, 210),
    (4, 4.8, 57);

INSERT INTO review (product_id, review, estimate)
VALUES
    (1, 'Отличная посадка и плотная ткань, после стирки форма сохранилась.', 5),
    (1, 'Хороший крой, но рукава для меня немного длинные.', 4),
    (2, 'Материал приятный, но на высокий рост хотелось бы длину чуть больше.', 4),
    (3, 'Хорошая базовая футболка, цвет не вымывается.', 5),
    (4, 'Теплая и удобная куртка, в дождь не промокает.', 5);

INSERT INTO discounts (product_id, discount, t_start, t_end)
VALUES
    (1, 15, '2026-03-01 00:00:00', '2026-03-10 23:59:59'),
    (2, 20, '2026-03-05 00:00:00', '2026-03-15 23:59:59'),
    (3, 10, '2026-03-02 00:00:00', '2026-03-20 23:59:59'),
    (4, 25, '2026-03-07 00:00:00', '2026-03-18 23:59:59');

INSERT INTO product_content (product_id, image, video)
VALUES
    (1, 'https://cdn.example.com/products/1/main.jpg', 'https://cdn.example.com/products/1/preview.mp4'),
    (2, 'https://cdn.example.com/products/2/main.jpg', 'https://cdn.example.com/products/2/preview.mp4'),
    (3, 'https://cdn.example.com/products/3/main.jpg', 'https://cdn.example.com/products/3/preview.mp4'),
    (4, 'https://cdn.example.com/products/4/main.jpg', 'https://cdn.example.com/products/4/preview.mp4');

COMMIT;
