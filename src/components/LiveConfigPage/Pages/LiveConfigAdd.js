import React, { useState } from 'react';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { useMutation } from '@apollo/react-hooks';

import Paper from '@material-ui/core/Paper';
import SnackBarComponent from '../../styled/SnackBarComponent';
import Form from '../../styled/Form';

const StyledPaper = styled(Paper)`
    && {
        width: 95%;
        max-width: 600px;
        margin: 0;
        border-radius: 0px;
        max-height: 350px;
        box-shadow: ${props =>
            props.theme === 'light'
                ? null
                : '0px 1px 3px 0px #6441a4,0px 1px 1px 0px #6441a4, 0px 2px 1px -1px #6441a4'};
        background-color: ${props =>
            props.theme === 'light' ? 'ffffff' : '#18161B'};
        color: ${props => (props.theme === 'light' ? '#000000' : '#ffffff')};
    }
`;

const CREATE_SONG = gql`
    mutation CREATE_SONG($title: String!, $artist: String!) {
        createSong(title: $title, artist: $artist) {
            id
            title
            artist
            createdAt
            broadcaster {
                id
            }
        }
    }
`;

const LiveConfigAdd = ({ theme }) => {
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [mutationError, setMutationError] = useState(null);
    const [createSong, { loading, data, error }] = useMutation(CREATE_SONG, {
        onCompleted: () => handleSuccess(),
        onError: error => handleError(error)
    });

    const handleSuccess = () => {
        setOpenSuccess(true);
    };

    const handleError = error => {
        setMutationError(error.message.replace('GraphQL error: ', ''));
        setOpenError(true);
    };

    const handleClose = () => {
        setOpenSuccess(false);
        setOpenError(false);
    };

    const handleSubmit = async (title, artist) => {
        await createSong({
            variables: { title: title, artist: artist }
        });
    };

    return (
        <StyledPaper theme={theme}>
            <Form handleSubmit={handleSubmit} disabled={loading} theme={theme}>
                Add a Song
            </Form>
            <SnackBarComponent
                openSuccess={openSuccess}
                openError={openError}
                handleClose={handleClose}
                successMessage="Song created!"
                mutationError={mutationError}
            />
        </StyledPaper>
    );
};

export default LiveConfigAdd;
