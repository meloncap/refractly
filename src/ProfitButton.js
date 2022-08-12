import React, { useState } from "react";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import TakeProfitDrawer from "./TakeProfitDrawer";

const ProfitButton = ({ web3, account }) => {
  const [actionDrawerOpen, setActionDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    setActionDrawerOpen(open);
  }

  const takeProfit = (web3, account) => {
    setActionDrawerOpen(true);
  }

  return (
    <>
      <Tooltip title="Sells all DYST and PEN  in wallet for USDC">
        <Button onClick={takeProfit} variant="contained">Take Profit</Button>
      </Tooltip>
      <TakeProfitDrawer anchor="left"
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
    </>
  )
}

export default ProfitButton;