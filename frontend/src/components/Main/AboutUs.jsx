import React, { useState } from "react";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import styles from '../Auth/styles1.css?inline';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import BitcoinIcon from "cryptocurrency-icons/svg/color/btc.svg";
import EthereumIcon from "cryptocurrency-icons/svg/color/eth.svg";
import LitecoinIcon from "cryptocurrency-icons/svg/color/ltc.svg";

const icons = {
    Bitcoin: BitcoinIcon,
    Ethereum: EthereumIcon,
    Litecoin: LitecoinIcon
  };
function AboutUs() {

    const cryptoData = [
        {
            img: icons.Bitcoin,
            title: "Bitcoin"
        },
        {
            img: icons.Ethereum,
            title: "Ethereum"
        },
        {
            img: icons.Litecoin,
            title: "Litecoin"
        }
    ];
    return (
        <Box>
            <style>
                {styles}
            </style>
            <Typography variant="h1" align="center" className="customTypography">
                Welcome to our platform!
            </Typography>
            <Typography variant="body1" align="center" className="customTypography2">
            Our website is aimed at cryptocurrency enthusiasts. Here you will find the most important information about the most popular cryptocurrencies.
            You will have access to candlestick charts showing their historical prices in recent years and, most importantly, you will be able to check 
            which events had a significant impact on the rise or fall of the prices of these cryptocurrencies. Thanks to this platform, you will 
            be able to quickly and easily learn the details about these events by checking selected calendar cards.
            </Typography>
            <Typography variant="body1" align="center" className="customTypography2">
            Currently, we provide data on the following cryptocurrencies:
            </Typography>
            <Grid container spacing={2} justifyContent="center">
                {cryptoData.map((crypto, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card className="MuiCard-root">
                            <div className="MuiCardMedia-wrapper">
                                <CardMedia
                                    component="img"
                                    image={crypto.img}
                                    alt={`${crypto.title} logo`}
                                    className="MuiCardMedia-root"
                                />
                            </div>
                            <CardContent>
                                <Typography gutterBottom variant="h6" component="div">
                                    {crypto.title}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
          
        </Box>
    );
}

export default AboutUs;