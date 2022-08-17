import React from 'react';
import { PolygonTokens } from '../../utils/chains';
import RewardDashboard from '../base/RewardDashboard';

const PenroseRewardDashboard = ({
    rewards,
    prices,
    symbols,
}) => {

    return (
        <RewardDashboard
            rewards={rewards}
            prices={prices}
            symbols={symbols}
            optimizerVoteTokenName={PolygonTokens.OptimizerVoteToken}
            optimizerLockTokenName={PolygonTokens.OptimizerLockToken}
        />
    )
}

export default PenroseRewardDashboard;