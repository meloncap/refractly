import React, { useEffect, useState } from 'react';
import './App.css';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import RewardPanel from './RewardPanel';
import Selector from './Selector';
import ConnectionButton from './ConnectionButton';
import { getRewards } from './rewardFetcher';
import { claimRewards } from './rewardClaimer';

const App = () => {
  const [account, setAccount] = useState(null);
  const [readContract, setReadContract] = useState(null);
  const [writeContract, setWriteContract] = useState(null);
  const [rewards, setRewards] = useState(null);
  const [claimActions, SetClaimActions] = useState(['1']);
  const [actionsDisabled, setActionsDisabled] = useState(true);

  useEffect(() => {
    if (account) {
      getRewards(readContract, account)
        .then(fetchedRewards => {
          setRewards(fetchedRewards);
        });
    }
  }, [readContract, account])

  const onConnected = (readContract, writeContract, account) => {
    setReadContract(readContract);
    setWriteContract(writeContract);
    setAccount(account);
    setActionsDisabled(false);
  }

  const onDisconnected = () => {
    setReadContract(null);
    setWriteContract(null);
    setAccount(null);
    setActionsDisabled(true);
    setRewards(null)
  }

  const getRewardHandler = async () => {
    const fetchedRewards = await getRewards(readContract, account);
    setRewards(fetchedRewards);
  }

  const getClaimHandler = async () => {
    await claimRewards(writeContract, account, claimActions)
  }

  const actionNames = {
    1: "Claim All Rewards"
  }

  const onSelectorItemSelected = (value) => {
    SetClaimActions(value.sort());
  }

  const titleStyle={
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    width: "100%"
  }

  const buttonGridStyle = {
    paddingTop: "2rem",
    justifyContent: "center"
  }

  const connectionButtonStyle = {
    float: "right",
    width: "200px"
  }

  const donationsStyle = {
    color: "#fff"
  }

  return (
    <div className='main-app'>
      <div style={donationsStyle}>Donations Appreciated: 0x6Fc5567Cd168b5531Abd76Ef61F0ef6cFe020fDE</div>
      <ConnectionButton onConnected={onConnected} onDisconnected={onDisconnected} style={connectionButtonStyle}></ConnectionButton>
      <div><Box style={titleStyle}><h1>Reward Dashboard</h1></Box></div>
      <Grid container spacing={2}>
        <Grid item>
          <Selector rewardData={rewards} actions={actionNames} onItemSelected={onSelectorItemSelected}></Selector>
          {actionsDisabled
            ?
            null
            :
            <Grid container spacing={2} style={buttonGridStyle}>
              <Grid item>
              <Button onClick={getClaimHandler} variant="contained">Run Actions</Button>
              </Grid>
              <Grid item>
                <Button onClick={getRewardHandler} variant="contained">Fetch Rewards</Button>
              </Grid>
            </Grid>
          }
        </Grid>
        <Grid item xs={9} sm={2} md={4} lg={8} xl={9}>
          <RewardPanel rewardData={rewards}></RewardPanel>
        </Grid>
      </Grid>
    </div>
  )
}

export default App;
