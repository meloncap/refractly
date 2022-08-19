import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import ConnectionButton from '../base/ConnectionButton';

const AppHeader = ({ onConnected, onDisconnected, onChainChanged, onWalletAddressChanged, walletConnected }) => {
  const addressTextBoxStyle = {
    backgroundColor: "#1976d2",
    color: "#fff",
    width: "225px",
    height: "36.5px",
    borderRadius: "4px"
  }

  const headerStyle = {
    color: "#fff",
    fontSize: "30px",
    fontFamily: "Titillium"
  }

  const donationAddr = "0x6Fc5567Cd168b5531Abd76Ef61F0ef6cFe020fDE";

  return (
    <Box sx={{display: "flex", justifyContent: "space-between", flexGrow: 1}}>
      <div style={headerStyle}>
        Refractly
      </div>
      <Grid container item spacing={1} justifyContent="flex-end" sx={{maxWidth: "500px"}}>
        <Grid item>
          {walletConnected ? null :
              <TextField style={addressTextBoxStyle} sx={{ input: { color: '#fff' } }} focus="false" id="wallet-input" placeholder="Wallet Address (View Only)" size="small" onChange={onWalletAddressChanged} />
          }
        </Grid>
        <Grid item>
          <ConnectionButton onConnected={onConnected} onDisconnected={onDisconnected} onChainChanged={onChainChanged} />
        </Grid>
      </Grid>
    </Box>
  )
}

export default AppHeader;
