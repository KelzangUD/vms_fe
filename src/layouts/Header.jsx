import { Avatar, Box, Button, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';



const Header = () => {
    const location = useLocation();
    return (
        <Box position="static" sx={{ backgroundColor: '#fff', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid #ccc' }}>
            <Avatar sx={{ bgcolor: "#1e88e5", mr: 2 }} variant="square">
                V
            </Avatar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: "text.primary" }}>
                Vehicle Management System
            </Typography>
            {
                location.pathname === '/' ? (
                    <Button variant="contained" color="primary" sx={{ borderRadius: 2, px: 3, py: 1 }}>
                        <Link to="/login" style={{ textDecoration: 'none', color: 'inherit', }}>
                            Login
                        </Link>
                    </Button>) : (<Button variant="contained" color="primary" sx={{ borderRadius: 2, px: 3, py: 1  }}>
                        <Link to="/" style={{ textDecoration: 'none', color: 'inherit', }}>
                            Log Out
                        </Link>
                    </Button>
                )
            }
        </Box>
    )
}

export default Header;