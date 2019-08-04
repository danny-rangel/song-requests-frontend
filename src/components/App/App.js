import React, { useState, useEffect } from 'react';
import Authentication from '../../util/Authentication/Authentication';
import './App.css';

const authentication = new Authentication();
//if the extension is running on twitch or dev rig, set the shorthand here. otherwise, set to null.
const twitch = window.Twitch ? window.Twitch.ext : null;

const App = () => {
    const [finishedLoading, setFinishedLoading] = useState(false);
    const [theme, setTheme] = useState('light');
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (twitch) {
            twitch.onAuthorized(auth => {
                authentication.setToken(auth.token, auth.userId);
                if (!finishedLoading) {
                    // if the component hasn't finished loading (as in we've not set up after getting a token), let's set it up now.

                    // now we've done the setup for the component, let's set the state to true to force a rerender with the correct data.
                    setFinishedLoading(true);
                }
            });

            twitch.listen('broadcast', (target, contentType, body) => {
                twitch.rig.log(
                    `New PubSub message!\n${target}\n${contentType}\n${body}`
                );
                // now that you've got a listener, do something with the result...

                // do something...
            });

            twitch.onVisibilityChanged((isVisible, _c) => {
                visibilityChanged(isVisible);
            });

            twitch.onContext((context, delta) => {
                contextUpdate(context, delta);
            });
        }

        return () => {
            if (twitch) {
                twitch.unlisten('broadcast', () =>
                    console.log('successfully unlistened')
                );
            }
        };
    }, []);

    function contextUpdate(context, delta) {
        if (delta.includes('theme')) {
            setTheme(context.theme);
        }
    }

    function visibilityChanged(isVisible) {
        setIsVisible(isVisible);
    }

    if (finishedLoading && isVisible) {
        return (
            <div className="App">
                <div className={theme === 'light' ? 'App-light' : 'App-dark'}>
                    <p>Hi!</p>
                    <p>My token is: {authentication.state.token}</p>
                    <p>My opaque ID is {authentication.getOpaqueId()}.</p>
                    <div>
                        {authentication.isModerator() ? (
                            <p>
                                I am currently a mod, and here's a special mod
                                button{' '}
                                <input value="mod button" type="button" />
                            </p>
                        ) : (
                            'I am currently not a mod.'
                        )}
                    </div>
                    <p>
                        I have{' '}
                        {authentication.hasSharedId()
                            ? `shared my ID, and my user_id is ${authentication.getUserId()}`
                            : 'not shared my ID'}
                        .
                    </p>
                </div>
            </div>
        );
    } else {
        return <div className="App" />;
    }
};

export default App;
