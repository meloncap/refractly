import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import Drawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import ActionIcon, { States } from './ActionIcon';
import { RouterContract } from "../../contracts/RouterContract";
import { TokenContract } from "../../contracts/base/TokenContract";
import { determineRoute } from '../../utils/tokenRouter';

const TakeProfitDrawer = (props) => {
  const {web3, account, token, symbols, dexTokenAddr, optimizerTokenAddr, routeThroughTokens, routerContractAddr, ...drawerProps} = props;
  const [states, setStates] = useState({0: States.Pending, 1: States.Pending, 2: States.Pending, 3: States.Pending});
  const [error, setError] = useState(null);

  useEffect(() => {
    if (drawerProps.open && web3 && account && token && symbols) {
      resetActions();
      runActions();
    }
  }, [drawerProps.open, web3, account, token, symbols])

  const modifyState = (index, newStateValue, setStateFn) => {
    setStateFn(previousState => ({ ...previousState, [index]: newStateValue }));
  }

  const resetActions = () => {
    setError(null);
    setStates({0: States.Pending, 1: States.Pending, 2: States.Pending, 3: States.Pending});
  }

  const runActions = async () => {
    const contract = new RouterContract(web3, account);
    setError(null);

    const toToken = Object.keys(symbols).find(key => symbols[key] === token);

    await swapToken(contract, dexTokenAddr, toToken, routeThroughTokens, 0, 1);
    await swapToken(contract, optimizerTokenAddr, toToken, routeThroughTokens, 2, 3);
  }

  const swapToken = async (routerContract, fromToken, toToken, middleTokens, state0, state1) => {

    try {
      modifyState(state0, States.Running, setStates);

      const tokenContract = new TokenContract(web3, fromToken, account);
      const balance = await tokenContract.getBalanceOf();

      if (balance > 0) {
        const allowance = await tokenContract.allowance(routerContractAddr);

        if (allowance < balance) {
          await tokenContract.approve(routerContractAddr);
        }

        modifyState(state0, States.Completed, setStates);

        try {
          modifyState(state1, States.Running, setStates);

          const { amount, routes } = await determineRoute(routerContract, fromToken, toToken, balance, middleTokens);

          const amounts = await routerContract.swapExactTokensForTokens(
            balance,
            amount,
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

  if (!symbols) {
    return <></>;
  }

  return (
    <Drawer
      {...drawerProps}
    >
      <div style={drawerHeader}>
        <IconButton onClick={closeDrawer} variant="contained" size="large" edge="end" sx={{color: "lightgrey" }}>
          <CloseIcon size="large"/>
        </IconButton>
      </div>
      <Grid container spacing={2} style={actionGridStyle} direction="column">
        <Grid item>
          <ActionIcon action={`Approve Spending of ${symbols[dexTokenAddr]}`} index={0} state={states[0]}></ActionIcon>
        </Grid>
        <Grid item>
          <ActionIcon action={`Swap ${symbols[dexTokenAddr]} for ${token}`} index={1} state={states[1]}></ActionIcon>
        </Grid>
        <Grid item>
          <ActionIcon action={`Approve Spending of ${symbols[optimizerTokenAddr]}`} index={2} state={states[2]}></ActionIcon>
        </Grid>
        <Grid item>
          <ActionIcon action={`Swap ${symbols[optimizerTokenAddr]} for ${token}`} index={3} state={states[3]}></ActionIcon>
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