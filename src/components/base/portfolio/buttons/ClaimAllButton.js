import React from 'react';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';

const ClaimAllButton = ({ title, contract }) => {
  const claim = async () => {
    await contract.claimAll();
  }

  return (
    <Tooltip title={title}>
      <Button onClick={claim} variant="contained">Claim All</Button>
    </Tooltip>
  )
}

export default ClaimAllButton;
