from fastapi import FastAPI
from routers import notes
from routers import categories
from models import Base
from database import engine

Base.metadata.create_all(bind=engine)
app = FastAPI()

app.include_router(notes.router)
app.include_router(categories.router)