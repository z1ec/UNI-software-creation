"""Run once to populate the database with demo data."""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from backend.app.db.session import SessionLocal
from backend.app.core.security import hash_password
from backend.app.models.user import User
from backend.app.models.product import Category, Product, ProductImage, ProductSize

CATEGORIES = [
    ("Верхняя одежда", "outerwear"),
    ("Трикотаж", "knitwear"),
    ("Джинсы", "jeans"),
    ("Шорты", "shorts"),
    ("Брюки", "pants"),
    ("Топы", "tops"),
]

PRODUCTS = [
    {
        "title": "Оверсайз худи с принтом",
        "brand": "Street Form",
        "gender": "U",
        "category_slug": "outerwear",
        "price": 5990,
        "discount": 15,
        "is_new": True,
        "description": "Тяжёлое оверсайз худи на молнии с графическим принтом. Плотный флис, объёмный капюшон.",
        "sizes": [("XS", 2), ("S", 3), ("M", 4), ("L", 3), ("XL", 2)],
        "image": "/products/61645.970.jpg",
    },
    {
        "title": "Толстовка на молнии",
        "brand": "Urban Basic",
        "gender": "M",
        "category_slug": "outerwear",
        "price": 6990,
        "discount": None,
        "is_new": False,
        "description": "Мужская толстовка на асимметричной молнии. Мягкий трикотаж, зауженный крой.",
        "sizes": [("S", 2), ("M", 4), ("L", 3), ("XL", 2)],
        "image": "/products/jbvhekbdob8.jpg",
    },
    {
        "title": "Свитшот классический",
        "brand": "Common Form",
        "gender": "M",
        "category_slug": "knitwear",
        "price": 4490,
        "discount": None,
        "is_new": False,
        "description": "Базовый мужской свитшот с длинным рукавом. Плотный хлопок, минималистичный крой.",
        "sizes": [("S", 3), ("M", 5), ("L", 4), ("XL", 2)],
        "image": "/products/kofta-muzhskaya-chernaya.jpg",
    },
    {
        "title": "Широкие джинсы Acid Wash",
        "brand": "Raw State",
        "gender": "F",
        "category_slug": "jeans",
        "price": 8990,
        "discount": None,
        "is_new": True,
        "description": "Широкие джинсы с эффектом кислотной варёнки. Низкая посадка, прямой крой.",
        "sizes": [("XS", 1), ("S", 2), ("M", 2), ("L", 1)],
        "image": "/products/3-01fbbfeae22061aca6abbe5aaabb6e4e.jpeg",
    },
    {
        "title": "Джоггеры мужские",
        "brand": "Street Form",
        "gender": "M",
        "category_slug": "pants",
        "price": 4990,
        "discount": None,
        "is_new": True,
        "description": "Широкие мужские джоггеры из плотного денима. Эластичный пояс, зауженный низ.",
        "sizes": [("S", 2), ("M", 3), ("L", 3), ("XL", 2)],
        "image": "/products/81smdqdq1tjilc3mvvd7qeex1ut0j7wv.JPG",
    },
    {
        "title": "Брюки с лампасами",
        "brand": "Atelier Sport",
        "gender": "F",
        "category_slug": "pants",
        "price": 5490,
        "discount": 10,
        "is_new": True,
        "description": "Широкие женские брюки с контрастными лампасами. Высокая посадка, свободный силуэт.",
        "sizes": [("XS", 2), ("S", 3), ("M", 2), ("L", 1)],
        "image": "/products/9b990bc1-552a-450b-9741-27aa94bd9885_size624x818.jpg",
    },
    {
        "title": "Широкие джоггеры",
        "brand": "Soft Hall",
        "gender": "F",
        "category_slug": "pants",
        "price": 3990,
        "discount": None,
        "is_new": True,
        "description": "Объёмные женские джоггеры из меланжевого хлопка. Резинка на поясе, свободный крой.",
        "sizes": [("XS", 3), ("S", 4), ("M", 3), ("L", 2)],
        "image": "/products/orig.webp",
    },
    {
        "title": "Мужские шорты",
        "brand": "Urban Basic",
        "gender": "M",
        "category_slug": "shorts",
        "price": 3490,
        "discount": None,
        "is_new": False,
        "description": "Классические мужские шорты до колена из плотного хлопка. Прямой крой, боковые карманы.",
        "sizes": [("S", 3), ("M", 5), ("L", 4), ("XL", 2)],
        "image": "/products/7086735516.jpg",
    },
    {
        "title": "Спортивные шорты мужские",
        "brand": "Outrun",
        "gender": "M",
        "category_slug": "shorts",
        "price": 2990,
        "discount": 10,
        "is_new": False,
        "description": "Лёгкие беговые шорты с утяжкой на поясе. Небольшой логотип, два кармана.",
        "sizes": [("S", 4), ("M", 5), ("L", 3), ("XL", 2)],
        "image": "/products/78214350299.jpg",
    },
    {
        "title": "Спортивные шорты женские",
        "brand": "Outrun",
        "gender": "F",
        "category_slug": "shorts",
        "price": 2490,
        "discount": None,
        "is_new": True,
        "description": "Женские шорты для тренировок с белой окантовкой. Эластичный пояс с завязками.",
        "sizes": [("XS", 3), ("S", 4), ("M", 3), ("L", 2)],
        "image": "/products/1.webp",
    },
    {
        "title": "Спортивный топ",
        "brand": "Skins",
        "gender": "F",
        "category_slug": "tops",
        "price": 2490,
        "discount": None,
        "is_new": False,
        "description": "Компрессионный спортивный топ с поддержкой. Дышащий материал, открытая спина.",
        "sizes": [("XS", 3), ("S", 4), ("M", 3), ("L", 2)],
        "image": "/products/3704.jpg",
    },
]


def seed() -> None:
    db = SessionLocal()
    try:
        if db.query(User).count() > 0:
            print("Database already seeded, skipping.")
            return

        # Users
        admin = User(
            email="admin@atelier.ru",
            full_name="Администратор Atelier",
            password_hash=hash_password("Admin123!"),
            role="admin",
        )
        client = User(
            email="client@atelier.ru",
            full_name="Покупатель Atelier",
            password_hash=hash_password("Client123!"),
            role="client",
        )
        db.add_all([admin, client])
        db.commit()

        # Categories
        cat_map: dict[str, Category] = {}
        for name, slug in CATEGORIES:
            cat = Category(name=name, slug=slug)
            db.add(cat)
            cat_map[slug] = cat
        db.commit()

        # Products
        for p_data in PRODUCTS:
            product = Product(
                title=p_data["title"],
                brand=p_data["brand"],
                gender=p_data["gender"],
                category_id=cat_map[p_data["category_slug"]].id,
                price=p_data["price"],
                discount=p_data["discount"],
                is_new=p_data["is_new"],
                description=p_data["description"],
            )
            db.add(product)
            db.flush()

            db.add(ProductImage(product_id=product.id, url=p_data["image"], is_primary=True))
            for size, stock in p_data["sizes"]:
                db.add(ProductSize(product_id=product.id, size=size, stock=stock))

        db.commit()
        print("Seed completed successfully.")
        print("  Admin:  admin@atelier.ru / Admin123!")
        print("  Client: client@atelier.ru / Client123!")
    except Exception as exc:
        db.rollback()
        print(f"Seed failed: {exc}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
