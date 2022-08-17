import React from 'react';
import IconButton from '@mui/material/IconButton';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import Tooltip from '@mui/material/Tooltip';

const ActionButton = ({ onToggerDrawer, children }) => {
  return (
    <>
      <Tooltip title="Open drawer for more actions">
        <IconButton onClick={onToggerDrawer(true)} variant="contained" style={{backgroundColor: "#1976d2", color: "#fff"}}>
            <MenuOutlinedIcon />
        </IconButton>
      </Tooltip>
      {children}
    </>
  )
};

export default ActionButton;
