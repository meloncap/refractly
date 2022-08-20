import React from 'react';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import BalanceDisplay from '../display-boxes/BalanceDisplay';
import './portfolio.css';
 
const Portfolio = ( { balances, rewardData, prices, optimizerVoteTokenName, optimizerTokenName, optimizerTokenAddr, optimizerVoteTokenAddr, optimizerLockTokenAddr, balanceTitle }) => {
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
    let stakedOptimizerVoteBalance = 0;
    let optimizerLockBalance = 0;
    if (balances && prices) {
        Object.entries(balances).forEach(balance => {
            const address = balance[0];

            if (address === optimizerVoteTokenName) {
                return;
            }

            const data = balance[1];
            totalBalance += data / 10 ** 18 * prices[address];
        });

        stakedOptimizerVoteBalance = balances[optimizerVoteTokenName] / 10**18 * prices[optimizerVoteTokenAddr];
        optimizerLockBalance = balances[optimizerLockTokenAddr] / 10**18 * prices[optimizerTokenAddr];
    }

    let earned = 0;
    if (rewardData && prices) {
        Object.entries(rewardData).forEach(reward => {
            const address = reward[0];
            const data = reward[1];
            const rewards = data.earned / diviser;
            earned += rewards * prices[address];
        });
    }    

    return (
        <Box className="container" style={boxStyle}>
            <Box style={innerBoxStyle}>
                <p style={pStyle}>My Portfolio</p>
                <Tooltip title={balanceTitle}>
                    <BalanceDisplay
                        header="Portfolio Value"
                        value={totalBalance}
                        width="276px"
                    ></BalanceDisplay>
                </Tooltip>
                <Tooltip title="Rewards that have not been claimed yet">
                    <BalanceDisplay
                        header="Unclaimed Rewards"
                        value={earned}
                        width="276px"
                    ></BalanceDisplay>
                </Tooltip>
                <Box sx={{display: "flex"}}>
                    <Tooltip title={`Staked ${optimizerVoteTokenName} balance`}>
                        <BalanceDisplay
                            header={`Staked ${optimizerVoteTokenName}`}
                            value={stakedOptimizerVoteBalance}
                            width="134px"
                            sx={{marginRight: "8px"}}
                        ></BalanceDisplay>
                    </Tooltip>
                    <Tooltip title={`Locked ${optimizerTokenName} Balance`}>
                        <BalanceDisplay
                            header={`Locked ${optimizerTokenName}`}
                            value={optimizerLockBalance}
                            width="134px"
                        ></BalanceDisplay>
                    </Tooltip>
                </Box>
            </Box>
        </Box>
    )
}
 
export default Portfolio