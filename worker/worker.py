# worker/worker.py

import pika
import json
from app.services.rag_service import process_prediction

def callback(ch, method, properties, body):
    data = json.loads(body)
    process_prediction(data)

connection = pika.BlockingConnection(
    pika.URLParameters("amqp://guest:guest@localhost/")
)

channel = connection.channel()
channel.queue_declare(queue="topic_queue")

channel.basic_consume(queue="topic_queue", on_message_callback=callback, auto_ack=True)

print("Worker started...")
channel.start_consuming()