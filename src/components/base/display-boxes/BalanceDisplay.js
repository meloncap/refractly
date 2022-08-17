import React from 'react';
import { formatAsUsd } from '../../../utils/utils';
import DisplayBoxContainer from './DisplayBoxContainer';
 
const BalanceDisplay = React.forwardRef((props, ref) => {
    const pStyle={
        color: "#fff",
        fontSize: "12px",
        fontWeight: "600",
        lineHeight: "8px",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        marginBottom: "2px"
    }

    const h2Style={
        display: "flex",
        color: "transparent",
        background: "linear-gradient(91.96deg,#88a2ff 5.5%,#fff 57.33%,#ffc6eb 108.26%)",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        fontSize: "20px",
        fontWeight: "700",
        lineHeight: "51px",
        margin:"0rem"
    }

    return (
        <DisplayBoxContainer {...props} ref={ref} width={props.width} sx={{...props.sx, marginBottom: "8px"}}>
            <p style={pStyle}>{props.header}</p>
            <h2 style={h2Style}>{formatAsUsd(props.value)}</h2>
        </DisplayBoxContainer>
    )
})
 
export default BalanceDisplay