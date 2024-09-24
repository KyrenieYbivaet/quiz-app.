import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

const QuizContainer = styled.div`
    padding: 20px;
    text-align: center;
`

const Question = styled.h3`
    margin: 20px 0;
`

const AnswerButton = styled.button`
    margin: 10px;
    padding: 10px 20px;
    background-color: #f0f0f0;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
        background-color: #d3d3d3;
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

const Quiz = ({ onBack, selectedCategory }) => {
    const [questions, setQuestions] = useState([])
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState(null)
    const [score, setScore] = useState(0)
    const [isQuizCompleted, setIsQuizCompleted] = useState(false)

    useEffect(() => {
        if (!selectedCategory) {
            console.error('Category not selected')
            return
        }

        const fetchQuestions = async () => {
            try {
                const response = await fetch(
                    `http://127.0.0.1:5000/api/new_question/${selectedCategory}`
                )
                const data = await response.json()

                const formattedQuestions = [
                    {
                        question: data.text,
                        correctAnswer: data.correct_answer,
                        answers: data.options,
                    },
                ]

                setQuestions(formattedQuestions)
            } catch (error) {
                console.error('Error loading questions:', error)
            }
        }

        fetchQuestions()
    }, [selectedCategory])

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
        return <p>Loading questions...</p>
    }

    if (isQuizCompleted) {
        return (
            <QuizContainer>
                <h2>Quiz Completed!</h2>
                <p>
                    Your score: {score} out of {questions.length}
                </p>
                <NextButton onClick={onBack}>Back to Topics</NextButton>
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
                        ? 'Finish'
                        : 'Next Question'}
                </NextButton>
            )}
        </QuizContainer>
    )
}

export default Quiz
