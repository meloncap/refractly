import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import './portfolioContainer.css'

const PortfolioContainer = ({
    account,
    web3,
    walletConnected,
    actionsDisabled,
    onRefreshHandler,
    portfolioHeader,
    portfolio,
    actionButton,
    claimAllButton,
    claimLpButton,
    profitButton
}) => {
    const getRewardHandler = async () => {
        onRefreshHandler();
    }

    const buttonGridStyle = {
        paddingTop: "2rem",
        justifyContent: "center"
    }

    return (
        <Grid item container className="portfolio-container" spacing={2} justifyContent="center">
            {portfolioHeader}
            <Grid item>
                {portfolio}
            </Grid>
            {actionsDisabled
            ?
            null
            :
            <Grid item container spacing={2} style={buttonGridStyle}>
                <Grid item>
                    {!walletConnected ? null : actionButton}
                </Grid>
                <Grid item>
                    {!walletConnected ? null : claimAllButton}
                    </Grid>
                <Grid item>
                    {!walletConnected ? null : claimLpButton}
                </Grid>
                <Grid item>
                    {!walletConnected ? null : profitButton}
                </Grid>
                <Grid item>
                    <Tooltip title="Refresh data">
                        <Button onClick={getRewardHandler} variant="contained">Refresh</Button>
                    </Tooltip>
                </Grid>
            </Grid>
            }
        </Grid>
    )
}

export default PortfolioContainer;
