import React, { useState } from 'react';
import './App.css';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Link, Routes, Route } from 'react-router-dom';
import LockedPenDashboard from './LockedPenDashboard';
import { tabTheme } from './styles/theme';
import ConnectionButton from './ConnectionButton';
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import { useStickyState } from './useStickyState';
import Web3 from 'web3';
import RewardDashboard from './RewardDashboard';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import { truncateAddress } from './utils';

const App = () => {
  const [account, setAccount] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [web3, setWeb3] = useState(null);
  const [actionsDisabled, setActionsDisabled] = useState(true);
  const [tabValue, setTabValue] = useStickyState(0);

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
  }

  const onWalletAddressChanged = async (event) => {
    const address = event.currentTarget.value;

    if(address && Web3.utils.isAddress(address)) {
      setAccount(address);
      // const web3 = new Web3(process.env.REACT_APP_ALCHEMY_URL);
      const web3 = createAlchemyWeb3(process.env.REACT_APP_ALCHEMY_URL)
      setWeb3(web3);
      setActionsDisabled(false);
    }
    else {
      setAccount(null);
      setWeb3(null);
      setActionsDisabled(true);
    }
  }

  const connectionButtonStyle = {
    width: "200px"
  }

  const addressTextBoxStyle = {
    backgroundColor: "#1976d2",
    color: "#fff",
    width: "225px",
    height: "36.5px",
    borderRadius: "4px"
  }

  const headerStyle = {
    color: "#fff"
  }

  const tabsStyle = {
    margin: "16px 0"
  }

  const handleChange = (_, newValue) => {
    setTabValue(newValue);
  }

  const donationAddr = "0x6Fc5567Cd168b5531Abd76Ef61F0ef6cFe020fDE";

  return (
    <div className='main-app'>
      <BrowserRouter>
        <React.Fragment>
          {/* <h3 style={headerStyle}>Refractly</h3> */}
          <Box sx={{display: "flex", justifyContent: "space-between", flexGrow: 1}}>
            <div style={headerStyle}>
              Donations Appreciated: {truncateAddress(donationAddr)}
              <Tooltip title="Click to copy address">
                <IconButton onClick={() => navigator.clipboard.writeText(donationAddr)} variant="contained" edge="end" sx={{color: "lightgrey" }}>
                  <ContentCopyOutlinedIcon />
                </IconButton>
              </Tooltip>
            </div>
            <Grid container item spacing={1} justifyContent="flex-end" sx={{maxWidth: "500px"}}>
              <Grid item>
                {walletConnected ? null :
                    <TextField style={addressTextBoxStyle} sx={{ input: { color: '#fff' } }} focus="false" id="wallet-input" placeholder="Wallet Address (View Only)" size="small" onChange={onWalletAddressChanged} />
                }
              </Grid>
              <Grid item>
                <ConnectionButton onConnected={onConnected} onDisconnected={onDisconnected} style={connectionButtonStyle} />
              </Grid>
            </Grid>
          </Box>
          <Box sx={{display: "flex", justifyContent: "center"}}>
            <ThemeProvider theme={tabTheme}>
              <Tabs value={tabValue} onChange={handleChange} centered style={tabsStyle}>
                  <Tab label='Dashboard'  to='/' component={Link} />
                  <Tab label='Locked PEN'  to='/lockedPen' component={Link} />
              </Tabs>
            </ThemeProvider>
          </Box>
          <Routes>
            <Route index element={<RewardDashboard account={account} web3={web3} walletConnected={walletConnected} actionsDisabled={actionsDisabled} />} />
            <Route path="/" element={<RewardDashboard account={account} web3={web3} walletConnected={walletConnected} actionsDisabled={actionsDisabled} />} />
            <Route path="/lockedPen" element={<LockedPenDashboard account={account} web3={web3} />} />
          </Routes>
        </React.Fragment>
      </BrowserRouter>
    </div>
  )
}

export default App;
