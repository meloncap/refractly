import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { formatAsUsd } from '../../../utils/utils';

const PortfolioHeader = ({ prices, dexTokenName, optimizerTokenName, optimizerVoteTokenName, dexTokenAddr, optimizerTokenAddr, optimizerVoteTokenAddr }) => {
    const priceTitleStyle = {
        color: "#56aeff",
        textTransform: "uppercase",
        fontSize: "14px",
        fontWeight: "600",
        marginBottom: "8px",
    }

    const pricesStyle = {
        fontSize: "18px",
        lineHeight: "22px",
        margin: "0px",
        fontWeight: "400"
    }

    let dexTokenPrice = 0;
    let optimizerTokenPrice = 0;
    let optimizerVoteTokenPrice = 0;
    let ratio = 0;

    if (prices && dexTokenAddr && optimizerTokenAddr && optimizerVoteTokenAddr) {
        dexTokenPrice = prices[dexTokenAddr];
        optimizerTokenPrice = prices[optimizerTokenAddr];
        optimizerVoteTokenPrice = prices[optimizerVoteTokenAddr];
        ratio = dexTokenPrice / optimizerVoteTokenPrice;
    }

    return (
        <Grid item container spacing={3} sx={{color: "#fff", justifyContent: "center"}}>
            <Grid item>
                <Box>
                    <Box style={priceTitleStyle} sx={{paddingLeft: "19px"}}>{optimizerTokenName}</Box>
                    <Box><h5 style={pricesStyle}>{formatAsUsd(optimizerTokenPrice, 4)}</h5></Box>
                </Box>
            </Grid>
            <Grid item>
                <Box>
                    <Box style={priceTitleStyle} sx={{paddingLeft: "16px"}}>{dexTokenName}</Box>
                    <Box><h5 style={pricesStyle}>{formatAsUsd(dexTokenPrice, 4)}</h5></Box>
                </Box>
            </Grid>
            <Grid item>
                <Box>
                    <Box style={priceTitleStyle} sx={{paddingLeft: "1px"}}>{optimizerVoteTokenName}</Box>
                    <Box><h5 style={pricesStyle}>{formatAsUsd(optimizerVoteTokenPrice, 4)}</h5></Box>
                </Box>
            </Grid>
            <Grid item>
                <Box>
                    <Box style={priceTitleStyle}>{optimizerVoteTokenName}:{dexTokenName}</Box>
                    <Box sx={{paddingLeft:"25px"}}><h5 style={pricesStyle}>{ratio.toFixed(2)}</h5></Box>
                </Box>
            </Grid>
        </Grid>
    )
}

export default PortfolioHeader;
