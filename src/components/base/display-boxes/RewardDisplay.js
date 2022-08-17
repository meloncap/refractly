import React from 'react';
import DisplayBoxContainer from './DisplayBoxContainer';
import { formatAsUsd } from '../../../utils/utils';
 
const RewardDisplay = React.forwardRef((props, ref) => {
    const pStyle={
        color: "#fff",
        fontSize: "16px",
        fontWeight: "600",
        lineHeight: "8px",
        textTransform: "uppercase",
        marginBottom: "2px",
        marginTop: "2px"
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

    const h3Style={
        display: "flex",
        color: "transparent",
        background: "linear-gradient(91.96deg,#88a2ff 5.5%,#fff 57.33%,#ffc6eb 108.26%)",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        fontSize: "18px",
        fontWeight: "800",
        lineHeight: "40px",
        margin:"-1rem"
    }

    return (
        <DisplayBoxContainer {...props} ref={ref} width="270px">
            <p style={pStyle}>{props.header}</p>
            <h2 style={h2Style}>{props.reward === 0 ? 0 : Number(props.reward).toFixed(8)}</h2>
            <h3 style={h3Style}>{formatAsUsd(props.rewardAmount)}</h3>
        </DisplayBoxContainer>
    )
})
 
export default RewardDisplay