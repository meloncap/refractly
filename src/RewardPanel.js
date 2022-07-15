import React from 'react';
import Grid from '@mui/material/Grid';
import DisplayBox from './DisplayBox';

const RewardPanel = ({
    rewardData
}) => {

    const diviser = 10 ** 18;

    if (!rewardData) {
        rewardData = {};
    }

    return (
        <Grid container spacing={1}>
            {Object.entries(rewardData).map((reward) => {
                const data = reward[1];
                const rewards = data.earned / diviser;
                return (
                    <Grid item key={reward[0]}>
                        <DisplayBox
                            title={`${data.symbol} Rewards`}
                            reward={rewards}
                            rewardLabel={data.symbol}
                            rewardAmount={rewards * data.price}
                        ></DisplayBox>
                    </Grid>
                );
            })}
        </Grid>
    )
}

export default RewardPanel;