# app/services/llm_service.py

from langchain_huggingface import HuggingFaceEndpoint
from langchain_core.prompts import PromptTemplate
from app.core.config import HF_TOKEN, MODEL_NAME

llm = HuggingFaceEndpoint(
    repo_id=MODEL_NAME,
    huggingfacehub_api_token=HF_TOKEN,
    temperature=0.5,
    max_new_tokens=200
)

prompt = PromptTemplate(
    input_variables=["logs", "context"],
    template="""
You are an expert coding mentor.

Student errors:
{logs}

Relevant topics:
{context}

For each topic:
- Give topic name
- Give short explanation (2-3 lines)

Return in this format:

Topic: <topic name>
Explanation: <explanation>

Topic: <topic name>
Explanation: <explanation>
"""
)

def generate_topics(logs, context):
    formatted_prompt = prompt.format(logs=logs, context=context)
    return llm.invoke(formatted_prompt)