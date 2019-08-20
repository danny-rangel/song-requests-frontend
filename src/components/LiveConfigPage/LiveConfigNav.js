import React, { useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import styled from 'styled-components';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import LibraryAdd from '@material-ui/icons/LibraryAdd';
import QueueMusic from '@material-ui/icons/QueueMusic';
import QueuePlayNext from '@material-ui/icons/QueuePlayNext';
import Settings from '@material-ui/icons/Settings';
import { Link } from 'react-router-dom';

const StyledPaper = styled(Paper)`
    && {
        flex-grow: 1;
        width: 100%;
        height: 72px;
        background-color: ${props =>
            props.theme === 'light' ? '#ffffff' : '#000000'};
    }
`;

const StyledTab = styled(Tab)`
    && {
        color: ${props => (props.theme === 'light' ? '#000000' : '#ffffff')};
        padding: 4px;
    }
`;

const LiveConfigNav = ({ location: { pathname }, theme }) => {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        switch (pathname.substr(17)) {
            case '/queue':
                setValue(1);
                break;
            case '/add':
                setValue(2);
                break;
            case '/settings':
                setValue(3);
                break;
            default:
                setValue(0);
        }
    }, [pathname]);

    return (
        <StyledPaper square theme={theme}>
            <Tabs
                value={value}
                onChange={handleChange}
                variant="fullWidth"
                TabIndicatorProps={{ style: { backgroundColor: '#6441a4' } }}
            >
                <StyledTab
                    icon={<QueueMusic />}
                    theme={theme}
                    label="Songs"
                    component={Link}
                    to="/live_config.html"
                />
                <StyledTab
                    icon={<QueuePlayNext />}
                    theme={theme}
                    label="Queue"
                    component={Link}
                    to="/live_config.html/queue"
                />
                <StyledTab
                    icon={<LibraryAdd />}
                    theme={theme}
                    label="Add"
                    component={Link}
                    to="/live_config.html/add"
                />
                <StyledTab
                    icon={<Settings />}
                    theme={theme}
                    label="Settings"
                    component={Link}
                    to="/live_config.html/settings"
                />
            </Tabs>
        </StyledPaper>
    );
};

export default LiveConfigNav;
