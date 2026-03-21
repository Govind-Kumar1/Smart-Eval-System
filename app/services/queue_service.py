# app/services/queue_service.py

import pika
import json
from app.core.config import RABBITMQ_URL

def publish_task(data):
    connection = pika.BlockingConnection(pika.URLParameters(RABBITMQ_URL))
    channel = connection.channel()
    channel.queue_declare(queue="topic_queue")

    channel.basic_publish(
        exchange="",
        routing_key="topic_queue",
        body=json.dumps(data)
    )

    connection.close()