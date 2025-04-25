import gradio as gr
from transformers import pipeline

qa = pipeline("question-answering", model="deepset/roberta-base-squad2")

def bot_response(q):
    context = "أنا روبوت تجريبي أجيب على الأسئلة العامة."
    result = qa(question=q, context=context)
    return result['answer']

gr.Interface(fn=bot_response, inputs="text", outputs="text").launch()
