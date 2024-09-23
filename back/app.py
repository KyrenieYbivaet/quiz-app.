from flask import Flask, render_template
from back.models import db

app = Flask(__name__)
app.config.from_object('config.Config')

# Импортируем маршруты после создания приложения
from back.routes import *


@app.route('/')
def home():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)
