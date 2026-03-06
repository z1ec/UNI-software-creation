from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy import select, text
from sqlalchemy.orm import Session

from backend.app.database import connect_db as get_db
from backend.app.models import Product, Review, Discount, ProductContent, ProductVariant


app = FastAPI()

# Временная затычка, которая принудительно к каждому запросу приписывает UTF-8,
# Нужно разобраться как это правильно делать через Pydantic - response_model
#
@app.middleware("http")
async def force_json_utf8(request, call_next):
    response = await call_next(request)
    content_type = response.headers.get("content-type", "")
    if content_type.startswith("application/json"):
        response.headers["Content-Type"] = "application/json; charset=utf-8"
    return response


# получает ОБЪЕКТ вариантов товаров
def getProductVariantsObject(product_id: int, db: Session):
    productVariants = db.execute(select(ProductVariant).where(ProductVariant.product_id == product_id)).scalar_one_or_none()
    return productVariants


# получает ОБЪЕКТ контента товара
def getProductContentObject(product_id: int, db: Session):
    content = db.execute(select(ProductContent).where(ProductContent.product_id == product_id)).scalar_one_or_none()
    return content


# получает ОБЪЕКТ скидки на товар
def getDicsountObject(product_id: int, db: Session):
    discount = db.execute(select(Discount).where(Discount.product_id == product_id)).scalar_one_or_none()
    return discount

# считает количество отзывов на товаре
def get_rating_count(product_id: int, db: Session):
    count = db.query(Review).filter(Review.product_id == product_id).count()
    return count


#считает среднюю оценку
def get_rating_avg(product_id: int, db: Session):
    ratings = db.query(Review).filter(Review.product_id == product_id).all()
    if not ratings: return 0
    total = sum([r.estimate for r in ratings])
    value = total / len(ratings)
    
    return round(value, 2)


# вывод всех товаров
@app.get("/products")
def show_all_products(db: Session=Depends(get_db)):
    request = db.execute(select(Product)).scalars().all()
    if not request:
        raise HTTPException(
             status_code=status.HTTP_404_NOT_FOUND,
             detail="No products found"
        )   
    # Преобразование в JSON-подобный формат
    return [
        {
            "id": p.id,
            "title": p.title,
            "description": p.description
        } 
        for p in request
    ]
    
# вывод товара по id
@app.get("/products/{productID}")
def show_product(productID: int, db: Session = Depends(get_db)):
    product = db.execute(select(Product).where(Product.id == productID)).scalar_one_or_none()
    if not product:
        return {
            "response": status.HTTP_404_NOT_FOUND,
            "error": f"product {productID} not found",
            "data": "null"
        }
    
    ratingQuantity = get_rating_count(product.product_id, db)
    ratingAverage = get_rating_avg(product.product_id, db)
    discount = getDicsountObject(product.product_id, db)
    content = getProductContentObject(product.product_id, db)
    productVariants = getProductVariantsObject(product.product_id, db)
    
    # Преобразование в JSON-подобный формат
    return {
        "response": status.HTTP_200_OK,
        "error": "null",
        "data": {
            "id": product.id,
            "title": product.title,
            "description": product.description,
            "price": productVariants.price,
            "S": productVariants.S,
            "M": productVariants.M,
            "L": productVariants.L,
            "XL": productVariants.XL,
            "XXL": productVariants.XXL,
            "reviews": ratingQuantity,
            "ratings": ratingAverage,
            "discount": product.discounts,
            "discount_t_start": discount.t_start,
            "discount_t_end": discount.t_end,
            "product_content_image": content.image,
            "product_content_video": content.video,
        }
    }