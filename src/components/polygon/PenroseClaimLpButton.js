import React, { useEffect, useState } from 'react';
import ClaimLpButton from '../base/portfolio/buttons/ClaimLpButton';
import { PenroseWriteContract } from '../../contracts/polygon/PenroseWriteContract';

const PenroseClaimLpButton = ({ web3, account }) => {
  const [contract, setContract] = useState(null);

  useEffect(() => {
    if (account && web3) {
      setContract(new PenroseWriteContract(web3, account));
    }
  }, [account, web3]);

  return (
    <ClaimLpButton contract={contract} />
  )
}

export default PenroseClaimLpButton;
