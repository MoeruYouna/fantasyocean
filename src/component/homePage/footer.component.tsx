import * as React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer: React.FC = () => {
    return (
        <Box
            sx={{
                width: '100%',
                backgroundColor: 'rgb(55, 162, 245)',
                color: 'white',
                py: 2, 
                textAlign: 'center',
                mt: 'auto', // Ensures the footer is pushed to the bottom of the content
            }}
            component="footer"
        >
            <Typography variant="body1">
                &copy; {new Date().getFullYear()} FantasyOcean. All rights reserved.
            </Typography>
            <Box sx={{ mt: 1 }}>
                <Link href="" color="inherit" sx={{ mx: 1 }}>
                    Privacy Policy
                </Link>
                <Link href="" color="inherit" sx={{ mx: 1 }}>
                    Terms of Service
                </Link>
                <Link href="" color="inherit" sx={{ mx: 1 }}>
                    Contact Us
                </Link>
            </Box>
        </Box>
    );
};

export default Footer;
