from typing import List, Optional

from pydantic import BaseModel


class SizeSchema(BaseModel):
    size: str
    stock: int

    model_config = {"from_attributes": True}


class CategorySchema(BaseModel):
    id: int
    name: str
    slug: str

    model_config = {"from_attributes": True}


class ProductListItemSchema(BaseModel):
    id: int
    title: str
    brand: str
    gender: str
    category: Optional[CategorySchema] = None
    price: float
    discount: Optional[int] = None
    final_price: float
    is_new: bool
    image: Optional[str] = None
    total_stock: int

    model_config = {"from_attributes": True}


class ProductDetailSchema(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    brand: str
    gender: str
    category: Optional[CategorySchema] = None
    price: float
    discount: Optional[int] = None
    final_price: float
    is_new: bool
    images: List[str]
    sizes: List[SizeSchema]
    total_stock: int
    is_in_favorites: bool = False
    is_in_cart: bool = False

    model_config = {"from_attributes": True}


class ProductCreateRequest(BaseModel):
    title: str
    description: Optional[str] = None
    brand: str
    gender: str = "U"
    category_id: Optional[int] = None
    price: float
    discount: Optional[int] = None
    is_new: bool = False
    sizes: List[SizeSchema] = []
    images: List[str] = []


class ProductUpdateRequest(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    brand: Optional[str] = None
    gender: Optional[str] = None
    category_id: Optional[int] = None
    price: Optional[float] = None
    discount: Optional[int] = None
    is_new: Optional[bool] = None
    is_active: Optional[bool] = None


class CategoryCreateRequest(BaseModel):
    name: str
    slug: str


class ProductsPageResponse(BaseModel):
    items: List[ProductListItemSchema]
    total: int
    page: int
    pages: int
