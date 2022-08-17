import React from 'react';
import { formatAsUsd } from '../../utils/utils';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/Box';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ThemeProvider } from '@mui/material/styles';
import { accordionTheme } from '../../styles/accordion-theme';
import './table.css';

const LpDashboardSmall = ({ pools, prices, symbols }) => {
  const tableStyle = {
    backgroundImage:"radial-gradient(circle farthest-corner at 0 0,rgba(184,144,242,.61),rgba(38,125,255,.74) 52%,hsla(0,0%,100%,.2))",
    backgroundColor:"rgba(4,7,31,.8)",
    borderRadius:"1rem",
    overflow:"hidden"
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

  const getRewardTotal = (row) => {
    let total = 0;
    Object.entries(row.rewards).map((reward) => (
      total += reward[1] * prices[reward[0]]
    ));
    return <Box>{formatAsUsd(total)}</Box>;
  }

  return (
   <Container maxWidth="sm">
      <Box sx={tableStyle}>
        <Box sx={innerTableStyle}>
          <Box sx={headerStyle}>
            <Grid item container spacing={2} direction="row" justifyContent="center" alignItems="center">
              <Grid item xs={8}>
                Pool
              </Grid>
              <Grid item xs={4}>
                Type
              </Grid>
            </Grid>
          </Box>
          <Box className="table-body" sx={tableBodyStyle}>
            {pools.map((row, i) => (
              <ThemeProvider theme={accordionTheme} key={i}>
                <Accordion key={i} disableGutters>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{color: "#fff"}} />}
                    aria-controls="lp-row-content"
                    id="lp-row-content"
                  >
                    <Box key={i} sx={{width: "100%"}}>
                      <Grid container spacing={2} direction="row" justifyContent="center" alignItems="center" style={rowStyle}>
                        <Grid item xs={9}>
                          {symbols[row.token0]} ... {symbols[row.token1]}
                        </Grid>
                        <Grid item xs={3}>
                          {row.stable ? "S" : "V"}
                        </Grid>
                      </Grid>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2} justifyContent="center" alignItems="center">
                      <Grid item xs={6} sx={{fontWeight: "600"}}>
                        Tokens:
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{display: "block"}}>
                          <Box>{row.amount0.toFixed(3)} {symbols[row.token0]}</Box>
                          <Box>{row.amount1.toFixed(3)} {symbols[row.token1]}</Box>
                        </Box>
                      </Grid>
                      <Grid item xs={6} sx={{fontWeight: "600"}}>
                        Balance:
                      </Grid>
                      <Grid item xs={6}>
                        {formatAsUsd(row.amount0 * prices[row.token0] + row.amount1 * prices[row.token1])}
                      </Grid>
                      <Grid item xs={6} sx={{fontWeight: "600"}}>
                        Reward Tokens:
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{display: "block"}}>
                          {Object.entries(row.rewards).map((reward) => (
                            <Box key={reward[0]}>{reward[1].toFixed(3)} {symbols[reward[0]]}</Box>
                          ))}
                        </Box>
                      </Grid>
                      <Grid item xs={6} sx={{fontWeight: "600"}}>
                        Rewards:
                      </Grid>
                      <Grid item xs={6}>
                        {getRewardTotal(row)}
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </ThemeProvider>
            ))}
          </Box>
        </Box>
      </Box>
    </Container>
  )
}

export default LpDashboardSmall;