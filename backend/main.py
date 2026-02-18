from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.encoders import jsonable_encoder
from sqlalchemy import select, text
from sqlalchemy.orm import Session

from backend.app.db import get_db
from backend.app.models import Product


app = FastAPI()

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