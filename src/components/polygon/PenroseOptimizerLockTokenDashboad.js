import React, { useEffect, useState } from 'react';
import OptimizerLockTokenDashboard from '../base/OptimizerLockTokenDashboard';
import { PenroseReadContract } from '../../contracts/polygon/PenroseReadContract';
import { PolygonAddresses, PolygonTokens } from '../../utils/chains';

const PenroseOptimizerLockTokenDashboad = ({ web3, account, prices }) => {
  const [readContract, setReadContract] = useState(null);

  useEffect(() => {
    if (account && web3) {
      setReadContract(new PenroseReadContract(web3, account));
    } else {
      setReadContract(null);
    }
  }, [account, web3]);

  return (
    <OptimizerLockTokenDashboard
      readContract={readContract}
      prices={prices}
      optimizeVoteTokenAddr={PolygonAddresses.PenDyst}
      optimizerTokenName={PolygonTokens.OptimizerToken}
    />
  )
}

export default PenroseOptimizerLockTokenDashboad;
