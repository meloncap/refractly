import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';

const ClaimLpButton = ({ contract }) => {
  const claim = async () => {
    await contract.claimLpRewards();
  }

  return (
    <Tooltip title="Claims all rewards from LPs">
      <Button onClick={claim} variant="contained">Claim LPs</Button>
    </Tooltip>
  )
}

export default ClaimLpButton;
