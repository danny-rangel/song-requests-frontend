import React from 'react';
import styled from 'styled-components';

import Paper from '@material-ui/core/Paper';
import Loading from '../styled/Loading';

const StyledQueueHeader = styled(Paper)`
    && {
        width: 95%;
        padding: 0 5px;
        margin: 0;
        box-sizing: border-box;
        height: 100%;
        display: flex;
        align-self: end;
        justify-content: flex-start;
        align-items: center;
        box-shadow: ${props =>
            props.theme === 'light'
                ? null
                : '0px 1px 3px 0px #6441a4,0px 1px 1px 0px #6441a4, 0px 2px 1px -1px #6441a4'};
        background-color: ${props =>
            props.theme === 'light' ? 'ffffff' : '#18161B'};
    }
`;

const StyledSpan = styled.span`
    text-transform: uppercase;
    font-size: 0.8rem;
    color: ${props => (props.theme === 'light' ? '#737272' : '#ffffff')};
`;

const QueueHeader = ({ theme, queueSongCount }) => {
    return (
        <StyledQueueHeader theme={theme}>
            <StyledSpan
                style={{
                    width: '116px',
                    flex: '1 0 116px',
                    margin: '0 0 0 20px'
                }}
                theme={theme}
            >
                song
            </StyledSpan>
            <StyledSpan
                style={{ width: '90px', flex: '1 0 90px' }}
                theme={theme}
            >
                req. by
            </StyledSpan>
            {queueSongCount || queueSongCount === 0 ? (
                <StyledSpan
                    style={{ width: '65px', flex: '0 0 65px' }}
                    theme={theme}
                >
                    {`${queueSongCount} song${queueSongCount === 1 ? '' : 's'}`}
                </StyledSpan>
            ) : (
                <Loading height="15px" width="15px" />
            )}
        </StyledQueueHeader>
    );
};

export default QueueHeader;
