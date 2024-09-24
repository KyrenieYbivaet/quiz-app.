import React, { useState } from 'react'
import styled from 'styled-components'
import Quiz from './Quiz'

const topics = ['history', 'math', 'science', 'geography', 'sports']

const TopicContainer = styled.div`
    padding: 20px;
    text-align: center;
`

const Topic = styled.div`
    margin: 10px 0;
    padding: 10px;
    background-color: #f0f0f0;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
        background-color: #e0e0e0;
    }
`

const BackButton = styled.button`
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

const StartButton = styled.button`
    margin-left: 10px;
    padding: 10px 20px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
        background-color: #218838;
    }
`

const TopicList = () => {
    const [selectedTopic, setSelectedTopic] = useState(null)
    const [isQuizStarted, setIsQuizStarted] = useState(false)

    const handleTopicClick = topic => {
        setSelectedTopic(topic)
    }

    const handleBackClick = () => {
        setSelectedTopic(null)
        setIsQuizStarted(false)
    }

    const handleStartTest = () => {
        setIsQuizStarted(true)
    }

    if (isQuizStarted) {
        return (
            <Quiz onBack={handleBackClick} selectedCategory={selectedTopic} />
        ) // Added semicolon here
    }

    return (
        <TopicContainer>
            <h2>Select a Topic</h2>
            {selectedTopic ? (
                <>
                    <Topic>{selectedTopic}</Topic>
                    <div>
                        <BackButton onClick={handleBackClick}>
                            Back to Topics
                        </BackButton>
                        <StartButton onClick={handleStartTest}>
                            Start Test
                        </StartButton>
                    </div>
                </>
            ) : (
                topics.map((topic, index) => (
                    <Topic key={index} onClick={() => handleTopicClick(topic)}>
                        {topic}
                    </Topic>
                ))
            )}
        </TopicContainer>
    )
}

export default TopicList
