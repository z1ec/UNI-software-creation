from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy import select, text
from sqlalchemy.orm import Session

from backend.app.database import connect_db as get_db
from backend.app.models import Product


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
    

# вывод товаров по ID
@app.get("/products/{productID}")
def show_product(productID: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == productID).first()
    # Преобразование в JSON-подобный формат
    return { 
        "id": product.id,
        "title": product.title,
        "description": product.description
    }
