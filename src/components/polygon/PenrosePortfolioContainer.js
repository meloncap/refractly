import React from 'react';
import PenrosePortfolio from './PenrosePortfolio';
import PenroseProfitButton from './PenroseProfitButton';
import PenrosePortfolioHeader from './PenrosePortfolioHeader';
import PenroseClaimAllButton from './PenroseClaimAllButton';
import PenroseClaimLpButton from './PenroseClaimLpButton';
import PortfolioContainer from '../base/portfolio/PortfolioContainer';
import PenroseActionButton from './PenroseActionButton';

const PenrosePortfolioContainer = ({ account, web3, balances, rewards, prices, symbols, walletConnected, actionsDisabled, onRefreshHandler }) => {
    return (
        <PortfolioContainer
            account={account}
            web3={web3}
            walletConnected={walletConnected}
            actionsDisabled={actionsDisabled}
            onRefreshHandler={onRefreshHandler}
            portfolioHeader={<PenrosePortfolioHeader prices={prices} symbols={symbols} />}
            portfolio={<PenrosePortfolio balances={balances} rewardData={rewards} prices={prices} />}
            actionButton={<PenroseActionButton web3={web3} account={account} />}
            claimAllButton={<PenroseClaimAllButton web3={web3} account={account} />}
            claimLpButton={<PenroseClaimLpButton web3={web3} account={account} />}
            profitButton={<PenroseProfitButton web3={web3} account={account} symbols={symbols} />}
        />
    )
}

export default PenrosePortfolioContainer;
