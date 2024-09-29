import React from 'react'
import { Link } from 'react-router-dom'

const Header = ({ isAuthenticated, onLogout }) => {
    return (
        <header className='header'>
            <div className='logo'>QuizApp</div>
            <div className='auth-buttons'>
                {isAuthenticated ? (
                    <>
                        <span>Имя пользователя</span>
                        <button onClick={onLogout}>Выход</button>
                    </>
                ) : null}{' '}
                {/* Здесь ничего не отображаем, если не авторизован */}
            </div>
        </header>
    )
}

export default Header
