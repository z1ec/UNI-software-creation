from sqlalchemy import Integer, String, Float, DateTime, Text, ForeignKey
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, validates

from app.database import Base

class Product(Base):
    __tablename__ = "products"
    id: Mapped[int] = mapped_column(Integer, autoincrement=True)
    product_id: Mapped[int] = mapped_column(Integer, primary_key=True, unique=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    gender: Mapped[str] = mapped_column(String(1), nullable=False, default="U")
    reviews: Mapped[list["Review"]] = relationship(back_populates="product")
    product_variants: Mapped[list["ProductVariant"]] = relationship(back_populates="product")
    ratings: Mapped[list["Rating"]] = relationship(back_populates="product")
    discounts: Mapped[list["Discount"]] = relationship(back_populates="product")
    product_content: Mapped[list["ProductContent"]] = relationship(back_populates="product")

class Review(Base):
    __tablename__ = "review"
    id: Mapped[int] = mapped_column(Integer, autoincrement=True, primary_key=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.product_id"))
    review: Mapped[str] = mapped_column(Text(1024))
    estimate: Mapped[int] = mapped_column(Integer, nullable=False)

    @validates("estimate")
    def checkEstimate(self, key, value):
        if value < 0 or value > 5:
            print("Error! Estimate must be between 0 and 5") # ИЗМЕНИТЬ ПОД БРАУЗЕР
        return value
    
    product: Mapped["Product"] = relationship(back_populates="reviews")


class ProductVariant(Base):
    __tablename__ = "product_variants"
    id: Mapped[int] = mapped_column(Integer, autoincrement=True, primary_key=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.product_id"))
    price: Mapped[float] = mapped_column(Float, nullable=False)

    @validates("price")
    def checkPrice(self, key, value):
        if value <= 0:
            print("Wrong price!") # ИЗМЕНИТЬ ПОД БРАУЗЕР
        return value

    stock: Mapped[int] = mapped_column(Integer, nullable=False)

    @validates("stock")
    def checkStock(self, key, value) -> int:
        if value < 0:
            print("Stock is less than 0!") # ПОМЕНЯТЬ
        return value
    
    S: Mapped[int] = mapped_column(Integer, nullable=False)
    M: Mapped[int] = mapped_column(Integer, nullable=False)
    L: Mapped[int] = mapped_column(Integer, nullable=False)
    XL: Mapped[int] = mapped_column(Integer, nullable=False)
    XXL: Mapped[int] = mapped_column(Integer, nullable=False)

    @validates("S", "M", "L", "XL", "XXL")
    def checkSize(self, key, value) -> str:
        if value < 0:
            print(f"{key} is less than 0!") # ПОМЕНЯТЬ
        return value
    
    product: Mapped["Product"] = relationship(back_populates="product_variants")
    

class Rating(Base):
    __tablename__ = "rating"
    id: Mapped[int] = mapped_column(Integer, autoincrement=True, primary_key=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.product_id"))
    rating_avg: Mapped[float] = mapped_column(Float, nullable=True)
    
    @validates("rating_avg")
    def checkRatingAvg(self, key, value) -> float:
        if value < 0 or value > 5:
            print("rating AVG is incorrect") # поменять под браузер
        return value

    rating_count: Mapped[int] = mapped_column(Integer, nullable=True)

    @validates("rating_count")
    def checkRatingCount(self, key, value) -> int:
        if value < 0:
            print("rating count is incorrect") # поменять под браузер
        return value   
    
    product: Mapped["Product"] = relationship(back_populates="ratings")


class Discount(Base):
    __tablename__ = "discounts"
    id: Mapped[int] = mapped_column(Integer, autoincrement=True, primary_key=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.product_id"))
    discount: Mapped[int] = mapped_column(Integer, nullable=False)

    @validates("discount")
    def checkDiscount(self, key, value):
        if value < 0:
            print("Discount error less than 0") # поменять
        return value
    
    t_start: Mapped[DateTime] = mapped_column(DateTime)
    t_end: Mapped[DateTime] = mapped_column(DateTime)
    
    @validates("t_start")
    def checkStart(self, key, value):
        if hasattr(self, "t_end") and self.t_end:
            if self.t_end <= value:
                print("начало распродажи позже конца") # поменять
        return value
    
    @validates("t_end")
    def checkStart(self, key, value):
        if hasattr(self, "t_start") and self.t_end:
            if value <= self.t_start:
                print("конец распродажи раньше начала") # поменять
        return value
    
    product: Mapped["Product"] = relationship(back_populates="discounts")


class ProductContent(Base):
    __tablename__ = "product_content"
    id: Mapped[int] = mapped_column(Integer, autoincrement=True, primary_key=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.product_id"))
    image: Mapped[str] = mapped_column(String)
    video: Mapped[str] = mapped_column(String)

    product: Mapped["Product"] = relationship(back_populates="product_content")