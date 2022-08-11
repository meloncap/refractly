import React from 'react';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import DisplayBoxTotal from './DisplayBoxTotal';
 
const Profile = ( { balances, rewardData, prices }) => {
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
        marginLeft: "14px"
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

    let totalBalance = 0;
    if (balances) {
        Object.entries(balances).forEach(balance => {
            const address = balance[0];
            const data = balance[1];
            totalBalance += data / 10 ** 18 * prices[address];
        });
    }

    let earned = 0;
    if (rewardData) {
        Object.entries(rewardData).forEach(reward => {
            const address = reward[0];
            const data = reward[1];
            const rewards = data.earned / diviser;
            earned += rewards * prices[address];
        });
    }    

    return (
        <Box style={boxStyle}>
            <Box style={innerBoxStyle}>
                <p style={pStyle}>My Portfolio</p>
                <Tooltip title={
                    <React.Fragment>
                    Total portfolio balance not including unclaimed rewards<br></br>
                    This includes:<br></br>
                    - DYST, PEN, and penDYST in wallet<br></br>
                    - Staked penDYST and locked PEN<br></br>
                    - Staked LP balance
                    </React.Fragment>
                    
                }>
                    <DisplayBoxTotal
                        header="Portfolio Value"
                        value={totalBalance}
                    ></DisplayBoxTotal>
                </Tooltip>
                <Tooltip title="Rewards that have not been claimed yet">
                    <DisplayBoxTotal
                        header="Unclaimed Rewards"
                        value={earned}
                    ></DisplayBoxTotal>
                </Tooltip>
            </Box>
        </Box>
    )
}
 
export default Profile