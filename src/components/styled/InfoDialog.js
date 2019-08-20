import React from 'react';
import styled from 'styled-components';
import moment from 'moment';

import '../../Panel.css';
import Dialog from '@material-ui/core/Dialog';

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

const StyledInfoDiv = styled.div`
    display: flex;
    flex-direction: column;
`;

const StyledHeaderText = styled.h3`
    font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
    border-bottom: 1px solid #b3b3b3;
    margin: 5px;
`;

const StyledInfoText = styled.p`
    font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
    margin: 5px;
`;

const InfoDialog = ({ onClose, selectedSong, open, theme }) => {
    const handleDialogClose = () => {
        onClose();
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
                Request Info
            </h2>
            {selectedSong && (
                <React.Fragment>
                    <StyledInfoDiv>
                        <StyledHeaderText>Title</StyledHeaderText>
                        <StyledInfoText>
                            {selectedSong.song.title}
                        </StyledInfoText>
                    </StyledInfoDiv>
                    <StyledInfoDiv>
                        <StyledHeaderText>Artist</StyledHeaderText>
                        <StyledInfoText>
                            {selectedSong.song.artist}
                        </StyledInfoText>
                    </StyledInfoDiv>
                    <StyledInfoDiv>
                        <StyledHeaderText>Requested By</StyledHeaderText>
                        <StyledInfoText>
                            {selectedSong.requestedBy}
                        </StyledInfoText>
                    </StyledInfoDiv>
                    <StyledInfoDiv>
                        <StyledInfoText>
                            {moment(selectedSong.createdAt).fromNow()}
                        </StyledInfoText>
                    </StyledInfoDiv>
                </React.Fragment>
            )}
        </StyledDialog>
    );
};

export default InfoDialog;
