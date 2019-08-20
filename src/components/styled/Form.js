import React, { useState } from 'react';
import styled from 'styled-components';

import TextField from '@material-ui/core/TextField';
import StyledButton from './Button';
import '../../Panel.css';

const StyledForm = styled.form`
    text-align: center;
    margin: 40px auto;
    max-width: 400px;
    width: 100%;
`;

const StyledTextField = styled(TextField)`
    && {
        text-align: center;
        margin-top: 20px;
        min-width: 80%;

        label {
            color: ${props => (props.theme === 'light' ? null : '#ffffff')};
        }

        div input {
            color: ${props => (props.theme === 'light' ? null : '#ffffff')};
        }

        .MuiInput-underline:before {
            border-bottom: ${props =>
                props.theme === 'light'
                    ? null
                    : '1px solid rgba(255, 255, 255, 0.42)'};
        }

        .MuiInput-underline:after {
            border-bottom: ${props =>
                props.theme === 'light'
                    ? '2px solid #6441a4'
                    : '2px solid #6441a4'};
        }
    }
`;

const Form = ({ handleSubmit, children, disabled, theme }) => {
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [titleError, setTitleError] = useState(false);
    const [artistError, setArtistError] = useState(false);

    const submitForm = e => {
        e.preventDefault();
        if (title.match(/^\s*$/)) {
            setTitleError(true);
        }

        if (artist.match(/^\s*$/)) {
            setArtistError(true);
        }

        if (artist.match(/^\s*$/) || title.match(/^\s*$/)) {
            return;
        }

        handleSubmit(title, artist);

        setTitle('');
        setArtist('');
    };

    const onChangeTitle = e => {
        if (e.target.value.match(/^\s*$/)) {
            setTitleError(true);
        } else {
            setTitleError(false);
        }

        setTitle(e.target.value);
    };

    const onChangeArtist = e => {
        if (e.target.value.match(/^\s*$/)) {
            setArtistError(true);
        } else {
            setArtistError(false);
        }

        setArtist(e.target.value);
    };

    return (
        <StyledForm noValidate autoComplete="off" onSubmit={submitForm}>
            <h2
                style={{
                    margin: '5px 0',
                    fontFamily: '"Montserrat", sans-serif'
                }}
            >
                {children}
            </h2>
            <StyledTextField
                id="title-input"
                label="Title"
                value={title}
                error={titleError}
                theme={theme}
                helperText={titleError ? 'You must enter something!' : ''}
                type="text"
                margin="normal"
                onChange={e => onChangeTitle(e)}
            />
            <br />
            <StyledTextField
                id="artist-input"
                label="Artist"
                value={artist}
                error={artistError}
                theme={theme}
                helperText={artistError ? 'You must enter something!' : ''}
                type="text"
                margin="normal"
                onChange={e => onChangeArtist(e)}
            />
            <br />
            <StyledButton
                buttoncolor="#6441a4"
                type="submit"
                size="large"
                disabled={disabled}
                style={{ margin: '20px', width: '150px' }}
            >
                Add
            </StyledButton>
        </StyledForm>
    );
};

export default Form;
