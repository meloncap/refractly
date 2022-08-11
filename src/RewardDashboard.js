import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ActionDrawer from './ActionDrawer';
import RewardPanel from './RewardPanel';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import Profile from './Profile';
import { getProfile } from './profileFetcher';
import { WriteContract } from './contracts/WriteContract';
import ProfitButton from './ProfitButton';

const RewardDashboard = ({ account, web3, walletConnected, actionsDisabled, balances, rewards, prices, symbols }) => {
  // const [rewards, setRewards] = useState(null);
  // const [balances, setBalances] = useState(null);
  const [actionDrawerOpen, setActionDrawerOpen] = useState(false);

  // useEffect(() => {
  //   if (account && web3) {
  //     getRewardHandler();
  //   } else {
  //     setRewards(null);
  //     setBalances(null);
  //   }
  // }, [account, web3]);

  const getRewardHandler = async () => {
    getProfile(web3, account)
      .then(profile => {
        // setRewards(profile.rewards);
        // setBalances(profile.balances);
      });
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
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item>
          <Profile balances={balances} rewardData={rewards} prices={prices} />
          {actionsDisabled
            ?
            null
            :
            <Grid container spacing={2} style={buttonGridStyle}>
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
        <Grid item xs={9} sm={2} md={4} lg={8} xl={8}>
          <RewardPanel rewardData={rewards}></RewardPanel>
        </Grid>
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
    </React.Fragment>
  )
}

export default RewardDashboard;
