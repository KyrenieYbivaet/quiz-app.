import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Question from './Question'

function Quiz({ user, setHistory }) {
    const { topic } = useParams()
    const [questions, setQuestions] = useState([])
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [score, setScore] = useState(0)
    const [completed, setCompleted] = useState(false)

    useEffect(() => {
        // Загрузка вопросов (пример вопросов)
        setQuestions([
            {
                question: 'What is the capital of France?',
                options: ['Paris', 'London', 'Berlin', 'Madrid'],
                correct: 0,
            },
            // Еще 4 вопроса
        ])
    }, [topic])

    const handleAnswer = isCorrect => {
        if (isCorrect) setScore(score + 1)
        if (currentQuestionIndex + 1 === questions.length) {
            setCompleted(true)
            setHistory(prev => [...prev, { topic, score }])
        } else {
            setCurrentQuestionIndex(currentQuestionIndex + 1)
        }
    }

    if (completed) {
        return <div>Тест завершен. Ваш результат: {score} / 5</div>
    }

    return (
        <div>
            <Question
                data={questions[currentQuestionIndex]}
                onAnswer={handleAnswer}
            />
        </div>
    )
}

export default Quiz
