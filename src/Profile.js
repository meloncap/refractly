import React from 'react';
import Box from '@mui/material/Box';
import DisplayBoxTotal from './DisplayBoxTotal';
 
const Profile = ( { rewardData }) => {
    const boxStyle={
        display:"flex",
        flexDirection:"column",
        justifyContent:"center",
        alignItems:"center",
        backgroundImage:"radial-gradient(circle farthest-corner at 0 0,rgba(184,144,242,.61),rgba(38,125,255,.74) 52%,hsla(0,0%,100%,.2))",
        backgroundColor:"rgba(4,7,31,.8)",
        borderRadius:"1rem",
        overflow:"hidden",
        maxHeight:"3000px",
        maxWidth:"400px",
        minWidth:"400px",
    }

    const innerBoxStyle={
        display:"flex",
        alignItems:"center",
        flexDirection:"column",
        border:"1px solid hsla(0,0%,100%,.3)",
        borderRadius:"1rem",
        backgroundColor:"rgba(4,7,31,.8)",
        padding:"25px",
        width:"100%",
        boxSizing:"border-box"
    }

    const pStyle={
        color: "#fff",
        fontWeight: "600",
        textTransform: "uppercase"
    }

    const diviser = 10 ** 18;

    let earned = 0;
    if (rewardData) {
        Object.entries(rewardData).forEach(reward => {
            const data = reward[1];
            const rewards = data.earned / diviser;
            earned += rewards * data.price;
        });
    }    

    return (
        <Box style={boxStyle}>
            <Box style={innerBoxStyle}>
                <p style={pStyle}>My Portfolio</p>
                <DisplayBoxTotal
                    title="Total Earned"
                    rewardAmount={earned}
                ></DisplayBoxTotal>
            </Box>
        </Box>
    )
}
 
export default Profile