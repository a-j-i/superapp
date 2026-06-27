from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session
from database import get_db
from schemas import CategoryCreate, CategoryUpdate
from models import Category, Note
from fastapi import HTTPException

router = APIRouter()

@router.post("/categories")
def create_category(category: CategoryCreate, db : Session= Depends(get_db)):
    db_category = Category(name = category.name)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

@router.get("/categories")
def get_all_categories(db : Session = Depends(get_db)):
    return db.query(Category).all()

@router.get("/categories/{category_id}")
def get_category(category_id : int, db: Session =Depends(get_db)):
    db_category = db.query(Category).filter(Category.id == category_id).first()
    if db_category is None:
        raise HTTPException(status_code=404, detail=f"Category {category_id} not found")

    return db_category

@router.put("/categories/{category_id}")
def update_category_name(category_id : int, category : CategoryUpdate, db : Session=Depends(get_db)):
    db_category = db.query(Category).filter(Category.id == category_id).first()
    if db_category is None:
        raise HTTPException(
            status_code=404,
            detail="Category not found"
        )
    
    db_category.name = category.name
    
    db.commit()
    db.refresh(db_category)
    return db_category

@router.delete("/categories/{category_id}")
def delete_category(category_id : int, db : Session=Depends(get_db)):
    db_category = db.query(Category).filter(Category.id == category_id).first()
    if db_category is None:
        raise HTTPException(
            status_code=404,
            detail="Category not found"
        )
    
    notes = db.query(Note).filter(Note.category_id==category_id).first()
    if notes:
        raise HTTPException(
            status_code = 400,
            detail = "Category contains notes"
        )
    db.delete(db_category)
    db.commit()
    return {"message" : "Category deleted"}
