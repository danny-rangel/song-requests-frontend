import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import styled from 'styled-components';
import { ME_QUERY } from '../LiveConfigPage/LiveConfigPage';
import { UPDATE_BROADCASTER } from '../LiveConfigPage/Pages/LiveConfigSettings';
import './Config.css';
import '../../Panel.css';

import StyledButton from '../styled/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import SnackBarComponent from '../styled/SnackBarComponent';
import Loading from '../styled/Loading';

const StyledListContainer = styled(Paper)`
    && {
        width: 100%;
        padding: 10px;
        box-sizing: border-box;
        margin: 0;
        height: 100%;
        border-radius: 0px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        color: ${props => (props.theme === 'light' ? '#000000' : '#ffffff')};
        box-shadow: ${props =>
            props.theme === 'light'
                ? null
                : '0px 1px 3px 0px #6441a4,0px 1px 1px 0px #6441a4, 0px 2px 1px -1px #6441a4'};
        background-color: ${props =>
            props.theme === 'light' ? null : '#18161B'};
    }
`;

const StyledHeader = styled.div`
    padding: 30px 0 0 20px;
`;

const StyledInfoTextDiv = styled.div`
    padding: 30px;
    width: 100%;
    max-width: 600px;
`;

const StyledInfoText = styled.h2``;

const StyledFormControl = styled(FormControl)`
    && {
        height: 100%;

        .MuiFormGroup-root {
            margin-left: 20px;
        }

        .PrivateSwitchBase-input-185 {
            color: ${props =>
                props.theme === 'light' ? null : 'rgba(255, 255, 255, 0.57)'};
        }

        .MuiButtonBase-root {
            color: ${props =>
                props.theme === 'light' ? null : 'rgba(255, 255, 255, 0.57)'};
        }

        .MuiButtonBase-root.MuiButton-root.sc-htpNat.htjRoY {
            color: #ffffff;
        }

        .MuiButtonBase-root.MuiButton-root.sc-htpNat.htjRoY.MuiButton-text.MuiButton-sizeLarge.Mui-disabled.Mui-disabled {
            color: rgba(0, 0, 0, 0.26);
        }

        .MuiRadio-colorSecondary.Mui-checked {
            color: #6441a4;
        }

        .MuiCheckbox-colorSecondary.Mui-checked {
            color: #6441a4;
        }
    }
`;

const ConfigPage = ({ theme }) => {
    const [value, setValue] = useState('');
    const [bitPriority, setBitPriority] = useState('');
    const [subMode, setSubMode] = useState(false);
    const [oneRequestPerUser, setOneRequestPerUser] = useState(false);
    const [bitsOnly, setBitsOnly] = useState(false);
    const [queueIsClosed, setQueueIsClosed] = useState(false);
    const [open, setOpen] = useState(false);
    const [openSuccess, setOpenSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [openError, setOpenError] = useState(false);
    const [mutationError, setMutationError] = useState(null);
    const {
        loading: userLoading,
        error: userError,
        data: userData,
        refetch
    } = useQuery(ME_QUERY);

    const [
        updateBroadcasterSettings,
        {
            loading: updatingLoading,
            data: updatedSettings,
            error: updateBroadcasterError
        }
    ] = useMutation(UPDATE_BROADCASTER, {
        variables: {
            queueIsClosed,
            bitsOnly,
            bitPriority,
            subMode,
            oneRequestPerUser
        },
        onCompleted: () => handleSuccess("You're all set!"),
        onError: updateBroadcasterError => handleError(updateBroadcasterError)
    });

    const handleChange = name => event => {
        if (name === 'subMode') {
            setSubMode(event.target.checked);
        } else if (name === 'bitsOnly') {
            setBitsOnly(event.target.checked);
        } else if (name === 'queueIsClosed') {
            setQueueIsClosed(event.target.checked);
        } else if (name === 'oneRequestPerUser') {
            setOneRequestPerUser(event.target.checked);
        }
    };

    const handleSuccess = message => {
        refetch();
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

    useEffect(() => {
        if (userData.me) {
            if (userData.me.broadcaster.queueIsClosed) {
                setQueueIsClosed(true);
            }

            if (userData.me.broadcaster.bitsOnly) {
                setBitsOnly(true);
            }

            if (userData.me.broadcaster.subMode) {
                setSubMode(true);
            }

            if (userData.me.broadcaster.oneRequestPerUser) {
                setOneRequestPerUser(true);
            }

            if (userData.me.broadcaster.bitPriority === 'AMOUNT') {
                setBitPriority('AMOUNT');
                setValue('amount');
            } else if (userData.me.broadcaster.bitPriority === 'TIME') {
                setBitPriority('TIME');
                setValue('time');
            } else {
                setBitPriority('NONE');
                setValue('none');
            }
        }
    }, [userData]);

    return (
        <StyledListContainer theme={theme}>
            <StyledHeader>
                <img className="logo" />
            </StyledHeader>
            <StyledInfoTextDiv>
                <StyledInfoText>
                    Just some quick configuration to get you up and running!
                </StyledInfoText>
                <StyledInfoText>
                    You also can change everything you see here in your creator
                    dashboard as well.
                </StyledInfoText>
                <StyledInfoText>
                    Once you save your changes, head on over to your creator
                    dashboard and start adding songs!
                </StyledInfoText>
            </StyledInfoTextDiv>
            {userData.me ? (
                <StyledFormControl component="fieldset" theme={theme}>
                    <FormGroup
                        style={{ marginTop: '15px', flexDirection: 'column' }}
                    >
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={queueIsClosed}
                                    onChange={handleChange('queueIsClosed')}
                                    value="queueIsClosed"
                                />
                            }
                            label="Close Queue"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={oneRequestPerUser}
                                    onChange={handleChange('oneRequestPerUser')}
                                    value="oneRequestPerUser"
                                />
                            }
                            label="One Request Per User"
                        />
                    </FormGroup>
                    <StyledButton
                        type="submit"
                        buttoncolor={'#6441a4'}
                        disabled={updatingLoading}
                        size="large"
                        onClick={updateBroadcasterSettings}
                        style={{
                            margin: '30px auto',
                            width: '150px'
                        }}
                    >
                        Save
                    </StyledButton>
                </StyledFormControl>
            ) : (
                <Loading height="40px" width="40px" />
            )}

            <SnackBarComponent
                openSuccess={openSuccess}
                openError={openError}
                handleClose={handleClose}
                successMessage={successMessage}
                mutationError={mutationError}
            />
        </StyledListContainer>
    );
};

export default ConfigPage;
