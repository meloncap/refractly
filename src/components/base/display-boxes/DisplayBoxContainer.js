import React from 'react';
import Box from '@mui/material/Box';
 
const DisplayBoxContainer = React.forwardRef((props, ref) => {
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

    return (
        <Box {...props} style={boxStyle} ref={ref} sx={{...props.sx, minWidth: props.width, maxWidth: props.width}}>
            <Box style={innerBoxStyle}>
                {props.children}
            </Box>
        </Box>
    )
})
 
export default DisplayBoxContainer