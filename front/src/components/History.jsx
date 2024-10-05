function History({ history }) {
    if (history.length === 0) {
        return <div>История пуста</div>
    }

    return (
        <div>
            <h2>История тестов</h2>
            <ul>
                {history.map((item, index) => (
                    <li key={index}>
                        Тема: {item.topic} — Результат: {item.score} / 5
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default History
