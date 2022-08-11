import React from 'react';
import { formatAsUsd } from './utils';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import './LockedPenDashboard.css';

const LpDashboard = ({ pools, prices, symbols }) => {
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

  if (!pools) {
    pools = [];
  }

  return (
    <Container maxWidth="md">
      <Box sx={tableStyle}>
        <Box sx={innerTableStyle}>
          <Box sx={headerStyle}>
            <Grid container spacing={2} direction="row" justifyContent="center" alignItems="center">
              <Grid item container xs={3} justifyContent="center" alignItems="center">
                Pool
              </Grid>
              <Grid item container xs={3} justifyContent="center" alignItems="center">
                Type
              </Grid>
              <Grid item container xs={3} justifyContent="center" alignItems="center">
                Tokens
              </Grid>
              <Grid item container xs={3} justifyContent="center" alignItems="center">
                Balance
              </Grid>
            </Grid>
          </Box>
          <Box className="table-body" sx={tableBodyStyle}>
            {pools.map((row, i) => (
              <Box key={i} sx={{padding: "16px 12px", background: i % 2 === 0 ? "": "hsla(0,0%,100%,.05)", borderRadius: i % 2 === 0 ? "": "10px"}}>
                <Grid container spacing={2} direction="row" justifyContent="center" alignItems="center" style={rowStyle}>
                  <Grid item container xs={3} justifyContent="center" alignItems="center">
                    {symbols[row.token0]} ... {symbols[row.token1]}
                  </Grid>
                  <Grid item container xs={3} justifyContent="center" alignItems="center">
                    {row.stable ? "S" : "V"}
                  </Grid>
                  <Grid item container xs={3} justifyContent="center" alignItems="center">
                    <Box sx={{display: "block"}}>
                      <Box>{row.amount0.toFixed(3)} {symbols[row.token0]}</Box>
                      <Box>{row.amount1.toFixed(3)} {symbols[row.token1]}</Box>
                    </Box>
                  </Grid>
                  <Grid item container xs={3} justifyContent="center" alignItems="center">
                    {formatAsUsd(row.amount0 * prices[row.token0] + row.amount1 * prices[row.token1])}
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

export default LpDashboard;