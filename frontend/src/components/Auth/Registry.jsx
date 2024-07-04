import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import styles from './styles1.css?inline';
import User from '../../models/User';
import AuthService from '../../services/AuthService';
import { Link } from 'react-router-dom';
import AlertModal from '../AlertModals/AlertModal';

function Registry() {
    const [user2, setUser] = useState(new User());
    const [errors, setErrors] = useState({});
    const [isUserRegister, setIsUserRegister] = useState(false);
    const [registerContent, setRegisterContent] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const validate = () => {
        let tempErrors = {};
        const nameRegex = /^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźżA-ZĄĆĘŁŃÓŚŹŻ]{2,}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[A-ZĄĆĘŁŃÓŚŹŻ])(?=.*[!@#$%^&*ąćęłńóśźż,./<>?;:'"[\]{}\\|`~\-=_+()]).{8,}$/;

        tempErrors.first_name = !nameRegex.test(user2.first_name) ? "First name is not valid." : "";
        tempErrors.last_name = !nameRegex.test(user2.last_name) ? "Last name is not valid." : "";
        tempErrors.email = !emailRegex.test(user2.email) ? "Email is not valid." : "";
        tempErrors.password = !passwordRegex.test(user2.password) ? "Password must be at least 8 characters long, contain at least one special character and one uppercase letter." : "";

        setErrors(tempErrors);
        return Object.values(tempErrors).every(x => x === "");
    };

    const handleSubmit = () => {
        if (validate()) {
            const authService = new AuthService();
            authService.registry(user2)
                .then(e => {
                    setIsUserRegister(true);
                    setRegisterContent(e.data);
                })
                .catch(e => {
                    console.log(e);
                });
        } else {
            console.log("Validation failed");
        }
    };

    const handleCancel = () => {
        setUser(new User());
        setErrors({});
    };

    const handleClose = () => {
        setIsUserRegister(false);
        setUser(new User());
    };

    return (
        <Box className="centeredContainer">
            <Box 
                className="formBox" 
                component="form" 
                sx={{ '& .MuiTextField-root': { m: 1 } }} 
                noValidate 
                autoComplete="off"
            >
                <style>{styles}</style>
                <div className="nameFields">
                    <TextField
                        id="first_name"
                        name="first_name"
                        className="textField"
                        label="First Name"
                        variant="outlined"
                        value={user2.first_name}
                        onChange={handleChange}
                        error={Boolean(errors.first_name)}
                        helperText={errors.first_name}
                    />
                    <TextField
                        id="last_name"
                        name="last_name"
                        className="textField"
                        label="Last Name"
                        variant="outlined"
                        value={user2.last_name}
                        onChange={handleChange}
                        error={Boolean(errors.last_name)}
                        helperText={errors.last_name}
                    />
                </div>
                <div className="nameFields">
                    <TextField
                        id="email"
                        name="email"
                        className="textField"
                        label="E-mail address"
                        variant="outlined"
                        value={user2.email}
                        onChange={handleChange}
                        error={Boolean(errors.email)}
                        helperText={errors.email}
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
                        value={user2.password}
                        onChange={handleChange}
                        error={Boolean(errors.password)}
                        helperText={errors.password}
                    />
                </div>
                <div className="buttons">
                    <Button variant="outlined" onClick={handleCancel} color="error">
                        Cancel
                    </Button>
                    <Button variant="outlined" onClick={handleSubmit}>
                        Submit
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
            </Box>
            {isUserRegister && (
                <AlertModal
                    open={isUserRegister}
                    handleClose={handleClose}
                    title="User succesfully registered!"
                    content={registerContent}
                />
            )}
        </Box>
    );
}

export default Registry;