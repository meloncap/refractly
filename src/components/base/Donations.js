import React, { useEffect, useRef } from 'react';
import DePayWidgets from '@depay/widgets';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import './donations.css';

const donationAddr = "0x6Fc5567Cd168b5531Abd76Ef61F0ef6cFe020fDE";

const Donations = ({ blockchain, addresses }) => {
  const container = useRef()

  let unmount;

  useEffect(() => {
    if (container.current && blockchain && addresses) {

      const whitelistTokens = {
        [blockchain]: addresses
      }

      const acceptTokens = addresses.map((address) => {return {blockchain: blockchain, token: address, receiver: donationAddr}});

      (
        { unmount } = DePayWidgets.Donation({
          container: container.current,
          closable: false,
          amount: {
            token: true,
            step: 0.00001
          },
          whitelist: whitelistTokens,
          accept:acceptTokens,
          style: {
            colors: {
              primary: '#287eff',
              text: '#fff',
              buttonText: '#fff',
              icons: '#fff'
            },
            css: `
              .ReactDialogBackground {
                  background: transparent;
                  backdrop-filter: none;
              }
              @media (orientation: portrait) and (max-width: 800px) {
                .ReactDialogStack {
                    align-items: center;
                }
              }
              .Dialog {
                background-color: rgba(4,7,31,.8);
                border: 1px solid hsla(0,0%,100%,.3);
                border-radius: 1rem;
              }
              .Card {
                background-color: #287eff;
              }
              .Card:hover {
                background: #0D324D !important;
              }
              .CardTitle {
                color: #fff;
              }
              .CardText.small small {
                color: #fff;
              }
              .ReactDialogAnimation {
                transition: none;
              }
              .ReactDialogStack {
                transition: none;
              }
              .DialogHeaderActionRight {
                display: none;
              }
              .PoweredByWrapper {
                top: 100px;
              }
              .PoweredByLink {
                margin-left: 0;
              }
              .MaxHeight {
                max-height: 207px;
              }
              @media (max-width: 400px) {
                .PoweredByWrapper {
                  top: 38px;
                }
              }
              /* Chrome, Safari, Edge, Opera */
              input::-webkit-outer-spin-button,
              input::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
              }

              /* Firefox */
              input[type=number] {
                -moz-appearance: textfield;
              }
              .MaxHeight::-webkit-scrollbar {
                width: 6px;
                height: 6px;
                background-color: rgba(3, 3, 3, 0.288);
              
              }
              .MaxHeight::-webkit-scrollbar-thumb {
                border-radius: 25px;
                background-color: hsla(0, 0%, 100%, .15);
              }
              .MaxHeight::-webkit-scrollbar-track {
                background-color: rgba(3, 3, 3, 0.288);
                border-radius: 25px;
              }
            `
          }
        })
      )
    }
    return ()=>{
      // make sure an open widgets gets closed/unmounted as part of this component
      if(unmount) { unmount() }
    }
  }, []);

  const boxStyle={
    backgroundImage:"radial-gradient(circle farthest-corner at 0 0,rgba(184,144,242,.61),rgba(38,125,255,.74) 52%,hsla(0,0%,100%,.2))",
    backgroundColor:"rgba(4,7,31,.8)",
    borderRadius:"1rem",
    overflow:"hidden"
  }

  const innerBoxStyle={
    border:"1px solid hsla(0,0%,100%,.3)",
    borderRadius:"1rem",
    backgroundColor:"rgba(4,7,31,.8)",
    padding:"8px",
    width:"100%",
    boxSizing:"border-box"
  }

  return (
    <Container maxWidth="md">
      <Box className="donation-container" style={boxStyle}>
        <Box style={innerBoxStyle}>
          <div ref={container} className="ref-container" style={{ position: 'relative', width: "100%"}}>
            <h2 className="header">If you find Refractly useful, consider donating!</h2>
          </div>
        </Box>
      </Box>
    </Container>
  )
}

export default Donations;
