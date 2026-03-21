# Student Topic Recommendation Service

This repository now contains **only your role** in the larger project: an AI microservice that receives coding problem logs from another backend service and predicts which topic a student should study next.

## What this service does

- Assumes another backend already handles educator CRUD for problems and stores student logs.
- Accepts a payload containing `student_id`, `problem_id`, `error_log`, and optional `problem_context`.
- Uses a **LangChain + RAG** pipeline to retrieve the most relevant topic knowledge.
- Asks an LLM to choose the best topic for remediation.
- Falls back to a lightweight rule-based predictor when `OPENAI_API_KEY` is not configured.

## Project structure

- `app/main.py` – FastAPI service with `/predict-topic` endpoint.
- `app/rag_pipeline.py` – LangChain retrieval and topic prediction logic.
- `app/topics_data.py` – starter knowledge base for coding-study topics.
- `requirements.txt` – Python dependencies.

## How the RAG flow works

1. Your colleague's backend sends an error-log file or log text to this service.
2. The service converts the log + problem context into a retrieval query.
3. A FAISS vector index retrieves the most relevant topic notes.
4. The LLM predicts the single best topic the student should revise.
5. The API returns:
   - predicted topic
   - confidence
   - explanation
   - evidence from the log/retrieved knowledge

## Run locally

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
export OPENAI_API_KEY=your_key_here
uvicorn app.main:app --reload
```

Open the interactive API docs at `http://127.0.0.1:8000/docs`.

## Example request

```bash
curl -X POST http://127.0.0.1:8000/predict-topic \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "stu-101",
    "problem_id": "graph-22",
    "problem_context": "Find the shortest path between cities in a weighted graph.",
    "error_log": "Student uses BFS and gets wrong answers on weighted edges. Distance array is not updated after relaxation."
  }'
```

## Example response

```json
{
  "student_id": "stu-101",
  "problem_id": "graph-22",
  "prediction": {
    "predicted_topic": "Graphs",
    "confidence": "medium",
    "explanation": "...",
    "evidence": ["..."],
    "retrieved_topics": ["Graphs", "Dynamic Programming", "Arrays & Hashing"]
  }
}
```

## Notes

- Replace the in-memory `TOPIC_DOCUMENTS` knowledge base with your own curriculum/topic notes later.
- If your backend sends a file instead of plain log text, parse the file before calling `predict_topic`.
- You can store predictions in your main backend or database after receiving the API response.