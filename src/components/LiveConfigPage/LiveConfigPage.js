import React, { useState, useEffect } from 'react';
import Authentication from '../../util/Authentication/Authentication';
import './LiveConfigPage.css';

const authentication = new Authentication();
//if the extension is running on twitch or dev rig, set the shorthand here. otherwise, set to null.
const twitch = window.Twitch ? window.Twitch.ext : null;

const LiveConfigPage = () => {
    const [finishedLoading, setFinishedLoading] = useState(false);
    const [theme, setTheme] = useState('light');

    function contextUpdate(context, delta) {
        if (delta.includes('theme')) {
            setTheme(context.theme);
        }
    }

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

            twitch.onContext((context, delta) => {
                contextUpdate(context, delta);
            });
        }

        if (twitch) {
            return twitch.unlisten('broadcast', () =>
                console.log('successfully unlistened')
            );
        }
    }, []);

    if (finishedLoading) {
        return (
            <div className="LiveConfigPage">
                <div
                    className={
                        theme === 'light'
                            ? 'LiveConfigPage-light'
                            : 'LiveConfigPage-dark'
                    }
                >
                    <p>Hello world!</p>
                    <p>This is the live config page! </p>
                </div>
            </div>
        );
    } else {
        return <div className="LiveConfigPage" />;
    }
};

export default LiveConfigPage;
