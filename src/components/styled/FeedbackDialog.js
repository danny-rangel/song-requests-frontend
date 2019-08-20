import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Dialog from '@material-ui/core/Dialog';
import styled from 'styled-components';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import StyledButton from '../styled/Button';
import SnackBarComponent from '../styled/SnackBarComponent';

const StyledDialog = styled(Dialog)`
    && {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;

        div {
            display: flex;
            align-items: center;
            justify-content: center;

            .MuiPaper-root.MuiPaper-elevation24.MuiDialog-paper.MuiDialog-paperScrollPaper.MuiDialog-paperWidthSm.MuiPaper-rounded {
                width: 260px;
                margin: 0;
                padding: 10px;
                word-break: break-all;

                box-shadow: ${props =>
                    props.theme === 'light'
                        ? null
                        : '0px 1px 3px 0px #6441a4,0px 1px 1px 0px #6441a4, 0px 2px 1px -1px #6441a4'};
                background-color: ${props =>
                    props.theme === 'light' ? 'ffffff' : '#18161B'};
                color: ${props =>
                    props.theme === 'light' ? '#000000' : '#ffffff'};
            }
        }
    }
`;

const StyledTextArea = styled(TextareaAutosize)`
    && {
        box-shadow: ${props =>
            props.theme === 'light'
                ? null
                : '0px 1px 3px 0px #6441a4,0px 1px 1px 0px #6441a4, 0px 2px 1px -1px #6441a4'};
        background-color: ${props =>
            props.theme === 'light' ? 'ffffff' : '#18161B'};
        color: ${props => (props.theme === 'light' ? '#000000' : '#ffffff')};
    }
`;

const StyledInfoDiv = styled.div`
    display: flex;
    flex-direction: column;
`;

const SUBMIT_FEEDBACK = gql`
    mutation SUBMIT_FEEDBACK($content: String!) {
        createFeedback(content: $content) {
            id
        }
    }
`;

const FeedbackDialog = ({ open, handleSuccess, theme, handleDialogClose }) => {
    const [content, setContent] = useState('');
    const [openError, setOpenError] = useState(false);
    const [mutationError, setMutationError] = useState(null);
    const [
        createFeedback,
        { loading: submitFeedbackLoading, error: feedbackError }
    ] = useMutation(SUBMIT_FEEDBACK, {
        onCompleted: () => handleDialogSuccess('Thanks for your feedback!'),
        onError: feedbackError => handleError(feedbackError)
    });

    const handleError = error => {
        setMutationError(error.message.replace('GraphQL error: ', ''));
        setOpenError(true);
    };

    const handleClose = () => {
        setOpenError(false);
    };

    const handleDialogSuccess = message => {
        handleDialogClose();
        handleSuccess(message);
    };

    return (
        <StyledDialog
            onClose={handleDialogClose}
            aria-labelledby="simple-dialog-title"
            open={open}
            theme={theme}
        >
            <h2
                style={{
                    margin: '5px 0',
                    fontFamily: '"Montserrat", sans-serif'
                }}
            >
                Feedback
            </h2>
            <StyledInfoDiv>
                <StyledTextArea
                    theme={theme}
                    required
                    rows={5}
                    rowsMax={5}
                    style={{ margin: '20px 0px' }}
                    placeholder="Share your thoughts here..."
                    onChange={e => setContent(e.target.value)}
                />
                <StyledButton
                    buttoncolor="#6441a4"
                    type="submit"
                    size="large"
                    disabled={submitFeedbackLoading}
                    style={{ margin: '15px', width: '135px' }}
                    onClick={() =>
                        createFeedback({
                            variables: {
                                content
                            }
                        })
                    }
                >
                    Submit
                </StyledButton>
            </StyledInfoDiv>
            <SnackBarComponent
                openError={openError}
                handleClose={handleClose}
                mutationError={mutationError}
            />
        </StyledDialog>
    );
};

export default FeedbackDialog;
