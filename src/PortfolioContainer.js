import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ActionDrawer from './ActionDrawer';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import Profile from './Profile';
import ProfitButton from './ProfitButton';
import { WriteContract } from './contracts/WriteContract';
import { dystAddr, penAddr, penDystAddr } from './addresses';
import { formatAsUsd } from './utils';
import './PortfolioContainer.css'

const PortfolioContainer = ({ account, web3, balances, rewards, prices, walletConnected, actionsDisabled, onRefreshHandler }) => {
    const [actionDrawerOpen, setActionDrawerOpen] = useState(false);

    const getRewardHandler = async () => {
        onRefreshHandler();
    }

    const getClaimHandler = async () => {
        const writeContract = new WriteContract(web3, account);
        writeContract.claimAll();
    }

    const getClaimpHandler = async () => {
        const writeContract = new WriteContract(web3, account);
        writeContract.claimLpRewards();
    }

    const toggleDrawer = (open) => (event) => {
        setActionDrawerOpen(open);
    }

    const buttonGridStyle = {
        paddingTop: "2rem",
        justifyContent: "center"
    }

    const priceTitleStyle = {
        color: "#56aeff",
        textTransform: "uppercase",
        fontSize: "14px",
        fontWeight: "600",
        marginBottom: "8px",
    }

    const pricesStyle = {
        fontSize: "24px",
        lineHeight: "33px",
        margin: "0px",
        fontWeight: "400"
    }

    let dystPrice = 0;
    let penPrice = 0;
    let penDystPrice = 0;

    if (prices) {
        dystPrice = prices[dystAddr];
        penPrice = prices[penAddr];
        penDystPrice = prices[penDystAddr];
    }

    return (
        <>
            <Grid item container className="portfolio-container" spacing={2} justifyContent="center">
                <Grid item container spacing={5} style={buttonGridStyle} sx={{color: "#fff"}}>
                    <Grid item>
                        <Box>
                            <Box style={priceTitleStyle}>PEN</Box>
                            <Box><h5 style={pricesStyle}>{formatAsUsd(penPrice, 4)}</h5></Box>
                        </Box>
                    </Grid>
                    <Grid item>
                        <Box>
                            <Box style={priceTitleStyle}>DYST</Box>
                            <Box><h5 style={pricesStyle}>{formatAsUsd(dystPrice, 4)}</h5></Box>
                        </Box>
                    </Grid>
                    <Grid item>
                        <Box>
                            <Box style={priceTitleStyle}>penDYST</Box>
                            <Box><h5 style={pricesStyle}>{formatAsUsd(penDystPrice, 4)}</h5></Box>
                        </Box>
                    </Grid>
                </Grid>
                <Grid item>
                    <Profile balances={balances} rewardData={rewards} prices={prices} />
                </Grid>
                {actionsDisabled
                ?
                null
                :
                <Grid item container spacing={2} style={buttonGridStyle}>
                    <Grid item>
                        {!walletConnected
                            ?
                            null
                            :
                            <Tooltip title="Open drawer for more actions">
                                <IconButton onClick={toggleDrawer(true)} variant="contained" style={{backgroundColor: "#1976d2", color: "#fff"}}>
                                    <MenuOutlinedIcon />
                                </IconButton>
                            </Tooltip>
                        }
                    </Grid>
                    <Grid item>
                        {!walletConnected
                            ?
                            null
                            :
                            <Tooltip title="Claims all rewards from LPs, penDYST staking, and locked Pen">
                                <Button onClick={getClaimHandler} variant="contained">Claim All</Button>
                            </Tooltip>
                        }
                    </Grid>
                    <Grid item>
                        {!walletConnected
                            ?
                            null
                            :
                            <Tooltip title="Claims all rewards from LPs">
                                <Button onClick={getClaimpHandler} variant="contained">Claim LPs</Button>
                            </Tooltip>
                        }
                    </Grid>
                    <Grid item>
                        {!walletConnected
                        ?
                        null
                        :
                        <ProfitButton web3={web3} account={account}></ProfitButton>
                        }
                    </Grid>
                    <Grid item>
                        <Tooltip title="Refresh data">
                            <Button onClick={getRewardHandler} variant="contained">Refresh</Button>
                        </Tooltip>
                    </Grid>
                </Grid>
                }
            </Grid>
            <ActionDrawer anchor="left"
                open={actionDrawerOpen}
                onClose={toggleDrawer(false)}
                SlideProps={{
                direction: "up"
                }}
                PaperProps={{
                sx: {
                    backgroundColor: "#151718",
                    width: "400px",
                    top: "25%"
                }
                }}
                web3={web3}
                account={account}
            />
        </>
    )
}

export default PortfolioContainer;
