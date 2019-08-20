import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';

import FeedbackDialog from '../../styled/FeedbackDialog';
import StyledButton from '../../styled/Button';
// import Radio from '@material-ui/core/Radio';
// import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import SnackBarComponent from '../../styled/SnackBarComponent';

const StyledListContainer = styled(Paper)`
    && {
        width: 95%;
        max-width: 600px;
        padding: 10px 0;
        margin: 0;
        /* height: 350px; */
        height: 280px;
        border-radius: 0px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${props => (props.theme === 'light' ? '#000000' : '#ffffff')};
        box-shadow: ${props =>
            props.theme === 'light'
                ? null
                : '0px 1px 3px 0px #6441a4,0px 1px 1px 0px #6441a4, 0px 2px 1px -1px #6441a4'};
        background-color: ${props =>
            props.theme === 'light' ? null : '#18161B'};
    }
`;

const StyledFormControl = styled(FormControl)`
    && {
        width: 100%;
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

const GET_USER = gql`
    query GET_USER($id: ID!) {
        broadcaster(id: $id) {
            queueIsClosed
            bitsOnly
            bitPriority
            subMode
            oneRequestPerUser
        }
    }
`;

export const UPDATE_BROADCASTER = gql`
    mutation UPDATE_BROADCASTER(
        $queueIsClosed: Boolean!
        $bitsOnly: Boolean!
        $bitPriority: BitPriorityType!
        $subMode: Boolean!
        $oneRequestPerUser: Boolean!
    ) {
        updateBroadcasterSettings(
            queueIsClosed: $queueIsClosed
            bitsOnly: $bitsOnly
            bitPriority: $bitPriority
            subMode: $subMode
            oneRequestPerUser: $oneRequestPerUser
        ) {
            queueIsClosed
            bitsOnly
            bitPriority
            subMode
        }
    }
`;

const LiveConfigSettings = ({ theme, user }) => {
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
    const {
        loading: userLoading,
        error: userError,
        data: userData,
        refetch
    } = useQuery(GET_USER, {
        variables: { id: user.me.broadcaster.id }
    });
    const [mutationError, setMutationError] = useState(null);
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
        onCompleted: () => handleSuccess('User Updated!'),
        onError: updateBroadcasterError => handleError(updateBroadcasterError)
    });

    // function handleRadioChange(event) {
    //     if (event.target.value === 'none') {
    //         setBitPriority('NONE');
    //         setValue('none');
    //     } else if (event.target.value === 'time') {
    //         setBitPriority('TIME');
    //         setValue('time');
    //     } else if (event.target.value === 'amount') {
    //         setBitPriority('AMOUNT');
    //         setValue('amount');
    //     }
    // }

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

    const handleDialogClose = () => {
        setOpen(false);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    useEffect(() => {
        if (userData.broadcaster) {
            if (userData.broadcaster.queueIsClosed) {
                setQueueIsClosed(true);
            }

            if (userData.broadcaster.bitsOnly) {
                setBitsOnly(true);
            }

            if (userData.broadcaster.subMode) {
                setSubMode(true);
            }

            if (userData.broadcaster.oneRequestPerUser) {
                setOneRequestPerUser(true);
            }

            if (userData.broadcaster.bitPriority === 'AMOUNT') {
                setBitPriority('AMOUNT');
                setValue('amount');
            } else if (userData.broadcaster.bitPriority === 'TIME') {
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
            <StyledFormControl component="fieldset" theme={theme}>
                {/* <RadioGroup
                    aria-label="bits"
                    name="bits"
                    value={value}
                    onChange={handleRadioChange}
                >
                    <FormControlLabel
                        value="none"
                        control={<Radio />}
                        label="No Bit Priority"
                    />
                    <FormControlLabel
                        value="time"
                        control={<Radio />}
                        label="Bit Priority By Time"
                    />
                    <FormControlLabel
                        value="amount"
                        control={<Radio />}
                        label="Bit Priority By Amount"
                    />
                </RadioGroup> */}
                <FormGroup
                    style={{ marginTop: '15px', flexDirection: 'column' }}
                >
                    {/* <FormControlLabel
                        control={
                            <Checkbox
                                checked={subMode}
                                onChange={handleChange('subMode')}
                                value="subMode"
                            />
                        }
                        label="Sub Mode"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={bitsOnly}
                                onChange={handleChange('bitsOnly')}
                                value="bitsOnly"
                            />
                        }
                        label="Bits Only"
                    /> */}
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
                        // margin: '10px auto',
                        margin: '30px auto',
                        width: '150px'
                    }}
                >
                    Save
                </StyledButton>
                <StyledButton
                    buttoncolor={'#6441a4'}
                    size="large"
                    onClick={handleClickOpen}
                    style={{
                        // margin: '10px auto',
                        margin: '0px auto',
                        width: '150px'
                    }}
                >
                    Feedback?
                </StyledButton>
                <FeedbackDialog
                    open={open}
                    disabled={true}
                    handleSuccess={handleSuccess}
                    theme={theme}
                    handleDialogClose={handleDialogClose}
                />
            </StyledFormControl>
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

export default LiveConfigSettings;
