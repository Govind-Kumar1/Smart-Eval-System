# app/services/log_parser.py

def parse_logs(logs):
    return " ".join(logs)# app/services/rag_service.py

from app.db.vector_store import load_db
from app.services.rule_engine import rule_based_topics
from app.services.log_parser import parse_logs
from app.services.llm_service import generate_topics
from app.services.cache_service import get_cache, set_cache
from app.db.progress_db import update_progress

db, topics_data = load_db()

def process_prediction(data):
    user_id = data["user_id"]
    logs = data["logs"]

    cache_key = f"{user_id}:{hash(str(logs))}"
    cached = get_cache(cache_key)

    if cached:
        return cached

    parsed = parse_logs(logs)

    docs = db.similarity_search(parsed, k=3)
    context = [doc.page_content for doc in docs]

    llm_output = generate_topics(parsed, context)

    rule_topics = rule_based_topics(logs)

    final = list(set(rule_topics + [llm_output]))

    set_cache(cache_key, final)

    update_progress(user_id, final)

    return final