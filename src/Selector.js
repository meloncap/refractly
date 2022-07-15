import React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import DisplayBoxTotal from './DisplayBoxTotal';
 
const Selector = ( { rewardData, actions, onItemSelected }) => {
    const boxStyle={
        display:"flex",
        flexDirection:"column",
        justifyContent:"center",
        alignItems:"center",
        backgroundImage:"radial-gradient(circle farthest-corner at 0 0,rgba(184,144,242,.61),rgba(38,125,255,.74) 52%,hsla(0,0%,100%,.2))",
        backgroundColor:"rgba(4,7,31,.8)",
        borderRadius:"1rem",
        overflow:"hidden",
        maxHeight:"3000px",
        maxWidth:"400px",
        minWidth:"400px",
    }

    const innerBoxStyle={
        display:"flex",
        alignItems:"center",
        flexDirection:"column",
        border:"1px solid hsla(0,0%,100%,.3)",
        borderRadius:"1rem",
        backgroundColor:"rgba(4,7,31,.8)",
        padding:"25px",
        width:"100%",
        boxSizing:"border-box"
    }

    const diviser = 10 ** 18;

    const [checked, setChecked] = React.useState(['1','2','3','4','5','6']);

    let earned = 0;
    if (rewardData) {
        Object.entries(rewardData).forEach(reward => {
            const data = reward[1];
            const rewards = data.earned / diviser;
            earned += rewards * data.price;
        });
    }    

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
        onItemSelected(newChecked);
    };

    return (
        <Box style={boxStyle}>
            <Box style={innerBoxStyle}>
                <DisplayBoxTotal
                    title="Total Earned"
                    rewardAmount={earned}
                ></DisplayBoxTotal>
                <List>
                {Object.entries(actions).map((action) => {
                    const key = action[0];
                    const value = action[1];
                    const labelId = `checkbox-list-label-${value}`;

                    return (
                        <React.Fragment key={value}>
                            <ListItem
                                key={value}
                                disablePadding
                            >
                                <ListItemButton role={undefined} onClick={handleToggle(key)} dense>
                                <ListItemIcon>
                                    <Checkbox
                                    edge="start"
                                    checked={checked.indexOf(key) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ 'aria-labelledby': labelId }}
                                    />
                                </ListItemIcon>
                                <ListItemText id={labelId} primary={value} primaryTypographyProps={{ fontSize: 18, color: "#fff", fontWeight: 'medium' }}/>
                                </ListItemButton>
                            </ListItem>
                            {key !== Object.keys(actions).length ? <Divider variant="heavy"/> : null}
                        </React.Fragment>
                    );
                })}
                </List>
            </Box>
        </Box>
    )
}
 
export default Selector