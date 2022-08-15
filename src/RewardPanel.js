import React from 'react';
import Grid from '@mui/material/Grid';
import DisplayBox from './DisplayBox';
import Tooltip from '@mui/material/Tooltip';
import { formatAsPercent } from './utils';

const RewardPanel = ({
    rewardData,
    prices,
    symbols
}) => {

    const diviser = 10 ** 18;

    let sortedRewards = [];

    if (rewardData && prices) {
        for (var address in rewardData) {
            rewardData[address].rewardAmount = rewardData[address].earned / diviser * prices[address];
            sortedRewards.push([address, rewardData[address]]);
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
                let penDystPercent = 0;
                let vIPenPercent = 0;
                
                if (rewards > 0) {
                    poolPercent = (data.poolEarned / diviser) / rewards;
                    penDystPercent = (data.penDystEarned / diviser) / rewards;
                    vIPenPercent = (data.vIPenEarned / diviser) / rewards;
                }

                return (
                    <Grid item key={reward[0]}>
                        <Tooltip enterDelay={500} enterNextDelay={500} title={
                            <React.Fragment>
                            <b>Pool Staking: </b>{formatAsPercent(poolPercent)}<br></br>
                            <b>penDYST Staking: </b>{formatAsPercent(penDystPercent)}<br></br>
                            <b>vIPEN Locking: </b>{formatAsPercent(vIPenPercent)}
                            </React.Fragment>
                        }>
                            <DisplayBox
                                header={`${symbols[address]}`}
                                reward={rewards}
                                rewardLabel={symbols[address]}
                                rewardAmount={data.rewardAmount}
                            ></DisplayBox>
                        </Tooltip>
                    </Grid>
                );
            })}
        </Grid>
    )
}

export default RewardPanel;