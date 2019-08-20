import React from 'react';
import styled from 'styled-components';
import CircularProgress from '@material-ui/core/CircularProgress';

const StyledDiv = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const StyledLoader = styled(CircularProgress)`
    && {
        color: #6441a4;
    }
`;

const Loading = ({ height, width }) => {
    return (
        <StyledDiv style={{ backgroundColor: 'transparent' }}>
            <StyledLoader style={{ height, width }} />
        </StyledDiv>
    );
};

export default Loading;
