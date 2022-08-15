import React, { useState } from 'react';
import ActionDrawer from './ActionDrawer';
import RewardPanel from './RewardPanel';

const RewardDashboard = ({ account, web3, rewards, prices, symbols }) => {
  const [actionDrawerOpen, setActionDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    setActionDrawerOpen(open);
  }

  return (
    <React.Fragment>
      <RewardPanel rewardData={rewards} prices={prices} symbols={symbols}></RewardPanel>
      <ActionDrawer anchor="left"
        open={actionDrawerOpen}
        onClose={toggleDrawer(false)}
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
      />
    </React.Fragment>
  )
}

export default RewardDashboard;
