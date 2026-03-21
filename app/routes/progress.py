# app/routes/progress.py

from fastapi import APIRouter
from app.db.progress_db import get_progress

router = APIRouter()

@router.get("/progress/{user_id}")
def progress(user_id: int):
    return {"topics": get_progress(user_id)}