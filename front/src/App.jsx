import './App.css'
import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import QuizSelection from './components/QuizSelection'
import History from './components/History'
import LoginModal from './components/LoginModal'

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [isRegister, setIsRegister] = useState(false)
    const [username, setUsername] = useState('Имя пользователя') // Пример имени пользователя

    const handleLogin = username => {
        setUsername(username) // Установите имя пользователя после входа
        setIsAuthenticated(true)
        setModalOpen(false)
    }

    const handleLogout = () => {
        setIsAuthenticated(false)
        setUsername('Имя пользователя') // Сбросьте имя пользователя при выходе
    }

    return (
        <Router>
            <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
            <div className='main-content'>
                {!isAuthenticated ? (
                    <>
                        <h1>Добро пожаловать в QuizApp!</h1>
                        <div className='auth-buttons'>
                            <button
                                onClick={() => {
                                    setIsRegister(false)
                                    setModalOpen(true)
                                }}
                            >
                                Вход
                            </button>
                            <button
                                onClick={() => {
                                    setIsRegister(true)
                                    setModalOpen(true)
                                }}
                            >
                                Регистрация
                            </button>
                        </div>
                        {modalOpen && (
                            <LoginModal
                                isRegister={isRegister}
                                onClose={() => setModalOpen(false)}
                                onLogin={handleLogin}
                            />
                        )}
                    </>
                ) : (
                    <QuizSelection />
                )}
            </div>
            <Routes>
                <Route path='/history' element={<History />} />
            </Routes>
        </Router>
    )
}

export default App
