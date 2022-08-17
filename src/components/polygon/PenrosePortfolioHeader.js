import React from 'react';
import PortfolioHeader from '../base/portfolio/PortfolioHeader';
import { PolygonAddresses, PolygonTokens } from '../../utils/chains';

const PenrosePortfolioHeader = ({ prices, symbols }) => {
    return (
        <PortfolioHeader
            prices={prices}
            symbols={symbols}
            dexTokenName={PolygonTokens.DexToken}
            optimizerTokenName={PolygonTokens.OptimizerToken}
            optimizerVoteTokenName={PolygonTokens.OptimizerVoteToken}
            dexTokenAddr={PolygonAddresses.Dyst}
            optimizerTokenAddr={PolygonAddresses.Pen}
            optimizerVoteTokenAddr={PolygonAddresses.PenDyst}
        />
    )
}

export default PenrosePortfolioHeader;
