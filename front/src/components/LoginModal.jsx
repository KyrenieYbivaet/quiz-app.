import React, { useState } from 'react'
import './LoginModal.css' // Если есть стили для модального окна

const LoginModal = ({ isRegister, onClose, onLogin }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = e => {
        e.preventDefault()
        if (!isRegister) {
            onLogin() // Логика для входа
        } else {
            console.log('Регистрация:', { username, password }) // Логика для регистрации
            onClose() // Закрытие модального окна
        }
    }

    return (
        <div className='modal'>
            <div className='modal-content'>
                <h2>{isRegister ? 'Регистрация' : 'Вход'}</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type='text'
                        placeholder='Логин'
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type='password'
                        placeholder='Пароль'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    <button type='submit'>
                        {isRegister ? 'Зарегистрироваться' : 'Войти'}
                    </button>
                    <button type='button' onClick={onClose}>
                        Закрыть
                    </button>
                </form>
            </div>
        </div>
    )
}

export default LoginModal
