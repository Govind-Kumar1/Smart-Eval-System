# app/main.py

from fastapi import FastAPI
from app.routes.predict import router as predict_router
from app.routes.progress import router as progress_router

app = FastAPI()

app.include_router(predict_router)
app.include_router(progress_router)