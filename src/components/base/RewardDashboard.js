import React from 'react';
import Grid from '@mui/material/Grid';
import RewardDisplay from './display-boxes/RewardDisplay';
import Tooltip from '@mui/material/Tooltip';
import { formatAsPercent } from '../../utils/utils';

const RewardDashboard = ({
    rewards,
    prices,
    symbols,
    optimizerVoteTokenName,
    optimizerLockTokenName,
}) => {

    const diviser = 10 ** 18;

    let sortedRewards = [];

    if (rewards && prices) {
        for (var address in rewards) {
            rewards[address].rewardAmount = rewards[address].earned / diviser * prices[address];
            sortedRewards.push([address, rewards[address]]);
        }

        sortedRewards.sort(function(a, b) {
            return b[1].rewardAmount - a[1].rewardAmount;
        });
    }

    return (
        <Grid item container spacing={1} justifyContent="center">
            {sortedRewards.map((reward) => {
                const address = reward[0];
                const data = reward[1];
                const rewards = data.earned / diviser;

                let poolPercent = 0;
                let optimizerVotePercent = 0;
                let optimizerLockPercent = 0;
                
                if (rewards > 0) {
                    poolPercent = (data.poolEarned / diviser) / rewards;
                    optimizerVotePercent = (data.optimizerVoteEarned / diviser) / rewards;
                    optimizerLockPercent = (data.optimizerLockEarned / diviser) / rewards;
                }

                return (
                    <Grid item key={reward[0]}>
                        <Tooltip enterDelay={500} enterNextDelay={500} title={
                            <React.Fragment>
                            <b>Pool Staking: </b>{formatAsPercent(poolPercent)}<br></br>
                            <b>{optimizerVoteTokenName} Staking: </b>{formatAsPercent(optimizerVotePercent)}<br></br>
                            <b>{optimizerLockTokenName} Locking: </b>{formatAsPercent(optimizerLockPercent)}
                            </React.Fragment>
                        }>
                            <RewardDisplay
                                header={`${symbols[address]}`}
                                reward={rewards}
                                rewardLabel={symbols[address]}
                                rewardAmount={data.rewardAmount}
                            ></RewardDisplay>
                        </Tooltip>
                    </Grid>
                );
            })}
        </Grid>
    )
}

export default RewardDashboard;
