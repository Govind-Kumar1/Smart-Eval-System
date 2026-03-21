# app/services/rule_engine.py

def rule_based_topics(logs):
    topics = set()

    for log in logs:
        if "TypeError" in log:
            topics.add("Data Types")
        if "IndexError" in log:
            topics.add("Array Indexing")

    return list(topics)