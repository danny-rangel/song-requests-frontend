import React from 'react';
import styled from 'styled-components';

import StyledButton from '../styled/Button';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';

const StyledNav = styled(Paper)`
    && {
        display: flex;
        flex-direction: row;
        width: 95%;
        margin-bottom: 10px;
        padding: 5px;
        box-sizing: border-box;
        justify-content: space-between;
        align-items: center;
        border-radius: 0px;
        box-shadow: ${props =>
            props.theme === 'light'
                ? null
                : '0px 1px 3px 0px #6441a4,0px 1px 1px 0px #6441a4, 0px 2px 1px -1px #6441a4'};
        background-color: ${props =>
            props.theme === 'light' ? 'ffffff' : '#18161B'};
    }
`;

const StyledIconButton = styled(IconButton)`
    && {
        padding: 0;
        color: ${props => (props.theme === 'light' ? '#000000' : '#ffffff')};

        :hover {
            background-color: ${props =>
                props.theme === 'light' ? '#e2e2e2' : '#6441a4'};
        }
    }
`;

const LiveConfigToolBar = ({
    handleSkip,
    handleClearQueue,
    theme,
    disabled
}) => {
    return (
        <StyledNav theme={theme}>
            <StyledIconButton
                aria-label="previous"
                color="inherit"
                theme={theme}
                onClick={() => handleSkip('prev')}
            >
                <ChevronLeft />
            </StyledIconButton>
            <StyledButton
                buttoncolor={'#6441a4'}
                height="22px"
                textsize="12px"
                padding="0px"
                disabled={disabled}
                onClick={() => handleClearQueue()}
            >
                Clear
            </StyledButton>
            <StyledIconButton
                aria-label="next"
                color="inherit"
                theme={theme}
                onClick={() => handleSkip('next')}
            >
                <ChevronRight />
            </StyledIconButton>
        </StyledNav>
    );
};

export default LiveConfigToolBar;
