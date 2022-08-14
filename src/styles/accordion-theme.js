import { createTheme } from '@mui/material/styles';

export const accordionTheme = createTheme({
  components: {
    MuiAccordion: {
      styleOverrides: {
          root: {
              // backgroundImage: "radial-gradient(circle farthest-corner at 0 0,rgba(184,144,242,.61),rgba(38,125,255,.74) 52%,hsla(0,0%,100%,.2))",
              // backgroundColor: "rgba(4,7,31,.8)",
              backgroundColor: "transparent",
              // color: "transparent",
              // textDecoration: "none",
              // height: "24px",
              padding: "0px 8px",
              "&:nth-of-type(even)": {
                backgroundColor: "hsla(0,0%,100%,.05)",
                borderRadius: "10px"
              },
              "&:before": {
                display: "none"
              }
          }
      }
    },
    MuiAccordionSummary: {
      styleOverrides: {
          root: {
              // backgroundImage: "radial-gradient(circle farthest-corner at 0 0,rgba(184,144,242,.61),rgba(38,125,255,.74) 52%,hsla(0,0%,100%,.2))",
              // backgroundColor: "rgba(4,7,31,.8)",
              height: "53.5px",
              padding: "16px 0px",
              // "&:nth-of-type(odd)": {
              //   backgroundColor: "hsla(0,0%,100%,.05)",
              //   borderRadius: "10px"
              // }
          },
          ".MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
              marginTop: "0"

          }
      }
    },
    MuiCollapse: {
      styleOverrides: {
        root: {
          color: "#fff",
          paddingBottom: "8px"
        }
      }
    }
  }
});
