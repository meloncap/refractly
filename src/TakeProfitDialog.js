import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Radio from '@mui/material/Radio';

export default function TakeProfitDialog({ open, onClose, onSubmit }) {
  const [value, setValue] = useState("USDC");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = () => {
    onSubmit(value);
  };

  return (
    <Dialog
      disableEscapeKeyDown
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
            backgroundColor: "#151718",
            color: "#fff"
        }
      }}
    >
      <DialogTitle>Select Token</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
        <FormControl>
          <RadioGroup
              value={value}
              onChange={handleChange}
              name="radio-buttons-group-profit-token"
          >
              <FormControlLabel value="USDC" control={<Radio sx={{color: "#1976d2"}} />} label="USDC" />
              <FormControlLabel value="USD+" control={<Radio sx={{color: "#1976d2"}}/>} label="USD+" />
              <FormControlLabel value="WMATIC" control={<Radio sx={{color: "#1976d2"}}/>} label="WMATIC" />
          </RadioGroup>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
}
