import styled from 'styled-components';
import Button from '@material-ui/core/Button';

const StyledButton = styled(Button)`
    && {
        color: white;
        margin: ${props => (props.margin ? props.margin : null)};
        width: ${props => (props.width ? props.width : null)};
        background-color: ${props => props.buttoncolor};
        font-size: ${props => props.textsize};
        font-weight: bold;
        padding: ${props => props.padding};
        border-radius: 4px;
        height: ${props => props.height};
        box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2),
            0px 1px 1px 0px rgba(0, 0, 0, 0.14),
            0px 2px 1px -1px rgba(0, 0, 0, 0.12);
    }

    &&:hover {
        background-color: ${props =>
            props.hovercolor ? props.hovercolor : '#7d44e4'};
    }
`;

export default StyledButton;
