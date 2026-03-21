from fastapi import APIRouter
from app.models.schema import LogRequest
from app.services.rag_service import process_prediction

router = APIRouter()

@router.post("/predict")
def predict(req: LogRequest):
    result = process_prediction(req.model_dump())
    return {"recommended_topics": result}