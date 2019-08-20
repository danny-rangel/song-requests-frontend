import React from 'react';
import LiveConfigSongs from './Pages/LiveConfigSongs';
import LiveConfigNav from './LiveConfigNav';
import LiveConfigQueue from './Pages/LiveConfigQueue';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import styled from 'styled-components';
import LiveConfigAdd from './Pages/LiveConfigAdd';
import LiveConfigSettings from './Pages/LiveConfigSettings';

import Loading from '../styled/Loading';

export const ME_QUERY = gql`
    query {
        me {
            token
            broadcaster {
                id
                isMod
                username
                profileImage
                queueIsClosed
                subMode
                bitsOnly
                bitPriority
                songCount
                oneRequestPerUser
            }
            user {
                id
                isMod
                hasSharedId
                role
                userId
            }
            channelId
        }
    }
`;

const StyledDiv = styled.div`
    display: grid;
    height: 100%;
    width: 100%;
    grid-template-columns: 1fr;
    grid-template-rows: 70px 1fr;
    grid-gap: 10px;
    justify-items: center;
    background-color: ${props =>
        props.theme === 'light' ? '#ffffff' : '#000000'};
`;

const LiveConfigPage = ({ theme, twitch }) => {
    const { loading, error, data } = useQuery(ME_QUERY);

    if (!loading) {
        return (
            <Router>
                <Redirect to="/live_config.html" />
                <StyledDiv theme={theme}>
                    <LiveConfigNav location={location} theme={theme} />
                    <Route
                        path="/live_config.html"
                        exact
                        render={props => (
                            <LiveConfigSongs
                                location={location}
                                theme={theme}
                                twitch={twitch}
                                {...props}
                            />
                        )}
                    />
                    <Route
                        path="/live_config.html/queue"
                        exact
                        render={props => (
                            <LiveConfigQueue
                                theme={theme}
                                twitch={twitch}
                                {...props}
                            />
                        )}
                    />
                    <Route
                        path="/live_config.html/add"
                        exact
                        component={props => (
                            <LiveConfigAdd theme={theme} {...props} />
                        )}
                    />
                    <Route
                        path="/live_config.html/settings"
                        exact
                        component={props => (
                            <LiveConfigSettings
                                theme={theme}
                                user={data}
                                {...props}
                            />
                        )}
                    />
                </StyledDiv>
            </Router>
        );
    } else {
        return <Loading height="40px" width="40px" />;
    }
};

export default LiveConfigPage;
