
import React, { useState } from 'react'
import Header from './components/Header'
import TopicList from './components/TopicList'
import LoginModal from './components/LoginModal' // Импортируем модальное окно

const App = () => {
    const [showModal, setShowModal] = useState(false) // Состояние для модального окна

    const handleShowModal = () => setShowModal(true) // Открытие модального окна
    const handleCloseModal = () => setShowModal(false) // Закрытие модального окна

    return (
        <div>
            <Header onLoginClick={handleShowModal} />{' '}
            {/* Передаем функцию открытия в Header */}
            <TopicList />
            {/* Модальное окно */}
        </div>
    )
}

export default App
