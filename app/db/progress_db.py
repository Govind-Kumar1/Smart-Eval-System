# app/db/progress_db.py

progress_store = {}

def update_progress(user_id, topics):
    if user_id not in progress_store:
        progress_store[user_id] = []

    progress_store[user_id].extend(topics)

def get_progress(user_id):
    return progress_store.get(user_id, [])