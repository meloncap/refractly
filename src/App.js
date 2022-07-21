import React, { useEffect, useState } from 'react';
import './App.css';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import RewardPanel from './RewardPanel';
// import Selector from './Selector';
import Profile from './Profile';
import ConnectionButton from './ConnectionButton';
import { getRewards } from './rewardFetcher';
import { claimRewards } from './rewardClaimer';
import Web3 from 'web3';

const App = () => {
  const [account, setAccount] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [web3, setWeb3] = useState(null);
  const [rewards, setRewards] = useState(null);
  const [claimActions, setClaimActions] = useState(['1']);
  const [actionsDisabled, setActionsDisabled] = useState(true);

  useEffect(() => {
    if (account && web3) {
      getRewardHandler();
    }
  }, [account, web3])

  const onConnected = (web3, account) => {
    setWalletConnected(true);
    setAccount(account);
    setWeb3(web3);
    setActionsDisabled(false);
  }

  const onDisconnected = () => {
    setWalletConnected(false);
    setAccount(null);
    setWeb3(null);
    setActionsDisabled(true);
    setRewards(null);
  }

  const getRewardHandler = async () => {
    getRewards(web3, account)
      .then(rewards => {
        setRewards(rewards);
      });
  }

  const getClaimHandler = async () => {
    await claimRewards(web3, account, claimActions)
  }

  const actionNames = {
    1: "Claim All Rewards"
  }

  // const onSelectorItemSelected = (value) => {
  //   setClaimActions(value.sort());
  // }

  const onWalletAddressChanged = async (event) => {
    const address = event.currentTarget.value;

    if(address && Web3.utils.isAddress(address)) {
      setAccount(address);
      const web3 = new Web3(process.env.REACT_APP_ALCHEMY_URL);
      setWeb3(web3);
      setActionsDisabled(false);
    }
    else {
      setAccount(null);
      setWeb3(null);
      setActionsDisabled(true);
      setRewards(null);
    }
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

  const addressTextBoxStyle = {
    backgroundColor: "#1976d2",
    color: "#fff",
    float: "right",
    width: "250px",
    height: "38px",
    marginRight: "16px",
    borderRadius: "4px"
  }

  const donationsStyle = {
    color: "#fff"
  }

  return (
    <div className='main-app'>
      <div style={donationsStyle}>Donations Appreciated: 0x6Fc5567Cd168b5531Abd76Ef61F0ef6cFe020fDE</div>
      <ConnectionButton onConnected={onConnected} onDisconnected={onDisconnected} style={connectionButtonStyle} />
      {walletConnected ? null :
        <TextField style={addressTextBoxStyle} sx={{ input: { color: '#fff' } }} focus="false" id="wallet-input" placeholder="Wallet Address (View Only)" size="small" onChange={onWalletAddressChanged} />
      }
      <div><Box style={titleStyle}><h1>Reward Dashboard</h1></Box></div>
      <Grid container spacing={2}>
        <Grid item>
          {/* <Selector rewardData={rewards} actions={actionNames} onItemSelected={onSelectorItemSelected} /> */}
          <Profile rewardData={rewards} />
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
                  <Tooltip title="Claims all rewards from LPs, penDYST staking, and locked Pen">
                    <Button onClick={getClaimHandler} variant="contained">Claim All Rewards</Button>
                  </Tooltip>
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
        <Grid item xs={9} sm={2} md={4} lg={8} xl={9}>
          <RewardPanel rewardData={rewards}></RewardPanel>
        </Grid>
      </Grid>
    </div>
  )
}

export default App;
