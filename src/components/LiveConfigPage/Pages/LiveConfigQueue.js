import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { useQuery, useMutation } from '@apollo/react-hooks';
import LiveConfigToolBar from '../LiveConfigToolBar';
import QueueSongList from '../QueueSongList';
import QueueHeader from '../QueueHeader';
import SnackBarComponent from '../../styled/SnackBarComponent';

const QUEUE_QUERY = gql`
    query QUEUE_QUERY(
        $first: Int
        $skip: Int
        $orderBy: QueueSongOrderByInput
    ) {
        queueSongs(first: $first, skip: $skip, orderBy: $orderBy) {
            id
            createdAt
            requestedBy
            song {
                id
                title
                artist
            }
        }
    }
`;

const CLEAR_QUEUE = gql`
    mutation CLEAR_QUEUE {
        deleteAllSongsInQueue {
            count
        }
    }
`;

const QUEUE_SONGS_COUNT_QUERY = gql`
    query QUEUE_SONGS_COUNT_QUERY {
        queueSongCount
    }
`;

const StyledDiv = styled.div`
    display: grid;
    height: 100%;
    width: 100%;
    grid-template-columns: 1fr;
    grid-template-rows: 30px 300px 40px;
    grid-row-gap: 10px;
    justify-items: center;
    color: ${props => (props.theme === 'light' ? '#000000' : '#ffffff')};
    font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
`;

const LiveConfigQueue = ({ theme, twitch }) => {
    const [queueSongs, setQueueSongs] = useState(null);
    const [queueSongCount, setQueueSongCount] = useState(null);
    const [first, setFirst] = useState(6);
    const [skip, setSkip] = useState(0);
    const [orderBy, setOrderBy] = useState('createdAt_ASC');
    const [successMessage, setSuccessMessage] = useState('');
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [mutationError, setMutationError] = useState(null);
    const {
        data: fetchedQueueSongCount,
        refetch: queueSongsCountRefetch
    } = useQuery(QUEUE_SONGS_COUNT_QUERY, {
        fetchPolicy: 'network-only'
    });
    const { data: fetchedQueueSongs, refetch: queueSongsRefetch } = useQuery(
        QUEUE_QUERY,
        {
            fetchPolicy: 'network-only',
            variables: {
                first,
                skip,
                orderBy
            }
        }
    );
    const [
        clearQueue,
        { loading: clearQueueLoading, data, error }
    ] = useMutation(CLEAR_QUEUE, {
        onCompleted: () => handleSuccess('Queue cleared!'),
        onError: error => handleError(error)
    });

    const handleSkip = direction => {
        if (direction === 'prev' && skip - 6 >= 0) {
            setSkip(skip - 6);
        } else if (direction === 'next' && skip + 6 < queueSongCount) {
            setSkip(skip + 6);
        }
    };

    const handleSuccess = message => {
        setSuccessMessage(message);
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

    const handleClearQueue = () => {
        clearQueue();
    };

    useEffect(() => {
        twitch.listen('broadcast', (target, contentType, body) => {
            twitch.rig.log(
                `New PubSub message!\n${target}\n${contentType}\n${body}`
            );

            if (body === 'newQueueSong' || body === 'removeQueueSong') {
                queueSongsRefetch();
                queueSongsCountRefetch();
            }
        });

        return twitch.unlisten('broadcast', () =>
            console.log('successfully unlistened')
        );
    }, []);

    useEffect(() => {
        setQueueSongs(fetchedQueueSongs.queueSongs);
    }, [fetchedQueueSongs]);

    useEffect(() => {
        setQueueSongCount(fetchedQueueSongCount.queueSongCount);
    }, [fetchedQueueSongCount.queueSongCount]);

    return (
        <StyledDiv theme={theme}>
            <QueueHeader theme={theme} queueSongCount={queueSongCount} />
            <QueueSongList
                skip={skip}
                songs={queueSongs}
                queueSongCount={queueSongCount}
                buttonLabel="Request"
                buttonColor={'#6441A4'}
                handleSuccess={handleSuccess}
                handleError={handleError}
                theme={theme}
            />
            <LiveConfigToolBar
                handleSkip={handleSkip}
                theme={theme}
                disabled={clearQueueLoading}
                handleClearQueue={handleClearQueue}
                queueSongCount={queueSongCount}
                skip={skip}
            />
            <SnackBarComponent
                openSuccess={openSuccess}
                openError={openError}
                handleClose={handleClose}
                successMessage={successMessage}
                mutationError={mutationError}
            />
        </StyledDiv>
    );
};

export default LiveConfigQueue;
