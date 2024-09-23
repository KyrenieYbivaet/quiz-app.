from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from .models import db


def create_app():
    app = Flask(__name__)
    app.config.from_pyfile('config.py')

    db.init_app(app)

    from .routes import quiz_bp
    app.register_blueprint(quiz_bp)

    return app
