import { Box, Container, Grid } from '@mui/material';
import React from 'react';

export default function Footer() {
    return (
    <footer className="position-related bottom-0">
        <Box bgcolor={"text.secondary"} color="white">
            <Container maxWidth="lg">
                <Grid container spacing={5}>
                    <Box borderBottom={1}>Help</Box>
                </Grid>
            </Container>
        </Box>
    </footer>
    )
}