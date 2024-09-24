from flask import Blueprint, request, jsonify, current_app
from .models import db, Question, User, UserStatistics  # Обновлено для импорта User
from .translate import translate_text
import requests
from urllib.parse import unquote
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


def create_question(category):
    global session_token
    get_session_token()

    category_ids = {
        "history": 23,
        "science": 17,
        "sports": 21,
        "geography": 22,
        "math": 19
    }

    if category == "any":
        category = random.choice(list(category_ids.keys()))

    category_id = category_ids.get(category)
    if category_id is None:
        return {"error": "Неверная категория"}

    trivia_url = f"https://opentdb.com/api.php?amount=1&category={category_id}&difficulty=easy&type=multiple&token={session_token}&encode=url3986"
    response = requests.get(trivia_url)

    if response.status_code != 200:
        return {"error": "Не удалось получить вопросы, статус: " + str(response.status_code)}

    questions_data = response.json()
    if questions_data['response_code'] != 0:
        if questions_data['response_code'] == 4:
            session_token = None
            return create_question(category)
        else:
            return {"error": "Не удалось получить вопросы: " + str(questions_data['response_code'])}

    # Обрабатываем только один вопрос
    item = questions_data['results'][0]
    decoded_question = unquote(item['question'])
    decoded_correct_answer = unquote(item['correct_answer'])
    decoded_options = [unquote(answer) for answer in item['incorrect_answers'] + [item['correct_answer']]]

    translated_question = translate_text(decoded_question)
    correct_answer = translate_text(decoded_correct_answer)
    options = [translate_text(answer) for answer in decoded_options]

    question = Question(
        text=translated_question,
        correct_answer=correct_answer,
        options=",".join(options),
        category=category
    )

    db.session.add(question)
    db.session.commit()

    return {
        "text": question.text,
        "correct_answer": question.correct_answer,
        "options": question.options.split(","),
        "category": question.category
    }


@quiz_bp.route('/api/new_question/<category>', methods=['GET'])
def get_questions(category):
    question = create_question(category)

    if isinstance(question, dict) and 'error' in question:
        return jsonify(question), 500
    return jsonify(question)


def get_question(category):
    category_ids = {
        "history": 23,
        "science": 17,
        "sports": 21,
        "geography": 22,
        "math": 19,
        "general": 9
    }

    if category == "any":
        category = random.choice(list(category_ids.keys()))

    existing_question = Question.query.filter_by(category=category).order_by(db.func.random()).first()

    if existing_question:
        return existing_question
    return create_question(category)  # Если вопроса нет, создаем его


@quiz_bp.route('/api/get_question/<category>', methods=['GET'])
def get_random_question(category):
    question = get_question(category)

    if isinstance(question, dict) and 'error' in question:
        return jsonify(question), 500

    return jsonify({
        "category": question.category,
        "correct_answer": question.correct_answer,
        "options": question.options.split(','),
        "text": question.text
    })


def update_user_statistics(user_id, category, is_correct):

    # Проверяем, существует ли пользователь
    user = User.query.get(user_id)
    if user is None:
        raise Exception("Пользователь не найден")

    # Проверяем, существует ли запись для данного пользователя
    stats = UserStatistics.query.filter_by(user_id=user_id).first()

    if stats is None:
        # Если записи нет, создаем новую с нулями
        stats = UserStatistics(user_id=user_id,
                               correct_answers_sports=0,
                               incorrect_answers_sports=0,
                               correct_answers_history=0,
                               incorrect_answers_history=0,
                               correct_answers_science=0,
                               incorrect_answers_science=0,
                               correct_answers_geography=0,
                               incorrect_answers_geography=0,
                               correct_answers_math=0,
                               incorrect_answers_math=0)
        db.session.add(stats)


    # Обновляем статистику в зависимости от категории
    if category == "sports":
        if is_correct:
            stats.correct_answers_sports += 1
        else:
            stats.incorrect_answers_sports += 1
    elif category == "history":
        if is_correct:
            stats.correct_answers_history += 1
        else:
            stats.incorrect_answers_history += 1
    elif category == "science":
        if is_correct:
            stats.correct_answers_science += 1
        else:
            stats.incorrect_answers_science += 1
    elif category == "geography":
        if is_correct:
            stats.correct_answers_geography += 1
        else:
            stats.incorrect_answers_geography += 1
    elif category == "math":
        if is_correct:
            stats.correct_answers_math += 1
        else:
            stats.incorrect_answers_math += 1


    db.session.commit()


@quiz_bp.route('/api/submit_answer', methods=['POST'])
def submit_answer():
    data = request.json
    user_id = data['user_id']
    question_id = data['question_id']
    user_answer = data['user_answer']


    # Проверяем существование пользователя
    user = User.query.get(user_id)
    if user is None:
        return jsonify({"error": "Пользователь не найден"}), 404

    # Проверяем существование вопроса
    question = Question.query.get(question_id)
    if question is None:
        return jsonify({"error": "Вопрос не найден"}), 404

    # Проверяем, правильный ли ответ
    is_correct = user_answer == question.correct_answer

    # Обновляем статистику, если запись существует
    try:
        update_user_statistics(user_id, question.category, is_correct)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return jsonify({"correct": is_correct})


@quiz_bp.route('/api/register_user', methods=['POST'])
def register_user():
    data = request.json
    nickname = data['nickname']

    if User.query.filter_by(nickname=nickname).first() is not None:
        return jsonify({"error": "Пользователь с таким ником уже существует."}), 400

    new_user = User(nickname=nickname)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"id": new_user.id, "nickname": new_user.nickname})


@quiz_bp.route('/api/user_statistics/<int:user_id>', methods=['GET'])
def get_user_statistics(user_id):
    # Получаем статистику пользователя
    stats = UserStatistics.query.filter_by(user_id=user_id).first()

    if stats is None:
        return jsonify({"error": "Статистика не найдена"}), 404

    return jsonify({
        "user_id": user_id,
        "correct_answers": {
            "sports": stats.correct_answers_sports,
            "history": stats.correct_answers_history,
            "science": stats.correct_answers_science,
            "geography": stats.correct_answers_geography,
            "math": stats.correct_answers_math,
        },
        "incorrect_answers": {
            "sports": stats.incorrect_answers_sports,
            "history": stats.incorrect_answers_history,
            "science": stats.incorrect_answers_science,
            "geography": stats.incorrect_answers_geography,
            "math": stats.incorrect_answers_math,
        }
    })
