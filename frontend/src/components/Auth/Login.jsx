import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LoginUser from '../../models/LoginUser';
import AuthService from '../../services/AuthService';
import styles from './styles1.css?inline';
import AlertModal from '../AlertModals/AlertModal';
import { Link, Navigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';

function Login() {
    const [user, setUser] = useState(new LoginUser());
    const [isErrorOccur, setIsErrorOccur] = useState(false);
    const [errorContent, setErrorContent] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        const authService = new AuthService();
        authService.login(user)
            .then(response => {
                localStorage.setItem("token", response.data.token);
                setIsLoggedIn(true);
            })
            .catch(error => {
                setIsErrorOccur(true);
                setErrorContent(error.response.data.message);
            });
    };

    const handleCancel = () => {
        setUser(new LoginUser());
        setIsErrorOccur(false);
    };

    if (isLoggedIn) {
        return <Navigate to="/mainChart" />;
    }

    return (
        <Box className="centeredContainer">
            <Box
                className="formBox"
                component="form"
                sx={{ '& .MuiTextField-root': { m: 1 } }}
                noValidate
                autoComplete="off"
            >
                <style>
                    {styles}
                </style>
                <div className="nameFields">
                    <TextField 
                        id="email" 
                        name="email" 
                        className="textField"
                        label="E-mail address" 
                        variant="outlined" 
                        value={user.email} 
                        onChange={handleChange} 
                    />
                </div>
                <div className="nameFields">
                    <TextField 
                        id="password" 
                        name="password" 
                        className="textField"
                        label="Password" 
                        type="password" 
                        variant="outlined" 
                        value={user.password} 
                        onChange={handleChange} 
                    />
                </div>
                <div className="buttons">
                    <Button variant="outlined" onClick={handleCancel} color="error">
                        Cancel
                    </Button>
                    <Button variant="outlined" onClick={handleSubmit}>
                        Log in
                    </Button>
                </div>
                <Button
                    style={{ marginRight: "10px" }}
                    component={Link}
                    to="/"
                    variant="outlined"
                >
                    Return to Main Page
                </Button>
                <Typography variant="body1" align="center" className="createLink">
                    You don't have an account yet?
                    <Link to="/registry" className="createLink">
                        Click here
                    </Link>
                    to create it!
                </Typography>
            </Box>
            {isErrorOccur && (
                <AlertModal 
                    open={isErrorOccur}
                    handleClose={() => setIsErrorOccur(false)}
                    title="Login Error" 
                    content={errorContent}
                />
            )}
        </Box>
    );
}

export default Login;
