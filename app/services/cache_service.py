# app/services/cache_service.py

import redis
from app.core.config import REDIS_URL
import json

r = redis.Redis.from_url(REDIS_URL)

def get_cache(key):
    data = r.get(key)
    return json.loads(data) if data else None

def set_cache(key, value):
    r.set(key, json.dumps(value), ex=3600)