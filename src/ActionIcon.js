import React from 'react';
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';

export const States = {
  Completed: "Completed",
  Pending: "Pending",
  Skipping: "Skipping",
  Running: "Running",
  Failed: "Failed"
}

const ActionIcon = ({ action, index, state, onToggled }) => {
  const [checked, setChecked] = React.useState(true);

  const boxStyle = {
    display:"flex",
    alignItems:"center",
    borderRadius:"0.25rem",
    border: "1px solid hsla(0,0%,100%,.1)",
    background: "radial-gradient(85.91% 137.55% at 59% -53.82%, rgba(255, 255, 255, 0.4) 0px, rgba(255, 255, 255, 0) 100%), rgba(255, 255, 255, 0.15)",
    minHeight:"65px",
    maxWidth:"300px",
    minWidth:"300px",
    marginBottom:"8px",
    fontWeight: "700",
    color: "white"
  }

  const switchStyle = {
    width: "20%",
    display: "flex",
    justifyContent: "center"
  }

  const actionStyle = {
    width: "60%",
    display: "flex",
    justifyContent:"center"
  }

  const iconStyle = {
    width: "20%",
    display: "flex",
    justifyContent: "center"
  }

  const label = { inputProps: { 'aria-label': `switch for ${action}` } };

  const handleChange = (event) => {
    setChecked(event.target.checked);
    onToggled(index, event.target.checked);
  };

  const stateIcons = {
    [States.Completed]: <CheckCircleOutlineOutlinedIcon fontSize="large" style={{color: 'green'}} />,
    [States.Pending]: <PendingOutlinedIcon fontSize="large" style={{color: 'yellow'}}></PendingOutlinedIcon>,
    [States.Running]: <CircularProgress size={32} thickness={4} />,
    [States.Skipping]: <NotInterestedIcon fontSize="large" style={{color: 'grey'}} />,
    [States.Failed]: <ErrorOutlineOutlinedIcon fontSize="large" style={{color: 'red'}} />,
  }

  return (
    <Box style={boxStyle}>
      <Box style={switchStyle}>
        <Switch {...label} checked={checked} onChange={handleChange}/>
      </Box>
      <Box style={actionStyle}>
        {action}
      </Box>
      <Box style={iconStyle}>
        {stateIcons[state]}
      </Box>
    </Box>
    )
};

export default ActionIcon;
