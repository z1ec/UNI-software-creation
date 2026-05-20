from backend.app.models.product import Product
from backend.app.schemas.product import ProductDetailSchema, ProductListItemSchema


def _primary_image(product: Product) -> str | None:
    for img in product.images:
        if img.is_primary:
            return img.url
    return product.images[0].url if product.images else None


def _total_stock(product: Product) -> int:
    return sum(s.stock for s in product.sizes)


def _final_price(price: float, discount: int | None) -> float:
    if discount:
        return round(price * (1 - discount / 100), 2)
    return price


def build_product_list_item(product: Product) -> ProductListItemSchema:
    from backend.app.schemas.product import CategorySchema

    return ProductListItemSchema(
        id=product.id,
        title=product.title,
        brand=product.brand,
        gender=product.gender,
        category=CategorySchema.model_validate(product.category) if product.category else None,
        price=product.price,
        discount=product.discount,
        final_price=_final_price(product.price, product.discount),
        is_new=product.is_new,
        image=_primary_image(product),
        total_stock=_total_stock(product),
    )


def build_product_detail(
    product: Product,
    *,
    is_in_favorites: bool = False,
    is_in_cart: bool = False,
) -> ProductDetailSchema:
    from backend.app.schemas.product import CategorySchema, SizeSchema

    return ProductDetailSchema(
        id=product.id,
        title=product.title,
        description=product.description,
        brand=product.brand,
        gender=product.gender,
        category=CategorySchema.model_validate(product.category) if product.category else None,
        price=product.price,
        discount=product.discount,
        final_price=_final_price(product.price, product.discount),
        is_new=product.is_new,
        images=[img.url for img in sorted(product.images, key=lambda i: i.sort_order)],
        sizes=[SizeSchema(size=s.size, stock=s.stock) for s in product.sizes],
        total_stock=_total_stock(product),
        is_in_favorites=is_in_favorites,
        is_in_cart=is_in_cart,
    )
