from fastapi import APIRouter, HTTPException
from fastapi import Depends
from sqlalchemy.orm import Session
from models import Note
from schemas import NoteCreate, NoteUpdate
from database import get_db

router = APIRouter()
@router.post("/notes")
def create_note(note : NoteCreate, db : Session = Depends(get_db)):
    db_note = Note(category_id = note.category_id, content = note.content, title = note.title)
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note

@router.get("/notes")
def get_all_notes(db: Session = Depends(get_db)):
    return db.query(Note).all()

@router.get("/notes/{note_id}")
def get_note(note_id : int, db: Session = Depends(get_db)):
    note = db.query(Note).filter(Note.id == note_id).first()
    if note is None:
        raise HTTPException(
            status_code = 404,
            detail = "note not found"
        )
    return note

@router.put("/notes/{note_id}")
def update_note(note_id : int, note : NoteUpdate, db : Session = Depends(get_db)):
    db_note = db.query(Note).filter(Note.id == note_id).first()
    if db_note is None:
        raise HTTPException(
            status_code = 404,
            detail = "detail not found"        
            )
    
    db_note.content = note.content
    db_note.title = note.title
    db.commit()
    db.refresh(db_note)
    return db_note

@router.delete("/notes/{note_id}")
def delete_note(note_id : int, db : Session = Depends(get_db)):
    db_note = db.query(Note).filter(Note.id == note_id).first()
    if db_note is None:
        raise HTTPException(
            status_code = 404,
            detail = "detail not found"        
            )
    
    db.delete(db_note)
    db.commit()
    return {"message" : "note deleted"}

