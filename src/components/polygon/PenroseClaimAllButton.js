import React, { useEffect, useState } from 'react';
import ClaimAllButton from '../base/portfolio/buttons/ClaimAllButton';
import { PenroseWriteContract } from '../../contracts/polygon/PenroseWriteContract';

const PenroseClaimAllButton = ({ web3, account }) => {
  const [contract, setContract] = useState(null);

  useEffect(() => {
    if (account && web3) {
      setContract(new PenroseWriteContract(web3, account));
    }
  }, [account, web3]);

  return (
    <ClaimAllButton title="Claims all rewards from LPs, penDYST staking, and locked Pen" contract={contract} />
  )
}

export default PenroseClaimAllButton;
