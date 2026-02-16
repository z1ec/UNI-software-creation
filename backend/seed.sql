WITH new_products AS (
  INSERT INTO products (title, description)
  VALUES
    ('Футболка Basic', 'Хлопок 100%, базовая футболка'),
    ('Худи Oversize', 'Теплое худи свободного кроя')
  RETURNING id, title
),
product_ids AS (
  SELECT
    MAX(CASE WHEN title = 'Футболка Basic' THEN id END) AS tshirt_id,
    MAX(CASE WHEN title = 'Худи Oversize' THEN id END) AS hoodie_id
  FROM new_products
)
INSERT INTO product_content (product_id, image, video)
SELECT tshirt_id, 'https://example.com/images/tshirt.jpg', 'https://example.com/videos/tshirt.mp4' FROM product_ids
UNION ALL
SELECT hoodie_id, 'https://example.com/images/hoodie.jpg', 'https://example.com/videos/hoodie.mp4' FROM product_ids;

WITH product_ids AS (
  SELECT
    (SELECT id FROM products WHERE title = 'Футболка Basic' ORDER BY id DESC LIMIT 1) AS tshirt_id,
    (SELECT id FROM products WHERE title = 'Худи Oversize' ORDER BY id DESC LIMIT 1) AS hoodie_id
)
INSERT INTO product_variants (product_id, price, stock, s, m, l, xl, xxl)
SELECT tshirt_id, 1499.0, 120, 10, 30, 40, 25, 15 FROM product_ids
UNION ALL
SELECT hoodie_id, 3999.0, 60, 5, 15, 20, 12, 8 FROM product_ids;

WITH product_ids AS (
  SELECT
    (SELECT id FROM products WHERE title = 'Футболка Basic' ORDER BY id DESC LIMIT 1) AS tshirt_id,
    (SELECT id FROM products WHERE title = 'Худи Oversize' ORDER BY id DESC LIMIT 1) AS hoodie_id
)
INSERT INTO rating (product_id, rating_avg, rating_count)
SELECT tshirt_id, 4.6, 18 FROM product_ids
UNION ALL
SELECT hoodie_id, 4.2, 9 FROM product_ids;

WITH product_ids AS (
  SELECT
    (SELECT id FROM products WHERE title = 'Футболка Basic' ORDER BY id DESC LIMIT 1) AS tshirt_id,
    (SELECT id FROM products WHERE title = 'Худи Oversize' ORDER BY id DESC LIMIT 1) AS hoodie_id
)
INSERT INTO discounts (product_id, discount, t_start, t_end)
SELECT tshirt_id, 10, '2026-02-01', '2026-02-29' FROM product_ids
UNION ALL
SELECT hoodie_id, 25, '2026-02-10', '2026-03-10' FROM product_ids;

WITH product_ids AS (
  SELECT
    (SELECT id FROM products WHERE title = 'Футболка Basic' ORDER BY id DESC LIMIT 1) AS tshirt_id,
    (SELECT id FROM products WHERE title = 'Худи Oversize' ORDER BY id DESC LIMIT 1) AS hoodie_id
)
INSERT INTO review (product_id, review, estimate)
SELECT tshirt_id, 'Отличное качество ткани.', 5 FROM product_ids
UNION ALL
SELECT hoodie_id, 'Хороший крой, но маломерит.', 4 FROM product_ids;
