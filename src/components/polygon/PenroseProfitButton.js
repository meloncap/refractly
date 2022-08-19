import React, { useState } from "react";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import TakeProfitDialog from "../base/TakeProfitDialog";
import PenroseTakeProfitDrawer from "./PenroseTakeProfitDrawer";

const PenroseProfitButton = ({ web3, account, symbols }) => {
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
      <PenroseTakeProfitDrawer
        open={actionDrawerOpen}
        web3={web3}
        account={account}
        profitToken={profitToken}
        symbols={symbols}
        onToggerDrawer={toggleDrawer}
      />
      <TakeProfitDialog
        open={actionDialogOpen}
        onClose={onClose}
        onSubmit={onSubmit}
        options={["USDC", "USD+", "USDT", "WMATIC"]}
      />
    </>
  )
}

export default PenroseProfitButton;