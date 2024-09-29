import { Link } from 'react-router-dom'

const topics = ['geography', 'science', 'math', 'informatics', 'random']

function QuizSelection() {
    return (
        <div>
            <h1>Выберите тематику теста</h1>
            {topics.map(topic => (
                <div key={topic}>
                    <Link to={`/quiz/${topic}`}>
                        <button>{topic}</button>
                    </Link>
                </div>
            ))}
        </div>
    )
}

export default QuizSelection
