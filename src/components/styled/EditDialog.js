import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import SnackBarComponent from './SnackBarComponent';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import StyledButton from './Button';
import '../../Panel.css';

const StyledTextField = styled(TextField)`
    && {
        text-align: center;
        margin: 10px;
        min-width: 60%;

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

const StyledDialog = styled(Dialog)`
    && {
        width: 100%;

        div {
            display: flex;
            align-items: center;
            justify-content: center;

            .MuiPaper-root.MuiPaper-elevation24.MuiDialog-paper.MuiDialog-paperScrollPaper.MuiDialog-paperWidthSm.MuiPaper-rounded {
                max-width: 400px;
                width: 85%;
                height: 370px;
                margin: 0;
                box-shadow: ${props =>
                    props.theme === 'light'
                        ? null
                        : '0px 1px 3px 0px #6441a4,0px 1px 1px 0px #6441a4, 0px 2px 1px -1px #6441a4'};
                background-color: ${props =>
                    props.theme === 'light' ? 'ffffff' : '#18161B'};
                color: ${props =>
                    props.theme === 'light' ? '#000000' : '#ffffff'};
            }
        }
    }
`;

const UDPATE_SONG = gql`
    mutation UDPATE_SONG($songId: String!, $title: String, $artist: String) {
        updateSong(songId: $songId, title: $title, artist: $artist) {
            songs {
                id
                title
                artist
            }
        }
    }
`;

const DELETE_SONG = gql`
    mutation DELETE_SONG($songId: String!) {
        deleteSong(songId: $songId) {
            songs {
                id
                title
                artist
            }
        }
    }
`;

const EditDialog = ({ onClose, selectedSong, open, theme, handleSuccess }) => {
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [titleError, setTitleError] = useState(false);
    const [artistError, setArtistError] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [mutationError, setMutationError] = useState(null);
    const [
        updateSong,
        { loading: updateLoading, data: updateData, error: updateError }
    ] = useMutation(UDPATE_SONG, {
        onCompleted: () => handleDialogSuccess('Song Updated!'),
        onError: error => handleError(error)
    });
    const [
        deleteSong,
        { loading: deleteLoading, data: deleteData, error: deleteError }
    ] = useMutation(DELETE_SONG, {
        onCompleted: () => handleDialogSuccess('Song Deleted!'),
        onError: error => handleError(error)
    });

    const handleDialogSuccess = message => {
        handleDialogClose();
        handleSuccess(message);
    };

    const handleError = error => {
        setMutationError(error.message.replace('GraphQL error: ', ''));
        setOpenError(true);
    };

    const handleClose = () => {
        setOpenError(false);
    };

    const submitForm = async id => {
        if (title.match(/^\s*$/)) {
            setTitleError(true);
        }

        if (artist.match(/^\s*$/)) {
            setArtistError(true);
        }

        if (artist.match(/^\s*$/) || title.match(/^\s*$/)) {
            return;
        }

        await updateSong({
            variables: { songId: id, title: title, artist: artist }
        });
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

    const handleDialogClose = () => {
        setTitleError(false);
        setArtistError(false);
        onClose();
    };

    useEffect(() => {
        if (selectedSong) {
            setArtist(selectedSong.artist);
            setTitle(selectedSong.title);
        }
    }, [selectedSong]);

    return (
        <StyledDialog
            onClose={handleDialogClose}
            aria-labelledby="simple-dialog-title"
            open={open}
            theme={theme}
        >
            <h2
                style={{
                    margin: '5px 0',
                    fontFamily: '"Montserrat", sans-serif'
                }}
            >
                Edit Song
            </h2>
            {selectedSong && (
                <React.Fragment>
                    <StyledTextField
                        theme={theme}
                        id="title-input"
                        label="Title"
                        value={title}
                        error={titleError}
                        helperText={
                            titleError ? 'You must enter something!' : ''
                        }
                        type="text"
                        margin="normal"
                        onChange={e => onChangeTitle(e)}
                    />
                    <StyledTextField
                        theme={theme}
                        id="artist-input"
                        label="Artist"
                        value={artist}
                        error={artistError}
                        helperText={
                            artistError ? 'You must enter something!' : ''
                        }
                        type="text"
                        margin="normal"
                        onChange={e => onChangeArtist(e)}
                    />
                    <StyledButton
                        buttoncolor="#6441a4"
                        type="submit"
                        size="medium"
                        disabled={deleteLoading || updateLoading}
                        style={{ margin: '15px', width: '100px' }}
                        onClick={() => submitForm(selectedSong.id)}
                    >
                        Save
                    </StyledButton>
                    <StyledButton
                        buttoncolor="#ff0000"
                        type="submit"
                        size="medium"
                        hovercolor="#ff7373"
                        disabled={deleteLoading || updateLoading}
                        style={{ margin: '15px', width: '100px' }}
                        onClick={() =>
                            deleteSong({
                                variables: {
                                    songId: selectedSong.id
                                }
                            })
                        }
                    >
                        Delete
                    </StyledButton>
                    <SnackBarComponent
                        openError={openError}
                        handleClose={handleClose}
                        mutationError={mutationError}
                    />
                </React.Fragment>
            )}
        </StyledDialog>
    );
};

export default EditDialog;
