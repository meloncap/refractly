import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import Drawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import ActionIcon, { States } from './ActionIcon';
import { RouterContract } from "./contracts/RouterContract";
import { TokenContract } from "./contracts/TokenContract";
import { dystAddr, penAddr, wmaticAddr, usdcAddr } from './addresses';

const TakeProfitDrawer = (props) => {
  const [states, setStates] = useState({0: States.Pending, 1: States.Pending, 2: States.Pending, 3: States.Pending});
  const [error, setError] = useState(null);

  useEffect(() => {
    if (props.open) {
      resetActions();
      runActions();
    }
  }, [props.open])

  const modifyState = (index, newStateValue, setStateFn) => {
    setStateFn(previousState => ({ ...previousState, [index]: newStateValue }));
  }

  const resetActions = () => {
    setError(null);
    setStates({0: States.Pending, 1: States.Pending, 2: States.Pending, 3: States.Pending});
  }

  const runActions = async () => {
    const contract = new RouterContract(props.web3, props.account);
    setError(null);

    await swapToken(contract, dystAddr, 0, 1);
    await swapToken(contract, penAddr, 2, 3);
  }

  const swapToken = async (routerContract, tokenAddr, state0, state1) => {

    try {
      modifyState(state0, States.Running, setStates);

      const tokenContract = new TokenContract(props.web3, tokenAddr, props.account);
      const balance = await tokenContract.getBalanceOf();

      if (balance > 0) {
        const allowance = await tokenContract.allowance("0xbe75dd16d029c6b32b7ad57a0fd9c1c20dd2862e");

        if (allowance < balance) {
          await tokenContract.approve("0xbe75dd16d029c6b32b7ad57a0fd9c1c20dd2862e");
        }

        modifyState(state0, States.Completed, setStates);

        try {
          modifyState(state1, States.Running, setStates);
          let routes = [];

          const amountOut0 = await routerContract.getAmountOut(balance, tokenAddr, wmaticAddr);
          routes.push({from: tokenAddr, to: wmaticAddr, stable: amountOut0.stable});
    
          const amountOut1 = await routerContract.getAmountOut(amountOut0.amount, wmaticAddr, usdcAddr);
          routes.push({from: wmaticAddr, to: usdcAddr, stable: amountOut1.stable});

          const amounts = await routerContract.swapExactTokensForTokens(
            balance,
            amountOut1.amount,
            routes
          );
          console.log(amounts);
          modifyState(state1, States.Completed, setStates);
        } catch (error) {
          modifyState(state1, States.Failed, setStates);
          setError(error.message);
        }
      } else {
        modifyState(state0, States.Skipping, setStates);
        modifyState(state1, States.Skipping, setStates);
      }
    } catch (error) {
      modifyState(state0, States.Failed, setStates);
      modifyState(state1, States.Skipping, setStates);
      setError(error.message);
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
          <ActionIcon action="Approve Spending of DYST" index={0} state={states[0]}></ActionIcon>
        </Grid>
        <Grid item>
          <ActionIcon action="Swap DYST for USDC" index={1} state={states[1]}></ActionIcon>
        </Grid>
        <Grid item>
          <ActionIcon action="Approve Spending of PEN" index={2} state={states[2]}></ActionIcon>
        </Grid>
        <Grid item>
          <ActionIcon action="Swap PEN for USDC" index={3} state={states[3]}></ActionIcon>
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

export default TakeProfitDrawer;