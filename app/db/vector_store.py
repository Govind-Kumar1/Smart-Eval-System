# app/db/vector_store.py

from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
import json
def load_db():
    with open("data/topics.json") as f:
        topics = json.load(f)

    texts = [t["description"] for t in topics]

    embeddings = HuggingFaceEmbeddings()
    db = FAISS.from_texts(texts, embeddings)

    return db, topics