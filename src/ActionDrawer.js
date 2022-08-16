import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import Drawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ActionIcon, { States } from './ActionIcon';
import { TokenContract } from "./contracts/TokenContract";
import { WriteContract } from "./contracts/WriteContract";
import { dystAddr, penDystAddr, penAddr } from './addresses';

const ActionDrawer = (props) => {
  const [states, setStates] = useState({0: States.Pending, 1: States.Pending, 2: States.Pending, 3: States.Pending});
  const [actionStates, setActionStates] = useState({0: true, 1: true, 2: true, 3: true});
  const [error, setError] = useState(null);

  useEffect(() => {
    if (props.open) {
      resetActions();
    }
  }, [props.open])

  const modifyState = (index, newStateValue, setStateFn) => {
    setStateFn(previousState => ({ ...previousState, [index]: newStateValue }));
  }

  const handleToggle = (index, value) => {
    modifyState(index, value, setActionStates);

    if (value) {
      modifyState(index, States.Pending, setStates);
    } else {
      modifyState(index, States.Skipping, setStates);
    }
  };

  const resetActions = () => {
    setError(null);
    setStates({0: States.Pending, 1: States.Pending, 2: States.Pending, 3: States.Pending});
    setActionStates({0: true, 1: true, 2: true, 3: true});
  }

  const runActions = async () => {
    const contract = new WriteContract(props.web3, props.account);
    setError(null);
  
    if (actionStates[0]) {
      try {
        modifyState(0, States.Running, setStates);
        await contract.claimAll();
        modifyState(0, States.Completed, setStates);
      } catch (error) {
        modifyState(0, States.Failed, setStates);
        setError(error.message);
      }
    }

    if (actionStates[1]) {
      try {
        modifyState(1, States.Running, setStates);
        const tokenContract = new TokenContract(props.web3, dystAddr, props.account);
        const dystBalance = await tokenContract.getBalanceOf();
        if (dystBalance > 0) {
          await contract.convertDystToPenDystAndStake();
          modifyState(1, States.Completed, setStates);
        } else {
          modifyState(1, States.Skipping, setStates);
        }
      } catch (error) {
        modifyState(1, States.Failed, setStates);
        setError(error.message);
      }
    }

    if (actionStates[2]) {
      try {
        modifyState(2, States.Running, setStates);
        const tokenContract = new TokenContract(props.web3, penDystAddr, props.account);
        const penDystBalance = await tokenContract.getBalanceOf();
        if (penDystBalance > 0) {
          await contract.stakePenDyst();
          modifyState(2, States.Completed, setStates);
        } else {
          modifyState(2, States.Skipping, setStates);
        }
      } catch (error) {
        modifyState(2, States.Failed, setStates);
        setError(error.message);
      }
    }

    if (actionStates[3]) {
      try {
        modifyState(3, States.Running, setStates);
        const tokenContract = new TokenContract(props.web3, penAddr, props.account);
        const penBalance = await tokenContract.getBalanceOf();
        if (penBalance > 0) {
          await contract.voteLockPen(penBalance);
          modifyState(3, States.Completed, setStates);
        } else {
          modifyState(3, States.Skipping, setStates);
        }
      } catch (error) {
        modifyState(3, States.Failed, setStates);
        setError(error.message);
      }
    }
  }

  const closeDrawer = () => {
    props.onClose();
  }

  const actionGridStyle = {
    paddingTop: "2rem",
    alignItems: "center",
    justifyContent: "center"
  }

  const errorBoxStyle = {
    borderRadius:"0.25rem",
    border: "1px solid hsla(0,0%,100%,.1)",
    background: "radial-gradient(85.91% 137.55% at 59% -53.82%, rgba(255, 6, 6, 0.8) 0px, rgba(255, 0, 0, 0) 100%), rgba(255, 6, 6, 0.3)",
    minHeight:"165px",
    maxWidth:"300px",
    minWidth:"300px",
    marginBottom:"8px",
    fontWeight: "700",
    color: "white"
  }

  const errorInnerBoxStyle = {
    padding: "8px"
  }

  const drawerHeader = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px'
  }

  return (
    <Drawer
      {...props}
    >
      <div style={drawerHeader}>
        <IconButton onClick={closeDrawer} variant="contained" size="large" edge="end" sx={{color: "lightgrey" }}>
          <CloseIcon size="large"/>
        </IconButton>
      </div>
      <Grid container spacing={2} style={actionGridStyle} direction="column">
        <Grid item>
          <ActionIcon action="Claim All Rewards" index={0} state={states[0]} onToggled={handleToggle} switchable></ActionIcon>
        </Grid>
        <Grid item>
          <ActionIcon action="Convert/Stake penDYST" index={1} state={states[1]} onToggled={handleToggle} switchable></ActionIcon>
        </Grid>
        <Grid item>
          <ActionIcon action="Stake penDYST" index={2} state={states[2]} onToggled={handleToggle} switchable></ActionIcon>
        </Grid>
        <Grid item>
          <ActionIcon action="Lock PEN" index={3} state={states[3]} onToggled={handleToggle} switchable></ActionIcon>
        </Grid>
        <Grid item>
          <Tooltip title="Run pending actions">
            <Button onClick={runActions} variant="contained" style={{marginTop: "16px"}}>Run Actions</Button>
          </Tooltip>
        </Grid>
        {error ?
        <Grid item>
          <Box style={errorBoxStyle}>
            <Box style={errorInnerBoxStyle}>
            {error}
            </Box>
          </Box>
        </Grid>
        :
        null}
      </Grid>
    </Drawer>
  )
};

export default ActionDrawer;