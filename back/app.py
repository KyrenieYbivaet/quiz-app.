from flask import Flask
from back.models import db  # Импортируем db, чтобы инициализировать его

app = Flask(__name__)
app.config.from_object('config.Config')

# Импортируем маршруты после создания приложения
from back.routes import *

@app.route('/')
def home():
    return "Hello, this is the Quiz app!"

if __name__ == '__main__':
    app.run(debug=True)
