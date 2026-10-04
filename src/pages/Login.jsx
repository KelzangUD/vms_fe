import { Avatar, Box, Button, Card, FormControl, InputAdornment, TextField, Typography } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import KeyIcon from '@mui/icons-material/Key';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const handleLogin = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, credentials);
            if (response.status === 200) {
                console.log('Login successful:');
                const { token } = response.data;
                localStorage.setItem('token', token);
                navigate('/admin');
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Login failed. Please try again.');
            console.log('Login failed:', error?.response);
        }
    }
    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
                <Card sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', width: 400, height: 400, backgroundColor: 'background.paper', boxShadow: 3, borderRadius: 2 }}>
                    <Typography variant='h4' component="div" sx={{ fontWeight: "bold" }}>Welcome back</Typography>
                    <Typography variant='subtitle1' sx={{ color: "#616161" }}>Sign in to manage your workspace.</Typography>
                    <Avatar
                        sx={{ bgcolor: "primary.main", width: 56, height: 56, mt: 2, mb: 2 }}
                    >
                        <LockIcon />
                    </Avatar>
                    <FormControl fullWidth size="small">
                        <TextField id="username" placeholder="User Name" variant="outlined" fullWidth margin="normal" onChange={(e) => {
                            setCredentials(prev => ({ ...prev, username: e.target.value }));
                        }} slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountCircleIcon color="action" />
                                    </InputAdornment>
                                ),
                                sx: { borderRadius: 3, backgroundColor: '#FAFAFA' },
                            },
                        }} />
                    </FormControl>
                    <TextField id="password" placeholder="Password" variant="outlined" fullWidth margin="normal" type="password" onChange={(e) => {
                        setCredentials(prev => ({ ...prev, password: e.target.value }));
                    }} slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <KeyIcon color="action" />
                                </InputAdornment>
                            ),
                            sx: { borderRadius: 3, backgroundColor: '#FAFAFA' },
                        },
                    }} />
                    <Button variant="contained" color="primary" sx={{ mt: 2, py: 2, borderRadius: 3 }} fullWidth onClick={handleLogin}>
                        Login
                    </Button>
                </Card>
            </Box>
        </>
    )
}

export default Login;