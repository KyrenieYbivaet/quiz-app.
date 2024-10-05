from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'User'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nickname = db.Column(db.String(20), unique=True, nullable=False)


class UserStatistics(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    correct_answers_sports = db.Column(db.Integer, default=0)
    incorrect_answers_sports = db.Column(db.Integer, default=0)
    correct_answers_history = db.Column(db.Integer, default=0)
    incorrect_answers_history = db.Column(db.Integer, default=0)
    correct_answers_science = db.Column(db.Integer, default=0)
    incorrect_answers_science = db.Column(db.Integer, default=0)
    correct_answers_geography = db.Column(db.Integer, default=0)
    incorrect_answers_geography = db.Column(db.Integer, default=0)
    correct_answers_math = db.Column(db.Integer, default=0)
    incorrect_answers_math = db.Column(db.Integer, default=0)


class Question(db.Model):
    __tablename__ = 'question'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    text = db.Column(db.String(500), nullable=False)
    correct_answer = db.Column(db.String(100), nullable=False)
    options = db.Column(db.String(500), nullable=False)
    category = db.Column(db.String(100), nullable=False)


class UserAnswer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey('question.id'), nullable=False)
    user_answer = db.Column(db.String(100), nullable=False)
    is_correct = db.Column(db.Boolean, nullable=False)


class TestResult(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    score = db.Column(db.Integer, nullable=False)
    total_questions = db.Column(db.Integer, nullable=False)
