import React, { useState } from 'react';
import styled from 'styled-components';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import Loading from '../styled/Loading';
import Paper from '@material-ui/core/Paper';
import StyledButton from '../styled/Button';
import InfoDialog from '../styled/InfoDialog';

const StyledListContainer = styled(Paper)`
    && {
        width: 95%;
        margin: 0;
        height: 298px;
        border-radius: 0px;
        color: ${props => (props.theme === 'light' ? '#000000' : '#ffffff')};
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

    :last-child {
        border: ${props => (props.songslength === 6 ? 'none' : '')};
    }
`;

const StyledListItem = styled.li`
    display: flex;
    border-bottom: ${props =>
        props.theme === 'light' ? '1px solid #e2e2e2' : '1px solid  #6441a4'};
    padding: 5px;
    height: 39px;
    justify-content: center;
    align-items: center;
    :hover {
        cursor: pointer;
        background-color: ${props =>
            props.theme === 'light' ? '#f1f1f1' : '#272727'};
    }
`;

const SongInfoDiv = styled.span`
    display: flex;
    width: 110px;
    flex: 1 0 110px;
    flex-direction: column;
    font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
    color: ${props => (props.theme === 'light' ? '#000000' : '#ffffff')};
`;

const SongTextDiv = styled.span`
    flex: 1;
    font-size: ${props => props.fontSize};
    font-weight: ${props => props.fontWeight};
    letter-spacing: -0.2px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
`;

const RequestedDiv = styled.span`
    width: 80px;
    flex: 1 0 80px;
    font-size: ${props => props.fontSize};
    font-weight: ${props => props.fontWeight};
    letter-spacing: -0.2px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
`;

const IndexDiv = styled.span`
    width: 20px;
    flex: 0 0 20px;
    font-size: ${props => props.fontSize};
    font-weight: ${props => props.fontWeight};
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
`;

const DELETE_SONG_FROM_QUEUE = gql`
    mutation DELETE_SONG_FROM_QUEUE($queueId: String!, $songId: String!) {
        deleteSongInQueue(queueId: $queueId, songId: $songId) {
            song {
                id
                title
                artist
            }
        }
    }
`;

const QueueSongList = ({
    skip,
    songs,
    handleSuccess,
    handleError,
    theme,
    queueSongCount
}) => {
    const [open, setOpen] = useState(false);
    const [selectedSong, setSelectedSong] = useState(null);
    const [deleteSongFromQueue, { loading, data, error }] = useMutation(
        DELETE_SONG_FROM_QUEUE,
        {
            onCompleted: () => handleSuccess('Song Removed from Queue!'),
            onError: error => handleError(error)
        }
    );

    const handleClickOpen = song => {
        setOpen(true);
        setSelectedSong(song);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const renderRows = () =>
        songs.map((song, index) => (
            <StyledListItem
                key={song.id}
                theme={theme}
                onClick={() => handleClickOpen(song)}
            >
                <IndexDiv fontSize="12px" fontWeight="bold">
                    {skip + index + 1}
                </IndexDiv>
                <SongInfoDiv theme={theme}>
                    <SongTextDiv fontSize="16px" fontWeight="bold">
                        {song.song.title}
                    </SongTextDiv>
                    <SongTextDiv fontSize="12px" fontWeight="400">
                        {song.song.artist}
                    </SongTextDiv>
                </SongInfoDiv>
                <RequestedDiv fontSize="16px" fontWeight="bold">
                    {song.requestedBy}
                </RequestedDiv>
                <StyledButton
                    buttoncolor={'#6441a4'}
                    textsize="12px"
                    padding="5px"
                    disabled={loading}
                    onClick={async e => {
                        e.stopPropagation();
                        await deleteSongFromQueue({
                            variables: {
                                queueId: song.id,
                                songId: song.song.id
                            }
                        });
                    }}
                >
                    Remove
                </StyledButton>
            </StyledListItem>
        ));

    return (
        <StyledListContainer theme={theme} songslength={songs && songs.length}>
            {songs ? (
                <StyledList songslength={queueSongCount}>
                    {songs ? renderRows() : null}
                </StyledList>
            ) : (
                <Loading height="40px" width="40px" />
            )}
            <InfoDialog
                selectedSong={selectedSong}
                open={open}
                onClose={handleClose}
                theme={theme}
            />
        </StyledListContainer>
    );
};

export default QueueSongList;
