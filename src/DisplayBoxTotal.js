import React from 'react';
import Box from '@mui/material/Box';
import { formatAsUsd } from './utils';
 
const DisplayBoxTotal = React.forwardRef((props, ref) => {
    const boxStyle={
        display:"flex",
        flexDirection:"column",
        justifyContent:"center",
        alignItems:"center",
        backgroundImage:"radial-gradient(circle farthest-corner at 0 0,rgba(184,144,242,.61),rgba(38,125,255,.74) 52%,hsla(0,0%,100%,.2))",
        backgroundColor:"rgba(4,7,31,.8)",
        borderRadius:"1rem",
        overflow:"hidden",
        maxHeight:"180px",
        maxWidth:"270px",
        minWidth:"270px",
        marginBottom:"8px"
    }

    const innerBoxStyle={
        display:"flex",
        alignItems:"center",
        flexDirection:"column",
        border:"1px solid hsla(0,0%,100%,.3)",
        borderRadius:"1rem",
        backgroundColor:"rgba(4,7,31,.8)",
        padding:"16px",
        width:"100%",
        boxSizing:"border-box"
    }

    const pStyle={
        color: "#fff",
        fontSize: "12px",
        fontWeight: "600",
        lineHeight: "8px",
        textTransform: "uppercase",
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
        <Box {...props} style={boxStyle} ref={ref}>
            <Box style={innerBoxStyle}>
                <p style={pStyle}>{props.header}</p>
                <h2 style={h2Style}>{formatAsUsd(props.value)}</h2>
            </Box>
        </Box>
    )
})
 
export default DisplayBoxTotal