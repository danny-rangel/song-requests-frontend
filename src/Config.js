import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import createClient from './client';
import ConfigPage from './components/ConfigPage/ConfigPage';
import Loading from './components/styled/Loading';
import 'normalize.css';

const twitch = window.Twitch ? window.Twitch.ext : null;
let client;

const Config = () => {
    const [finishedLoading, setFinishedLoading] = useState(false);
    const [theme, setTheme] = useState('light');
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (twitch) {
            twitch.onAuthorized(async auth => {
                if (auth.token) {
                    localStorage.setItem('token', auth.token);
                }
                client = createClient();

                twitch.onVisibilityChanged((isVisible, _c) => {
                    visibilityChanged(isVisible);
                });

                twitch.onContext((context, delta) => {
                    contextUpdate(context, delta);
                });

                setFinishedLoading(true);
            });
        }
    }, []);

    function contextUpdate(context, delta) {
        if (delta.includes('theme')) {
            setTheme(context.theme);
        }
    }

    function visibilityChanged(isVisible) {
        setIsVisible(isVisible);
    }

    if (finishedLoading) {
        return (
            <ApolloProvider client={client}>
                <ConfigPage theme={theme} twitch={twitch} />
            </ApolloProvider>
        );
    } else {
        return <Loading height="40px" width="40px" />;
    }
};

ReactDOM.render(<Config />, document.getElementById('root'));
