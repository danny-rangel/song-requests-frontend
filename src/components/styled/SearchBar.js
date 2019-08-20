import React, { useState } from 'react';
import styled from 'styled-components';

import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';

const StyledSearch = styled(Paper)`
    && {
        width: 95%;
        margin: 0;
        box-sizing: border-box;
        height: 100%;
        align-self: center;
        display: flex;
        box-shadow: ${props =>
            props.theme === 'light'
                ? null
                : '0px 1px 3px 0px #6441a4,0px 1px 1px 0px #6441a4, 0px 2px 1px -1px #6441a4'};
        background-color: ${props =>
            props.theme === 'light' ? 'ffffff' : '#18161B'};
    }
`;

const StyledInputBase = styled(InputBase)`
    && {
        flex: 1;
        padding: 6px;
        border-radius: 4px;
        input {
            color: ${props =>
                props.theme === 'light' ? '#000000' : '#ffffff'};
            padding: 0;
            font-size: 18px;
        }
    }
`;

const SearchBar = ({ placeholder, handleSearch, theme }) => {
    const [term, setTerm] = useState('');

    const changeTerm = e => {
        setTerm(e.target.value);
        handleSearch(e.target.value);
    };

    return (
        <StyledSearch theme={theme}>
            <Tooltip
                interactive
                enterDelay={200}
                leaveDelay={200}
                title="Case sensitive!"
                placement="top"
                TransitionComponent={Zoom}
            >
                <StyledInputBase
                    theme={theme}
                    value={term}
                    placeholder={placeholder}
                    inputProps={{ 'aria-label': `${placeholder}` }}
                    onChange={e => changeTerm(e)}
                />
            </Tooltip>
        </StyledSearch>
    );
};

export default SearchBar;
