import React from 'react';
import styled from 'styled-components';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import Loading from '../styled/Loading';
import Paper from '@material-ui/core/Paper';
import StyledButton from '../styled/Button';

const StyledListContainer = styled(Paper)`
    && {
        width: 95%;
        margin: 0;
        height: 298px;
        border-radius: 0px;
        box-shadow: ${props =>
            props.theme === 'light'
                ? null
                : '0px 1px 3px 0px #6441a4,0px 1px 1px 0px #6441a4, 0px 2px 1px -1px #6441a4'};
        background-color: ${props =>
            props.theme === 'light' ? 'ffffff' : '#18161B'};
    }
`;

const StyledList = styled.ul`
    margin: 0;
    list-style: none;
    padding: 0;

    li:last-child {
        border: ${props => (props.songslength === 5 ? 'none' : '')};
    }
`;

const StyledListItem = styled.li`
    display: flex;
    border-bottom: ${props =>
        props.theme === 'light' ? '1px solid #e2e2e2' : '1px solid  #6441a4'};
    padding: 10px;
    height: 39px;
    justify-content: center;
    align-items: center;
`;

const SongInfoDiv = styled.span`
    display: flex;
    padding: 3px;
    width: 200px;
    flex: 1 0 200px;
    flex-direction: column;
    color: ${props => (props.theme === 'light' ? '#000000' : '#ffffff')};
`;

const SongTextDiv = styled.span`
    flex: 1;
    font-size: ${props => props.fontSize};
    font-weight: ${props => props.fontWeight};
    letter-spacing: -0.4px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
`;

const ADD_SONG_TO_QUEUE_MUTATION = gql`
    mutation ADD_SONG_TO_QUEUE_MUTATION($songId: String!) {
        addSongToQueue(songId: $songId) {
            id
            song {
                id
                title
                artist
            }
        }
    }
`;

const SongList = ({ songs, handleSuccess, handleError, theme }) => {
    const [addSongToQueue, { loading }] = useMutation(
        ADD_SONG_TO_QUEUE_MUTATION,
        {
            onCompleted: handleSuccess,
            onError: error => handleError(error)
        }
    );

    const renderRows = () =>
        songs.map(song => (
            <StyledListItem key={song.id} theme={theme}>
                <SongInfoDiv theme={theme}>
                    <SongTextDiv fontSize="16px" fontWeight="bold">
                        {song.title}
                    </SongTextDiv>
                    <SongTextDiv fontSize="12px" fontWeight="400">
                        {song.artist}
                    </SongTextDiv>
                </SongInfoDiv>
                <StyledButton
                    buttoncolor={'#6441a4'}
                    disabled={loading || song.inQueue}
                    textsize="12px"
                    padding="5px"
                    onClick={async () => {
                        await addSongToQueue({
                            variables: { songId: song.id }
                        });
                    }}
                >
                    Request
                </StyledButton>
            </StyledListItem>
        ));

    return (
        <StyledListContainer theme={theme} songslength={songs && songs.length}>
            {songs ? (
                <StyledList songslength={songs.length}>
                    {songs ? renderRows() : null}
                </StyledList>
            ) : (
                <Loading height="40px" width="40px" />
            )}
        </StyledListContainer>
    );
};

export default SongList;
