import React from 'react';
import Grid from '@mui/material/Grid';

const AppBody = ({ portfolioContainer, tabs, routes }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} lg={4}>
        {portfolioContainer}
      </Grid>
      <Grid item container xs={12} lg={8} spacing={2} sx={{marginTop: "16px"}}>
        <Grid item container xs={12} justifyContent="center">
          {tabs}
        </Grid>
        <Grid item container xs={12}>
          {routes}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default AppBody;
