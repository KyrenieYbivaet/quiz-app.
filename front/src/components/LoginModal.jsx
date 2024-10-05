import React, { useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'

const LoginModal = () => {
    const [show, setShow] = useState(false)
    const [isLogin, setIsLogin] = useState(true)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const handleClose = () => {
        setShow(false)
        // Сброс полей при закрытии
        setUsername('')
        setPassword('')
        setConfirmPassword('')
    }
    const handleShow = () => setShow(true)

    const toggleMode = () => setIsLogin(!isLogin)

    const handleSubmit = e => {
        e.preventDefault()

        if (isLogin) {
            // Проверка данных для входа
            const storedPassword = localStorage.getItem(username)
            if (storedPassword === password) {
                alert('Успешный вход!')
                handleClose()
            } else {
                alert('Неверный логин или пароль')
            }
        } else {
            // Регистрация пользователя
            if (password === confirmPassword) {
                localStorage.setItem(username, password)
                alert('Регистрация успешна! Теперь вы можете войти.')
                toggleMode() // Переключаем на форму входа
            } else {
                alert('Пароли не совпадают')
            }
        }
    }

    return (
        <>
            <Button variant='primary' onClick={handleShow}>
                {isLogin ? 'Войти' : 'Зарегистрироваться'}
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {isLogin ? 'Вход' : 'Регистрация'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId='formBasicLogin'>
                            <Form.Label>Логин</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Введите логин'
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId='formBasicPassword'>
                            <Form.Label>Пароль</Form.Label>
                            <Form.Control
                                type='password'
                                placeholder='Введите пароль'
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </Form.Group>

                        {!isLogin && (
                            <Form.Group controlId='formBasicConfirmPassword'>
                                <Form.Label>Подтвердите пароль</Form.Label>
                                <Form.Control
                                    type='password'
                                    placeholder='Подтвердите пароль'
                                    value={confirmPassword}
                                    onChange={e =>
                                        setConfirmPassword(e.target.value)
                                    }
                                />
                            </Form.Group>
                        )}

                        <Button variant='primary' type='submit'>
                            {isLogin ? 'Войти' : 'Зарегистрироваться'}
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={handleClose}>
                        Закрыть
                    </Button>
                </Modal.Footer>
                <div className='text-center mb-3'>
                    <Button variant='link' onClick={toggleMode}>
                        {isLogin
                            ? 'Нет аккаунта? Зарегистрируйтесь'
                            : 'Уже есть аккаунт? Войти'}
                    </Button>
                </div>
            </Modal>
        </>
    )
}

export default LoginModal
