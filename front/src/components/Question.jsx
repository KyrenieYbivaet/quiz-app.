import { useState } from 'react'

function Question({ data, onAnswer }) {
    const [selected, setSelected] = useState(null)

    const handleSelect = index => {
        setSelected(index)
        onAnswer(index === data.correct)
    }

    return (
        <div>
            <h2>{data.question}</h2>
            <ul>
                {data.options.map((option, index) => (
                    <li
                        key={index}
                        style={{
                            color:
                                selected === index
                                    ? index === data.correct
                                        ? 'green'
                                        : 'red'
                                    : '',
                        }}
                    >
                        <button onClick={() => handleSelect(index)}>
                            {option}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Question
