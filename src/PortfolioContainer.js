import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ActionDrawer from './ActionDrawer';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import Profile from './Profile';
import ProfitButton from './ProfitButton';
import { WriteContract } from './contracts/WriteContract';

const PortfolioContainer = ({ account, web3, balances, rewards, prices, walletConnected, actionsDisabled, onRefreshHandler }) => {
    const [actionDrawerOpen, setActionDrawerOpen] = useState(false);

    const getRewardHandler = async () => {
    // getProfile(web3, account)
    //     .then(profile => {
    //     // setRewards(profile.rewards);
    //     // setBalances(profile.balances);
    //     });
        onRefreshHandler();
    }

    const getClaimHandler = async () => {
        const writeContract = new WriteContract(web3, account);
        writeContract.claimAll();
    }

    const toggleDrawer = (open) => (event) => {
        setActionDrawerOpen(open);
    }

    const buttonGridStyle = {
        paddingTop: "2rem",
        justifyContent: "center"
    }

    return (
        <>
            <Grid item container spacing={2} justifyContent="center">
                <Profile balances={balances} rewardData={rewards} prices={prices} />
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
                        <ProfitButton web3={web3} account={account}></ProfitButton>
                        }
                    </Grid>
                    <Grid item>
                        <Tooltip title="Refresh rewards">
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
