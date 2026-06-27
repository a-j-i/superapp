from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Text
from database import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True)
    name = Column(String)

class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True)
    category_id = Column(Integer, nullable=False)
    content = Column(Text)
    title = Column(String, nullable=True)

