import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

const QuizContainer = styled.div`
    padding: 20px;
    text-align: center;
`

const Question = styled.h2`
    margin-bottom: 20px;
`

const AnswerButton = styled.button`
    display: block;
    margin: 10px auto;
    padding: 10px 20px;
    background-color: #f0f0f0;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background-color: #e0e0e0;
    }
`

const NextButton = styled.button`
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background-color: #0056b3;
    }
`

const Quiz = ({ onBack }) => {
    const [questions, setQuestions] = useState([])
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState(null)
    const [score, setScore] = useState(0)
    const [isQuizCompleted, setIsQuizCompleted] = useState(false)

    useEffect(() => {
        fetch('/questions.json')
            .then(response => response.json())
            .then(data => {
                setQuestions(data)
            })
    }, [])

    const handleAnswerClick = answer => {
        setSelectedAnswer(answer)
    }

    const handleNextQuestion = () => {
        const currentQuestion = questions[currentQuestionIndex]

        if (selectedAnswer === currentQuestion.correctAnswer) {
            setScore(score + 1)
        }

        const nextIndex = currentQuestionIndex + 1
        if (nextIndex < questions.length) {
            setCurrentQuestionIndex(nextIndex)
            setSelectedAnswer(null)
        } else {
            setIsQuizCompleted(true)
        }
    }

    if (questions.length === 0) {
        return <p>Загрузка вопросов...</p>
    }

    if (isQuizCompleted) {
        return (
            <QuizContainer>
                <h2>Викторина завершена!</h2>
                <p>
                    Ваш результат: {score} из {questions.length}
                </p>
                <NextButton onClick={onBack}>Назад к тематикам</NextButton>
            </QuizContainer>
        )
    }

    const currentQuestion = questions[currentQuestionIndex]

    return (
        <QuizContainer>
            <Question>{currentQuestion.question}</Question>
            {currentQuestion.answers.map((answer, index) => (
                <AnswerButton
                    key={index}
                    onClick={() => handleAnswerClick(answer)}
                    style={{
                        backgroundColor:
                            selectedAnswer === answer ? '#d3d3d3' : '#f0f0f0',
                    }}
                >
                    {answer}
                </AnswerButton>
            ))}
            {selectedAnswer && (
                <NextButton onClick={handleNextQuestion}>
                    {currentQuestionIndex + 1 === questions.length
                        ? 'Завершить'
                        : 'Следующий вопрос'}
                </NextButton>
            )}
        </QuizContainer>
    )
}

export default Quiz
