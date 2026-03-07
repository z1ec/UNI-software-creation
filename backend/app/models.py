from sqlalchemy import Integer, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship, validates

from .database import Base

class Product(Base):
    __tablename__ = "products"
    id: Mapped[int] = mapped_column(Integer, autoincrement=True, primary_key=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(String(2048), nullable=True)
    gender: Mapped[str] = mapped_column(String(1), nullable=False, default="U")
    reviews: Mapped[list["Review"]] = relationship(back_populates="product")
    product_variants: Mapped[list["ProductVariant"]] = relationship(back_populates="product")
    ratings: Mapped[list["Rating"]] = relationship(back_populates="product")
    discounts: Mapped[list["Discount"]] = relationship(back_populates="product")
    product_content: Mapped[list["ProductContent"]] = relationship(back_populates="product")

class Review(Base):
    __tablename__ = "review"
    id: Mapped[int] = mapped_column(Integer, autoincrement=True, primary_key=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"))
    review: Mapped[str] = mapped_column(String(1024))
    estimate: Mapped[int] = mapped_column(Integer, nullable=False)

    @validates("estimate")
    def checkEstimate(self, key, value):
        if value < 0 or value > 5:
            raise ValueError("Error! Estimate must be between 0 and 5")
        return value
    
    product: Mapped["Product"] = relationship(back_populates="reviews")


class ProductVariant(Base):
    __tablename__ = "product_variants"
    id: Mapped[int] = mapped_column(Integer, autoincrement=True, primary_key=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"))
    price: Mapped[float] = mapped_column(Float, nullable=False)

    @validates("price")
    def checkPrice(self, key, value):
        if value <= 0:
            raise ValueError("Wrong price!") # ИЗМЕНИТЬ ПОД БРАУЗЕР
        return value

    stock: Mapped[int] = mapped_column(Integer, nullable=False)

    @validates("stock")
    def checkStock(self, key, value) -> int:
        if value < 0:
            raise ValueError("Stock is less than 0!") # ПОМЕНЯТЬ
        return value
    
    S: Mapped[int] = mapped_column(Integer, nullable=False)
    M: Mapped[int] = mapped_column(Integer, nullable=False)
    L: Mapped[int] = mapped_column(Integer, nullable=False)
    XL: Mapped[int] = mapped_column(Integer, nullable=False)
    XXL: Mapped[int] = mapped_column(Integer, nullable=False)

    @validates("S", "M", "L", "XL", "XXL")
    def checkSize(self, key, value) -> int:
        if value < 0:
            raise ValueError(f"{key} is less than 0!") # ПОМЕНЯТЬ
        return value
    
    new: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    brand: Mapped[str] = mapped_column(String, nullable=False, default="Нет названия")
    product_type: Mapped[str] = mapped_column(String, nullable=False)

    product: Mapped["Product"] = relationship(back_populates="product_variants")
    

class Rating(Base):
    __tablename__ = "rating"
    id: Mapped[int] = mapped_column(Integer, autoincrement=True, primary_key=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"))
    rating_avg: Mapped[float] = mapped_column(Float, nullable=True)
    
    @validates("rating_avg")
    def checkRatingAvg(self, key, value) -> float | None:
        if value is None:
            return value
        if value < 0 or value > 5:
            raise ValueError("rating AVG is incorrect") # поменять под браузер
        return value

    rating_count: Mapped[int] = mapped_column(Integer, nullable=True)

    @validates("rating_count")
    def checkRatingCount(self, key, value) -> int | None:
        if value is None:
            return value
        if value < 0:
            raise ValueError("rating count is incorrect") # поменять под браузер
        return value   
    
    product: Mapped["Product"] = relationship(back_populates="ratings")


class Discount(Base):
    __tablename__ = "discounts"
    id: Mapped[int] = mapped_column(Integer, autoincrement=True, primary_key=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"))
    discount: Mapped[int] = mapped_column(Integer, nullable=False)

    @validates("discount")
    def checkDiscount(self, key, value):
        if value < 0:
            raise ValueError("Discount error less than 0") # поменять
        return value
    
    t_start: Mapped[DateTime] = mapped_column(DateTime)
    t_end: Mapped[DateTime] = mapped_column(DateTime)
    
    @validates("t_start")
    def checkStart(self, key, value):
        if hasattr(self, "t_end") and self.t_end is not None:
            if self.t_end <= value:
                raise ValueError("the start of the sale is later than the end") # поменять
        return value
    
    @validates("t_end")
    def checkEnd(self, key, value):
        if hasattr(self, "t_start") and self.t_start is not None:
            if value <= self.t_start:
                raise ValueError("the sale ends before it starts") # поменять
        return value
    
    product: Mapped["Product"] = relationship(back_populates="discounts")


class ProductContent(Base):
    __tablename__ = "product_content"
    id: Mapped[int] = mapped_column(Integer, autoincrement=True, primary_key=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"))
    image: Mapped[str] = mapped_column(String)
    video: Mapped[str] = mapped_column(String)

    product: Mapped["Product"] = relationship(back_populates="product_content")
