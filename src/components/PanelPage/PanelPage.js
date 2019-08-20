import React from 'react';
import PanelComponent from './PanelComponent';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import Loading from '../styled/Loading';

const ME_QUERY = gql`
    query {
        me {
            token
            broadcaster {
                id
                isMod
                username
                profileImage
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

const PanelPage = ({ theme, twitch }) => {
    const { loading, error, data } = useQuery(ME_QUERY);

    if (!loading) {
        return <PanelComponent theme={theme} user={data} twitch={twitch} />;
    } else {
        return <Loading height="40px" width="40px" />;
    }
};

export default PanelPage;
