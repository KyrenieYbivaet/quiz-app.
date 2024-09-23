from flask import request, jsonify
from back.app import app, db
from back.models import Question, UserAnswer, TestResult

# Инициализация Wikipedia API
import wikipediaapi

user_agent = "quiz-app/1.0 (https://t.me/smokingkillsu; gleb200320104518@yandex.ru)"  # Задай свои данные
wiki_wiki = wikipediaapi.Wikipedia(
    language='ru',
    user_agent=user_agent
)



@app.route('/api/questions', methods=['GET'])
def get_questions():
    questions = []
    # Генерация вопросов из Wikipedia (это упрощенный пример)
    page = wiki_wiki.page('Python_(programming_language)')
    question_text = f"Что такое {page.title}?"
    correct_answer = page.summary.split('.')[0]  # Первый факт как правильный ответ
    options = [correct_answer, "Java", "C++", "JavaScript"]

    question = Question(text=question_text, correct_answer=correct_answer, options=",".join(options))
    db.session.add(question)
    db.session.commit()

    questions.append({
        "id": question.id,
        "text": question.text,
        "options": options
    })
    return jsonify(questions)


@app.route('/api/submit-answers', methods=['POST'])
def submit_answers():
    data = request.get_json()
    user_id = data['user_id']
    answers = data['answers']  # [{"question_id": 1, "answer": "Python"}]

    correct_count = 0
    for answer in answers:
        question = Question.query.get(answer['question_id'])
        is_correct = question.correct_answer == answer['answer']
        correct_count += 1 if is_correct else 0

        user_answer = UserAnswer(
            question_id=question.id,
            user_answer=answer['answer'],
            is_correct=is_correct
        )
        db.session.add(user_answer)

    result = TestResult(user_id=user_id, score=correct_count, total_questions=len(answers))
    db.session.add(result)
    db.session.commit()

    return jsonify({"score": correct_count, "total": len(answers)})

