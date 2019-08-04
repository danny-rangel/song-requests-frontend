import React, { useState, useEffect } from 'react';
import Authentication from '../../util/Authentication/Authentication';
import './Config.css';

const authentication = new Authentication();
//if the extension is running on twitch or dev rig, set the shorthand here. otherwise, set to null.
const twitch = window.Twitch ? window.Twitch.ext : null;

const ConfigPage = () => {
    const [finishedLoading, setFinishedLoading] = useState(false);
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        // do config page setup as needed here
        if (twitch) {
            twitch.onAuthorized(auth => {
                authentication.setToken(auth.token, auth.userId);
                if (!finishedLoading) {
                    // if the component hasn't finished loading (as in we've not set up after getting a token), let's set it up now.

                    // now we've done the setup for the component, let's set the state to true to force a rerender with the correct data.
                    setFinishedLoading(true);
                }
            });

            twitch.onContext((context, delta) => {
                contextUpdate(context, delta);
            });
        }
    }, []);

    function contextUpdate(context, delta) {
        if (delta.includes('theme')) {
            setTheme(context.theme);
        }
    }

    if (finishedLoading && authentication.isModerator()) {
        return (
            <div className="Config">
                <div
                    className={
                        theme === 'light' ? 'Config-light' : 'Config-dark'
                    }
                >
                    There is no configuration needed for this extension!
                </div>
            </div>
        );
    } else {
        return (
            <div className="Config">
                <div
                    className={
                        theme === 'light' ? 'Config-light' : 'Config-dark'
                    }
                >
                    Loading...
                </div>
            </div>
        );
    }
};

export default ConfigPage;
