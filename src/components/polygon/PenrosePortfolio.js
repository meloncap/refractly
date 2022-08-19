import React from 'react';
import { PolygonAddresses, PolygonTokens } from '../../utils/chains';
import Portfolio from '../base/portfolio/Portfolio';
 
const PenrosePortfolio = ( { balances, rewardData, prices }) => {
    return (
        <Portfolio
            balances={balances}
            rewardData={rewardData}
            prices={prices}
            optimizerVoteTokenName={PolygonTokens.OptimizerVoteToken}
            optimizerTokenName={PolygonTokens.OptimizerToken}
            dexTokenAddr={PolygonAddresses.Dyst}
            optimizerTokenAddr={PolygonAddresses.Pen}
            optimizerLockTokenAddr={PolygonAddresses.VlPen}
            balanceTitle={
                <React.Fragment>
                    Total portfolio balance not including unclaimed rewards<br></br>
                    This includes:<br></br>
                    - DYST, PEN, and penDYST in wallet<br></br>
                    - Staked penDYST and locked PEN<br></br>
                    - Staked LP balance
                </React.Fragment>
                
            }
        />
    )
}
 
export default PenrosePortfolio