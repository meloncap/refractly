import React, { useEffect, useState } from 'react';
import { formatAsUsd } from '../../utils/utils';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import './table.css';

const OptimizerLockTokenDashboard = ({ readContract, prices, optimizeVoteTokenAddr, optimizerTokenName }) => {
  const [lockData, setLockData] = useState([]);

  useEffect(() => {
    if (readContract && prices) {
      getLockData();
    } else {
      setLockData([]);
    }
  }, [readContract, prices]);

  const getLockData = () => {
    readContract.getOptimizerLockTokenData()
      .then(data => {
        var locks = [];

        data.locks.forEach(lock => {
          var d = new Date(0);
          d.setUTCSeconds(lock.unlockTime);
          locks.push({
            amount: lock.amount / 10**18,
            unlockTime: lock.unlockTime,
            unlockDate: d,
            price: prices[optimizeVoteTokenAddr],
            disabled: d > new Date()
          });
        });

        setLockData(locks);
      });
  }

  const tableStyle = {
    backgroundImage:"radial-gradient(circle farthest-corner at 0 0,rgba(184,144,242,.61),rgba(38,125,255,.74) 52%,hsla(0,0%,100%,.2))",
    backgroundColor:"rgba(4,7,31,.8)",
    borderRadius:"1rem",
    overflow:"hidden",
  }

  const innerTableStyle = {
    border:"1px solid hsla(0,0%,100%,.3)",
    borderRadius:"1rem",
    backgroundColor:"rgba(4,7,31,.8)",
    padding:"8px",
    width:"100%",
    boxSizing:"border-box"
  }

  const headerStyle = {
    alignItems: "center",
    borderBottom: "2px solid hsla(0,0%,100%,.2)",
    padding: "12px",
    marginBottom: "8px",
    color: "#fff",
    fontSize: "18px",
    fontWeight: "600"
  }

  const tableBodyStyle = {
    overflow: "hidden auto"
  }

  const rowStyle = {
    color: "#fff"
  }

  return (
    <Container maxWidth="md">
      <Box sx={tableStyle}>
        <Box sx={innerTableStyle}>
          <Box sx={headerStyle}>
            <Grid container spacing={2} direction="row" justifyContent="center" alignItems="center">
              <Grid item container xs={4} justifyContent="center" alignItems="center">
                {optimizerTokenName} Amount
              </Grid>
              <Grid item container xs={4} justifyContent="center" alignItems="center">
                Value
              </Grid>
              <Grid item container xs={4} justifyContent="center" alignItems="center">
                Unlock Time
              </Grid>
            </Grid>
          </Box>
          <Box className="table-body" sx={tableBodyStyle}>
            {lockData.map((row, i) => (
              <Box key={i} sx={{padding: "16px 12px", background: i % 2 === 0 ? "": "hsla(0,0%,100%,.05)", borderRadius: i % 2 === 0 ? "": "10px"}}>
                <Grid container spacing={2} direction="row" justifyContent="center" alignItems="center" style={rowStyle}>
                  <Grid item container xs={4} justifyContent="center" alignItems="center">
                    {Number(row.amount).toFixed(3)}
                  </Grid>
                  <Grid item container xs={4} justifyContent="center" alignItems="center">
                    {formatAsUsd(row.amount * row.price)}
                  </Grid>
                  <Grid item container xs={4} justifyContent="center" alignItems="center">
                    {row.unlockDate.toLocaleString()}
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Container>
  )
}

export default OptimizerLockTokenDashboard;