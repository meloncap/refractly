import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Web3 from 'web3';
import Web3Modal from "web3modal";
import { ethers } from 'ethers';
import { providerOptions } from '../../providerOptions';
import { truncateAddress } from '../../utils/utils';
import './connection-button.css';

const web3Modal = new Web3Modal({
  cacheProvider: true,
  theme: "dark",
  providerOptions
});

const ConnectionButton = ({
  onConnected, onDisconnected, onChainChanged
}) => {
  const [provider, setProvider] = useState();
  const [account, setAccount] = useState();
  const [error, setError] = useState("");

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connectWallet();
    }
  }, []);

  useEffect(() => {
    if (provider && provider.on && onChainChanged) {
      const handleAccountsChanged = (accounts) => {
        console.log("accountsChanged", accounts);
        if (accounts) setAccount(accounts[0]);
      };

      const handleChainChanged = (hexChainId) => {
        onChainChanged(hexChainId);
      };

      const handleDisconnect = () => {
        console.log("disconnect", error);
        disconnect();
      };

      provider.on("accountsChanged", handleAccountsChanged);
      provider.on("chainChanged", handleChainChanged);
      provider.on("disconnect", handleDisconnect);

      return () => {
        if (provider.removeListener) {
          provider.removeListener("accountsChanged", handleAccountsChanged);
          provider.removeListener("chainChanged", handleChainChanged);
          provider.removeListener("disconnect", handleDisconnect);
        }
      };
    }
  }, [provider, onChainChanged]);

  const connectWallet = async () => {
    try {
      const provider = await web3Modal.connect();
      const library = new ethers.providers.Web3Provider(provider);
      const accounts = await library.listAccounts();
      const network = await library.getNetwork();
      setProvider(provider);
      if (accounts) setAccount(accounts[0]);

      const web3 = new Web3(provider);
      onConnected(web3, accounts[0], network.chainId);
    } catch (error) {
      setError(error);
    }
  };

  const refreshState = () => {
    setAccount();
  };

  const disconnect = () => {
    web3Modal.clearCachedProvider();
    refreshState();
    onDisconnected()
  };

  return (
    <div>
      {account
      ?
      <Button className="connection-button" onClick={disconnect} variant="contained">{truncateAddress(account)}</Button>
      :
      <Button className="connection-button" onClick={connectWallet} variant="contained">Connect Wallet</Button>}
    </div>
  )
}

export default ConnectionButton;