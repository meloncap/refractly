import React from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { ThemeProvider } from '@mui/material/styles';
import { Link, Routes, Route } from 'react-router-dom';
import { useStickyState } from '../../utils/useStickyState';
import useMediaQuery from '@mui/material/useMediaQuery';
import LockedPenDashboard from './LockedPenDashboard';
import { tabTheme } from '../../styles/theme';
import LpDashboard from '../base/LpDashboard';
import LpDashboardSmall from '../base/LpDashboardSmall';
import PenroseRewardDashboard from './PenroseRewardDashboard';
import PenrosePortfolioContainer from './PenrosePortfolioContainer';
import AppBody from '../base/AppBody';
import PenroseDonations from './PenroseDonations';

const PenroseAppBody = ({ web3, account,
  balances,
  rewards,
  pools,
  prices,
  symbols,
  walletConnected,
  actionsDisabled,
  onRefreshHandler
}) => {
  const [tabValue, setTabValue] = useStickyState(0, "tab");

  const smallScreen = useMediaQuery('(max-width:700px)');

  const tabsStyle = {
    margin: "16px 0"
  }

  const handleChange = (_, newValue) => {
    setTabValue(newValue);
  }

  return (
    <AppBody
      portfolioContainer={
        <PenrosePortfolioContainer
          web3={web3}
          account={account}
          balances={balances}
          rewards={rewards}
          prices={prices}
          symbols={symbols}
          walletConnected={walletConnected}
          actionsDisabled={actionsDisabled}
          onRefreshHandler={onRefreshHandler}
        />
      }
      tabs={
        <ThemeProvider theme={tabTheme}>
          <Tabs value={tabValue} onChange={handleChange} centered style={tabsStyle}>
              <Tab label='Rewards' to='/rewards' component={Link} />
              <Tab label='Locked PEN' to='/lockedPen' component={Link} />
              <Tab label='LP Positions' to='/pools' component={Link} />
              <Tab label='Donate' to='/donate' component={Link} />
          </Tabs>
        </ThemeProvider>
      }
      routes={
        <Routes>
          <Route index element={<PenroseRewardDashboard rewards={rewards} prices={prices} symbols={symbols} />} />
          <Route path="/rewards" element={<PenroseRewardDashboard rewards={rewards} prices={prices} symbols={symbols} />} />
          <Route path="/lockedPen" element={<LockedPenDashboard account={account} web3={web3} prices={prices} />} />
          {smallScreen ?
          <Route path="/pools" element={<LpDashboardSmall pools={pools} prices={prices} symbols={symbols}  />} />
          :
          <Route path="/pools" element={<LpDashboard pools={pools} prices={prices} symbols={symbols}  />} />
          }
          <Route path="/donate" element={<PenroseDonations />} />
        </Routes>
      }
    />
  )
}

export default PenroseAppBody;
