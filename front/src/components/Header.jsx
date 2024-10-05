import React, { useState } from 'react'
import styled from 'styled-components'
import LoginModal from './LoginModal'

const HeaderContainer = styled.header`
    background-color: #282c34;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    color: white;
`

const LoginButton = styled.div`
    cursor: pointer;
    padding: 8px 16px;
    background-color: #61dafb;
    border-radius: 4px;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #21a1f1;
    }
`

const Header = ({ onLoginClick }) => {
    const [showModal, setShowModal] = useState(false) // Состояние для модального окна
    const handleShowModal = () => setShowModal(true) // Открытие модального окна
    const handleCloseModal = () => setShowModal(false) // Закрытие модального окна
    return (
        <HeaderContainer>
            <h1>Quiz App</h1>
            <LoginModal show={showModal} handleClose={handleCloseModal} />{' '}
        </HeaderContainer>
    )
}

export default Header
