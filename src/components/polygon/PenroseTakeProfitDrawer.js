import React from 'react';
import { PolygonAddresses } from '../../utils/chains';
import TakeProfitDrawer from '../base/TakeProfitDrawer';

const PenroseTakeProfitDrawer = ({ open, web3, account, profitToken, symbols, onToggerDrawer}) => {
  return (
    <TakeProfitDrawer
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
      token={profitToken}
      symbols={symbols}
      dexTokenAddr={PolygonAddresses.Dyst}
      optimizerTokenAddr={PolygonAddresses.Pen}
      routerContractAddr="0xbe75dd16d029c6b32b7ad57a0fd9c1c20dd2862e"
      routeThroughTokens={[PolygonAddresses.WMatic, PolygonAddresses.UsdPlus]}
    />
  )
};

export default PenroseTakeProfitDrawer;