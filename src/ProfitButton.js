import React, { useState } from "react";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import TakeProfitDrawer from "./TakeProfitDrawer";
import TakeProfitDialog from "./TakeProfitDialog";

const ProfitButton = ({ web3, account, symbols }) => {
  const [actionDrawerOpen, setActionDrawerOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [profitToken, setProfitToken] = useState(null);

  const toggleDrawer = (open) => (event) => {
    setActionDrawerOpen(open);
  }

  const takeProfit = () => {
    setActionDialogOpen(true);
  }

  const onClose = () => {
    setActionDialogOpen(false);
  }

  const onSubmit = (value) => {
    setActionDialogOpen(false);
    setProfitToken(value);
    setActionDrawerOpen(true);
  }

  return (
    <>
      <Tooltip title="Swaps all DYST and PEN in wallet for selected token">
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
        token={profitToken}
        symbols={symbols}
      />
      <TakeProfitDialog open={actionDialogOpen} onClose={onClose} onSubmit={onSubmit}/>
    </>
  )
}

export default ProfitButton;