import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SideMenu from "./SideMenu";
import { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import { Link, useLocation } from 'react-router-dom';
import TokenService from '../../services/TokenService';
import { useNavigate } from 'react-router-dom';

export default function NavBar({ currentQuotes }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isTokenExpired, setIsTokenExpired] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenStatus = async () => {
      setIsLoggedIn(TokenService.isLoggedIn());
      setIsTokenExpired(TokenService.getTokenExpired());

      if (TokenService.isLoggedIn()) {
        const role = await TokenService.getUserRole();
        setUserRole(role);
      } else {
        setUserRole(null);
      }
    };

    checkTokenStatus();
    const interval = setInterval(checkTokenStatus, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    TokenService.removeToken();
    setIsLoggedIn(false);
    setUserRole(null);
    navigate('/login');
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ backgroundColor: '#5d9c78' }}>
          <Toolbar>
            {location.pathname === '/mainChart' && (
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={() => setIsOpen(!isOpen)}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Button
              component={Link}
              to="/"
              variant="text"
              sx={{
                fontSize: '1.25rem',
                color: 'inherit',
                textTransform: 'none',
                marginRight: 'auto',
                '&:hover': {
                  backgroundColor: 'transparent',
                },
              }}
            >
              Crypto historical quotes
            </Button>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Button component={Link} to="/aboutUs" variant="outlined" color="inherit">
                About us
              </Button>
              {!isLoggedIn ? (
                <>
                  <Button component={Link} to="/login" variant="outlined" color="inherit">
                    Log in
                  </Button>
                  <Button component={Link} to="/registry" variant="outlined" color="inherit">
                    Sign up
                  </Button>
                </>
              ) : (
                <>
                  <Button component={Link} to="/mainChart" variant="outlined" color="inherit">
                    Main page
                  </Button>
                  <Button component={Link} to="/summary" variant="outlined" color="inherit">
                    Summary
                  </Button>
                  {userRole === 'ADMIN' && (
                    <Button component={Link} to="/addPost" variant="outlined" color="inherit">
                      Add posts
                    </Button>
                  )}
                  <Button variant="outlined" color="inherit" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </AppBar>
        {isLoggedIn && !isTokenExpired && location.pathname === '/mainChart' && (
          <SideMenu isOpen={isOpen} setIsOpen={setIsOpen} />
        )}
      </Box>
    </>
  );
}
