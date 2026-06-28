from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import notes
from routers import categories
from models import Base
from database import engine

Base.metadata.create_all(bind=engine)
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(notes.router)
app.include_router(categories.router)