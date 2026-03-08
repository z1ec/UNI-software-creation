from fastapi import FastAPI

from backend.app.api.products import router as products_router

app = FastAPI()
app.include_router(products_router)
