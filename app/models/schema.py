# app/models/schema.py

from pydantic import BaseModel
from typing import List

class LogRequest(BaseModel):
    user_id: int
    logs: List[str]