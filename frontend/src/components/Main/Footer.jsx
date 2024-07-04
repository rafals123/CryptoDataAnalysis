import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function Footer() {
  return (
    <Box
    component="footer"
    sx={{
      py: 1,
      px: 1,
      mt: '5%',
      backgroundColor: '#5d9c78',
      textAlign: 'center',
      color:'white',
    }}
   
    >
      <Typography variant="body1"> 
        © Crypto historical quotes 2024
      </Typography>
      <Typography variant="body1">
         Systems integration - final project
      </Typography>
      <Typography variant="body1">
         Authors: Rafał Seredowski, Adrian Sak vel Antoszak
      </Typography>
     
    </Box>
  );
}

export default Footer;
