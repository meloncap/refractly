import { createTheme } from '@mui/material/styles';

export const tabTheme = createTheme({
    components: {
      MuiTabs: {
        styleOverrides: {
            flexContainer: {
                border: "4px solid #232d4fd1",
                borderRadius: "1rem",
                margin: "6px",
                padding: "12px",
                maxWidth: "700px",
            },
            indicator: {
                display: "none"
            }
        }
      },
      MuiTab: {
        styleOverrides: {
            root: {
                '@media (min-width:1023px)': {
                    margin: "6px",
                    // width: "300px",
                    width: "200px",
                    height: "60px",
                    fontSize: "18px",
                    fontWeight: "600px"
                },
                '@media (max-width:1023px)': {
                    width: "180px",
                    height: "30px",
                    fontSize: "14px"
                },
                '@media (max-width:600px)': {
                    width: "120px",
                    height: "30px",
                    fontSize: "14px"
                },
                '@media (max-width:400px)': {
                    width: "100px",
                    height: "25px",
                    fontSize: "12px"
                },
                margin: "6px",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "0.8rem",
                backgroundColor: "rgba(4, 7, 31, 0.8)",
                color: "#fff",
                "&:hover": {
                    background: "#0D324D"
                },
                "&.Mui-selected": {
                    background: "radial-gradient(40.91% 104.55% at 100% -31.82%,hsla(0,0%,100%,.37) 0,hsla(0,0%,100%,0) 100%),#287eff",
                    color: "#fff",
                }
            }
        }
      }
    }
});
