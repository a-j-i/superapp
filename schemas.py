from pydantic import BaseModel
from typing import Optional

class CategoryCreate(BaseModel):
    name : str

class NoteCreate(BaseModel):
    category_id : int
    content : str
    title : Optional[str] = None

class CategoryUpdate(BaseModel):
    name : str

class NoteUpdate(BaseModel):
    content : str 
    title : str
