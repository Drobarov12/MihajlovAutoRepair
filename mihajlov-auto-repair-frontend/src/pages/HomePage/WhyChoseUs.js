import React, { useState } from 'react';
import { Grid, Typography, Accordion, AccordionSummary, AccordionDetails, Box } from '@mui/material';
import bmwWhyChoseUs from '../../assets/bmwWhyChoseUs.png';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from 'react-i18next';


const WhyChooseUs = () => {
    const { t } = useTranslation();

    const items = [
      {
        title: t('whyChooseUs.bmwExpertise.title'),
        description: t('whyChooseUs.bmwExpertise.description'),
      },
      {
        title: t('whyChooseUs.stateOfTheArtEquipment.title'),
        description: t('whyChooseUs.stateOfTheArtEquipment.description'),
      },
      {
        title: t('whyChooseUs.personalizedService.title'),
        description: t('whyChooseUs.personalizedService.description'),
      },
      {
        title: t('whyChooseUs.transparentPricing.title'),
        description: t('whyChooseUs.transparentPricing.description'),
      },
    ];


  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Grid container spacing={2} sx={{ padding: '40px' }}>
      {/* Left Section with Accordion */}
      <Grid item xs={12} md={6}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 4 }}>
          {t('whyChooseUs.title')}
        </Typography>
        {items.map((item, index) => (
          <Accordion
            key={index}
            expanded={expanded === index}
            onChange={handleChange(index)}
            sx={{ mb: 2 }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
            >
              <Typography sx={{ fontWeight: 'bold' }}>{item.title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{textAlign: 'left'}}>{item.description}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Grid>

      {/* Right Section with Image */}
      <Grid item xs={12} md={6}>
        <Box
          component="img"
          src={bmwWhyChoseUs} 
          alt="BMW Logo"
          sx={{ width: '100%', height: 'auto', borderRadius: '16px' }}
        />
      </Grid>
    </Grid>
  );
};

export default WhyChooseUs;
