import React, { useState, useEffect } from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import cryptoService from '../../services/CryptoService';
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";

import BitcoinIcon from "cryptocurrency-icons/svg/color/btc.svg";
import EthereumIcon from "cryptocurrency-icons/svg/color/eth.svg";
import LitecoinIcon from "cryptocurrency-icons/svg/color/ltc.svg";

const icons = {
  Bitcoin: BitcoinIcon,
  Ethereum: EthereumIcon,
  Litecoin: LitecoinIcon
};

export default function SideMenu({ isOpen, setIsOpen }) {
  const [cryptoTab, setCryptoTab] = useState([]);
  const [currentQuotes, setCurrentQuotes] = useState([]);

  useEffect(() => {
    cryptoService.getCryptoNames()
      .then((cryptoNames) => {
        if (cryptoNames && cryptoNames.AvailableCryptoCurrencies) {
          setCryptoTab(cryptoNames.AvailableCryptoCurrencies);
        }
      })
      .catch(error => {
        console.error("Error fetching crypto names:", error);
      });
  }, []);

  const handleListItemClick = async (crypto) => {
    setIsOpen(false);
    await cryptoService.getCryptoExtremes(crypto);
    await cryptoService.getCryptoPosts(crypto);
    await cryptoService.getCryptoHistoricalQuotes(crypto);
  };

  useEffect(() => {
    const subscription = (newQuotes) => {
      setCurrentQuotes(newQuotes);
    };

    const unsubscribe = cryptoService.subscribe(subscription);

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Drawer
      anchor="left"
      open={isOpen}
      onClose={() => setIsOpen(false)}
      sx={{
        '& .MuiDrawer-paper': {
          width: 250,
          boxSizing: 'border-box',
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
        <IconButton onClick={() => setIsOpen(false)}>
          <ArrowBackIosIcon />
        </IconButton>
      </Box>
      <List
        sx={{ width: "100%", bgcolor: "background.paper" }}
        component="nav"
        aria-labelledby="nested-list-subheader"
      >
        {cryptoTab.map((crypto, index) => (
          <ListItemButton
            key={index}
            onClick={() => handleListItemClick(crypto)}
          >
            <ListItemIcon>
              <img src={icons[crypto]} alt={`${crypto} icon`} style={{ width: 24, height: 24 }} />
            </ListItemIcon>
            <ListItemText primary={crypto} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}
