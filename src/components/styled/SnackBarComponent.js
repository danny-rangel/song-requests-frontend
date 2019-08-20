import React, { Fragment } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarWrapper from './SnackbarWrapper';

const SnackBarComponent = ({
    openSuccess,
    openError,
    handleClose,
    mutationError,
    successMessage
}) => {
    return (
        <Fragment>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                }}
                open={openSuccess}
                autoHideDuration={2000}
                onClose={handleClose}
            >
                <SnackbarWrapper
                    onClose={handleClose}
                    variant="success"
                    message={successMessage}
                />
            </Snackbar>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                }}
                open={openError}
                autoHideDuration={2000}
                onClose={handleClose}
            >
                <SnackbarWrapper
                    onClose={handleClose}
                    variant="error"
                    message={mutationError ? mutationError : null}
                />
            </Snackbar>
        </Fragment>
    );
};

export default SnackBarComponent;
