import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import Web3 from 'web3';
import { getPolygonProfile } from './polygonProfileFetcher';
import { ChainHex } from './utils/chains';
import AppHeader from './components/base/AppHeader';
import PenroseAppBody from './components/polygon/PenroseAppBody';
import UknownAppBody from './components/bsc/UknownAppBody';

const App = () => {
  const [account, setAccount] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [web3, setWeb3] = useState(null);
  const [chainId, setChainId] = useState();
  const [actionsDisabled, setActionsDisabled] = useState(true);
  const [tokenPrices, setTokenPrices] = useState(null);
  const [tokenSymbols, setTokenSymbols] = useState(null);
  const [pools, setPools] = useState(null);
  const [rewards, setRewards] = useState(null);
  const [balances, setBalances] = useState(null);

  useEffect(() => {
    if (account && web3) {
      if (chainId === ChainHex.Polygon) {
        getRewardHandler();
      }
    }
  }, [account, web3, chainId]);

  const getRewardHandler = async () => {
    getPolygonProfile(web3, account)
      .then(profile => {
        if (!profile) return;
        setRewards(profile.rewards);
        setBalances(profile.balances);
        setPools(profile.pools);
        setTokenPrices(profile.prices);
        setTokenSymbols(profile.symbols);
      });
  }

  const onConnected = (web3, account, hexChainId) => {
    setWalletConnected(true);
    resetData();
    setAccount(account);
    setWeb3(web3);
    setChainId(hexChainId);
    setActionsDisabled(false);
  }

  const onDisconnected = () => {
    setWalletConnected(false);
    reset();
  }

  const onChainChanged = (hexChainId) => {
    setChainId(hexChainId);
    resetData();
    if (hexChainId == ChainHex.Polygon) {
      getRewardHandler();
    }
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
      reset();
    }
  }

  const reset = () => {
    setAccount(null);
    setWeb3(null);
    setChainId(null);
    setActionsDisabled(true);
    resetData();
  }

  const resetData = () => {
    setRewards(null);
    setBalances(null);
    setPools(null);
    setTokenPrices(null);
    setTokenSymbols(null);
  }

  let body = <div></div>

  if (chainId == ChainHex.BSC) {
    body = <UknownAppBody />
  } else {
    body = <PenroseAppBody
              web3={web3}
              account={account}
              balances={balances}
              rewards={rewards}
              pools={pools}
              prices={tokenPrices}
              symbols={tokenSymbols}
              walletConnected={walletConnected}
              actionsDisabled={actionsDisabled}
              onRefreshHandler={getRewardHandler}
            />;
  }

  return (
    <div className='main-app'>
      <BrowserRouter>
        <React.Fragment>
          <AppHeader
            onConnected={onConnected}
            onDisconnected={onDisconnected}
            onChainChanged={onChainChanged}
            onWalletAddressChanged={onWalletAddressChanged}
            walletConnected={walletConnected}
          />
          {body}
        </React.Fragment>
      </BrowserRouter>
    </div>
  )
}

export default App;
