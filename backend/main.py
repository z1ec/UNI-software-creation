from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.api.admin import router as admin_router
from backend.app.api.auth import router as auth_router
from backend.app.api.cart import router as cart_router
from backend.app.api.categories import router as categories_router
from backend.app.api.favorites import router as favorites_router
from backend.app.api.orders import router as orders_router
from backend.app.api.products import router as products_router
from backend.app.api.users import router as users_router

app = FastAPI(title="Atelier Shop API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost", "http://localhost:80", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(products_router)
app.include_router(categories_router)
app.include_router(cart_router)
app.include_router(favorites_router)
app.include_router(orders_router)
app.include_router(users_router)
app.include_router(admin_router)


@app.get("/api/health")
def health():
    return {"status": "ok"}
