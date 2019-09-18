import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import _ from 'lodash';

import LiveConfigSongList from '../LiveConfigSongList';
import SearchBar from '../../styled/SearchBar';
import Navigation from '../../PanelPage/Navigation';
import SnackBarComponent from '../../styled/SnackBarComponent';

const StyledDiv = styled.div`
    display: grid;
    height: 100%;
    width: 100%;
    grid-template-columns: 1fr;
    grid-template-rows: 50px 300px 40px;
    grid-row-gap: 10px;
    justify-items: center;
`;

const SONGS_QUERY = gql`
    query SONGS_QUERY(
        $first: Int
        $skip: Int
        $orderBy: SongOrderByInput
        $query: String
    ) {
        songs(first: $first, skip: $skip, orderBy: $orderBy, query: $query) {
            id
            title
            artist
            createdAt
        }
    }
`;

const SONGS_COUNT_QUERY = gql`
    query SONGS_COUNT_QUERY {
        songCount
    }
`;

const LiveConfigSongs = ({ theme, twitch, location }) => {
    const [songs, setSongs] = useState(null);
    const [songCount, setSongCount] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searching, setSearching] = useState(false);
    const [first, setFirst] = useState(5);
    const [skip, setSkip] = useState(0);
    const [orderBy, setOrderBy] = useState('artist_ASC');
    const [openSuccess, setOpenSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [openError, setOpenError] = useState(false);
    const [mutationError, setMutationError] = useState(null);
    const { data: fetchedSongCount, refetch: refetchSongsCount } = useQuery(
        SONGS_COUNT_QUERY
    );
    const { data: fetchedSongs, refetch: refetchSongs } = useQuery(
        SONGS_QUERY,
        {
            variables: { query: searchTerm, skip, first, orderBy }
        }
    );

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

    const handleSearch = _.debounce(async term => {
        setSearching(true);
        setSearchTerm(term);
    }, 300);

    const handleSkip = direction => {
        if (direction === 'prev' && skip - 5 >= 0) {
            setSkip(skip - 5);
        } else if (direction === 'next' && skip + 5 < songCount) {
            setSkip(skip + 5);
        }
    };

    const handleSort = order => {
        if (order === 'artist') {
            if (orderBy === 'title_ASC' || orderBy === 'title_DESC') {
                setOrderBy('artist_ASC');
            } else if (orderBy === 'artist_ASC') {
                setOrderBy('artist_DESC');
            } else if (orderBy === 'artist_DESC') {
                setOrderBy('artist_ASC');
            }
        } else if (order === 'title') {
            if (orderBy === 'artist_ASC' || orderBy === 'artist_DESC') {
                setOrderBy('title_ASC');
            } else if (orderBy === 'title_ASC') {
                setOrderBy('title_DESC');
            } else if (orderBy === 'title_DESC') {
                setOrderBy('title_ASC');
            }
        }
    };

    useEffect(() => {
        if (searching) {
            setSkip(0);
            setSearching(false);
        }
        setSongs(fetchedSongs.songs);
    }, [fetchedSongs]);

    useEffect(() => {
        setSongCount(fetchedSongCount.songCount);
    }, [fetchedSongCount.songCount]);

    useEffect(() => {
        twitch.listen('broadcast', (target, contentType, body) => {
            twitch.rig.log(
                `New PubSub message!\n${target}\n${contentType}\n${body}`
            );

            if (body === 'newSong' || body === 'removeSong') {
                refetchSongs();
                refetchSongsCount();
            }
        });

        return twitch.unlisten('broadcast', () =>
            console.log('successfully unlistened')
        );
    }, []);

    return (
        <StyledDiv
            className={theme === 'light' ? 'App App-light' : 'App App-dark'}
        >
            <SearchBar
                theme={theme}
                placeholder="Search Song or Artist"
                handleSearch={handleSearch}
            />
            <LiveConfigSongList
                songs={songs}
                buttonColor={'#6441A4'}
                handleSuccess={handleSuccess}
                handleError={handleError}
                theme={theme}
            />
            <Navigation
                handleSkip={handleSkip}
                handleSort={handleSort}
                theme={theme}
                songCount={songCount}
                skip={skip}
            />
            <SnackBarComponent
                openSuccess={openSuccess}
                successMessage={successMessage}
                openError={openError}
                handleClose={handleClose}
                mutationError={mutationError}
            />
        </StyledDiv>
    );
};

export default LiveConfigSongs;
