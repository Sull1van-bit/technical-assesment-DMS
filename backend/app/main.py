from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .models.ticket import Base
from .core.database import engine
from .routes import ticket as ticket_routes

from dotenv import load_dotenv
import os

load_dotenv()

URL_FRONTEND = os.getenv("URL_FRONTEND")

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[URL_FRONTEND],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ticket_routes.router)