import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { prodEndpoint, devEndpoint } from './util/config';

const cache = new InMemoryCache();

function createClient() {
    return new ApolloClient({
        cache,
        link: new HttpLink({
            uri: prodEndpoint,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
    });
}

export default createClient;
