import React from 'react'
import styled from 'styled-components'

const HeaderContainer = styled.header`
    background-color: #282c34;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
`

const Header = () => {
    return (
        <HeaderContainer>
            <h1>Quiz App</h1>
        </HeaderContainer>
    )
}

export default Header
