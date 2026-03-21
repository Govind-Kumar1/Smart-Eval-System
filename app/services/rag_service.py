# app/services/rag_service.py

from app.db.vector_store import load_db
from app.services.rule_engine import rule_based_topics
from app.services.log_parser import parse_logs
from app.services.llm_service import generate_topics
from app.db.progress_db import update_progress

db, topics_data = load_db()


def process_prediction(data):
    logs = data["logs"]
    user_id = data["user_id"]

    # Step 1: Parse logs
    parsed_logs = parse_logs(logs)

    # Step 2: RAG retrieval
    docs = db.similarity_search(parsed_logs, k=3)
    context = [doc.page_content for doc in docs]

    # Step 3: LLM
    try:
        llm_output = generate_topics(parsed_logs, context)
    except Exception as e:
        print("LLM Error:", e)
        llm_output = ""

    # Step 4: Rule-based topics
    rule_topics = rule_based_topics(logs)

    # Step 5: Build clean output
    final_topics = []

    # Rule-based (basic explanation)
    for topic in rule_topics:
        final_topics.append({
            "topic": topic,
            "explanation": "Based on your errors, you should revise this concept."
        })

    # LLM output (only if valid)
    if llm_output and llm_output.strip():
        final_topics.append({
            "topic": "AI Detailed Suggestions",
            "explanation": llm_output
        })

    # Step 6: Save progress
    update_progress(user_id, [t["topic"] for t in final_topics])

    return final_topics