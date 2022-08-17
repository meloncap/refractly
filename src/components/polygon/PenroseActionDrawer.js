import React, { useEffect, useState } from 'react';
import { PenroseWriteContract } from "../../contracts/polygon/PenroseWriteContract";
import ActionDrawer from '../base/ActionDrawer';
import { PolygonAddresses, PolygonTokens } from '../../utils/chains';

const PenroseActionDrawer = ({ open, web3, account, onToggerDrawer }) => {
  const [contract, setContract] = useState(null);

  useEffect(() => {
    if (account && web3) {
      setContract(new PenroseWriteContract(web3, account));
    }
  }, [account, web3]);

  return (
    <ActionDrawer
      anchor="left"
      open={open}
      onClose={onToggerDrawer(false)}
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
      optimizerTokenName={PolygonTokens.OptimizerToken}
      optimizerVoteTokenName={PolygonTokens.OptimizerVoteToken}
      dexTokenAddr={PolygonAddresses.DexToken}
      optimizerTokenAddr={PolygonAddresses.OptimizerToken}
      optimizerVoteTokenAddr={PolygonAddresses.OptimizerVoteToken}
      writeContract={contract}
    />
  )
};

export default PenroseActionDrawer;