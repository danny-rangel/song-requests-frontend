import React from 'react';
import styled from 'styled-components';
import Loading from '../styled/Loading';
import '../../Panel.css';

const StyledHeader = styled.header`
    grid-area: header;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    margin: 0;
    width: 100%;
    height: 100%;
    /* font-family: 'Montserrat', sans-serif; */
    word-break: break-all;
`;

const StyledImage = styled.img`
    border-radius: 50%;
    width: 55px;
    height: 55px;
    box-shadow: ${props =>
        props.theme === 'light'
            ? '0px 1px 2px #ffffff'
            : '0px 1px 2px #6441a4'};
`;

const StyledDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
`;

const StyledTitleText = styled.h1`
    font-size: 22px;
    margin: 0;
`;

const StyledText = styled.h1`
    font-size: 14px;
    margin: 0;
`;

const Header = ({ broadcaster, theme, children }) => {
    return (
        <StyledHeader>
            {broadcaster.broadcaster ? (
                <React.Fragment>
                    <StyledImage
                        src={broadcaster.broadcaster.profileImage}
                        theme={theme}
                    />
                    <StyledDiv>
                        <StyledTitleText>{children}</StyledTitleText>
                        <StyledText>
                            {broadcaster.broadcaster.username}
                        </StyledText>
                    </StyledDiv>
                </React.Fragment>
            ) : (
                <Loading height="40px" width="40px" />
            )}
        </StyledHeader>
    );
};

export default Header;
