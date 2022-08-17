import React, { useState } from 'react';
import ActionButton from '../base/portfolio/buttons/ActionButton';
import PenroseActionDrawer from './PenroseActionDrawer';

const PenroseActionButton = ({ web3, account }) => {
  const [actionDrawerOpen, setActionDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    setActionDrawerOpen(open);
  }

  return (
    <ActionButton
      onToggerDrawer={toggleDrawer}
    >
        <PenroseActionDrawer
          open={actionDrawerOpen}
          web3={web3}
          account={account}
          onToggerDrawer={toggleDrawer}
        />
    </ActionButton>
  )
};

export default PenroseActionButton;
