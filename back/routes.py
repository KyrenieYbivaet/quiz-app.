from flask import Blueprint, request, jsonify, current_app
from .models import db, Question
from .translate import translate_text
import requests
import random


# Создаем Blueprint
quiz_bp = Blueprint('quiz', __name__)

# Глобальная переменная для хранения сессионного токена
session_token = None

# Функция для получения сессионного токена
def get_session_token():
    global session_token
    if session_token is None:
        response = requests.get("https://opentdb.com/api_token.php?command=request")
        if response.status_code == 200:
            session_token = response.json().get('token')
        else:
            raise Exception("Не удалось получить токен")

# Функция для получения вопросов по тематике
def get_questions_by_category(category):
    global session_token
    get_session_token()  # Убедитесь, что токен получен

    category_ids = {
        "history": 23,
        "science": 17,
        "sports": 21,
        "geography": 22,
        "math": 19
    }

    category_id = category_ids.get(category)
    if category_id is None:
        return {"error": "Invalid category"}

    trivia_url = f"https://opentdb.com/api.php?amount=5&category={category_id}&token={session_token}&encode=url3986"
    response = requests.get(trivia_url)

    if response.status_code != 200:
        return {"error": "Failed to fetch questions"}

    questions_data = response.json()

    if questions_data['response_code'] != 0:
        if questions_data['response_code'] == 4:
            session_token = None
            return get_questions_by_category(category)
        else:
            return {"error": "Failed to fetch questions: " + str(questions_data['response_code'])}

    # Переменная для хранения валидного вопроса
    valid_question = None

    for item in questions_data['results']:
        translated_question = translate_text(item['question'])
        correct_answer = translate_text(item['correct_answer'])
        options = [translate_text(answer) for answer in item['incorrect_answers'] + [item['correct_answer']]]

        # Проверка на существование вопроса в БД
        existing_question = Question.query.filter_by(text=translated_question).first()
        if existing_question is None:
            question = Question(
                text=translated_question,
                correct_answer=correct_answer,
                options=",".join(options),
                category=category  # добавляем категорию
            )
            db.session.add(question)
            db.session.commit()
            valid_question = question
            break  # Выходим из цикла, когда нашли валидный вопрос

    if valid_question is None:
        # Если не нашли валидного вопроса, можно попробовать снова
        return get_questions_by_category(category)

    return valid_question

@quiz_bp.route('/api/questions/<category>', methods=['GET'])
def get_questions(category):
    question = get_questions_by_category(category)

    if isinstance(question, dict) and 'error' in question:
        return jsonify(question), 500  # Ошибка при получении вопросов

    return jsonify({
        "id": question.id,
        "text": question.text,
        "options": question.options.split(','),
        "category": category
    })

