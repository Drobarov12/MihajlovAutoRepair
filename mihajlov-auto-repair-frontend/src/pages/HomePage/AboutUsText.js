import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';

const AboutUsText = () => {
    const { t } = useTranslation();

    return (
        <Box
            sx={{
                padding: { xs: 2, sm: 4, md: 6 }, // Adjust padding based on screen size
                backgroundColor: '#fff',
            }}
        >
            {/* Title Section */}
            <Typography
                variant="h2"
                sx={{
                    fontWeight: 'bold',
                    mt: 2,
                    mb: 8,
                    textAlign: 'left',
                    textTransform: 'uppercase',
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }, // Responsive font size
                }}
            >
                {t('aboutUs.title')}
            </Typography>

            {/* Content Section */}
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="body1" sx={{ mb: 3, textAlign: 'left' }}>
                        {t('aboutUs.firstParagraph')}
                    </Typography>

                    <Typography variant="body1" sx={{ mb: 3, textAlign: 'left' }}>
                        {t('aboutUs.secondParagraph')}
                    </Typography>

                    <Typography variant="body1" sx={{ fontWeight: 'bold', textAlign: 'left' }}>
                        {t('aboutUs.thirdParagraph')}
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AboutUsText;
