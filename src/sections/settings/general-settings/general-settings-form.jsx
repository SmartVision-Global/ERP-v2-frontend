import { z } from 'zod';
import React, { useState } from 'react';

import {
  Box,
  Button,
  Step,
  StepLabel,
  Stepper,
  Switch,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Grid,
  FormControlLabel,
} from '@mui/material';

const steps = ['Paramètre général', 'Paramétrage Produit fini', 'Paramétrage Panneau technique'];

const schema = z.object({
  general: z.object({
    decimalsStorageProd: z.number().min(0),
    decimalsCash: z.number().min(0),
    baseSalary: z.number().min(0),
    newBaseSalary: z.number().min(0),
    inventoryDuration: z.number().min(0),
    storageDisplay: z.string(),
    productionDisplay: z.string(),
  }),
  productSettings: z.array(
    z.object({
      site: z.string(),
      consommation: z.string(),
      production: z.string(),
    })
  ),
  panelSettings: z.array(
    z.object({
      site: z.string(),
      consommation: z.string(),
      production: z.string(),
    })
  ),
});

export default function GeneralSettingsForm() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    general: {
      decimalsStorageProd: 2,
      decimalsCash: 2,
      baseSalary: 30,
      // newBaseSalary: 30,
      // inventoryDuration: 10,
      storageDisplay: 'PALETTE',
      // productionDisplay: 'Carton/Palette',
    },
    productSettings: [
      { site: 'Batna', consommation: 'PL', production: 'PF-PRODUCTION' },
      { site: 'BATNA', consommation: '', production: '' },
      { site: 'SETIF', consommation: 'MP01', production: 'SETIF' },
      { site: 'SFS', consommation: 'MC01', production: 'MC01' },
    ],
    panelSettings: [
      { site: 'Batna', consommation: 'PL', production: 'PT-PRODUCTION' },
      { site: 'BATNA', consommation: '', production: '' },
      { site: 'SETIF', consommation: '', production: '' },
      { site: 'SFS', consommation: '', production: '' },
    ],
  });

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      try {
        const parsed = schema.parse(formData);
        console.log('Form submission:', parsed);
      } catch (err) {
        console.error('Validation error:', err);
      }
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleChange = (section, index, field) => (e) => {
    const value = e.target.value;
    setFormData((prev) => {
      const updated = { ...prev };
      if (section === 'general') {
        updated.general[field] = isNaN(value) ? value : Number(value);
      } else {
        updated[section][index][field] = value;
      }
      return updated;
    });
  };

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      '&:hover fieldset': {
        borderColor: 'inherit',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'inherit',
        borderWidth: 1,
      },
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(0, 0, 0, 0.23)',
    },
  };

  const renderGeneral = () => (
    <Grid container spacing={2} mt={2}>
      {[
        { label: 'Nombre de décimales ( Magasinage et production)', key: 'decimalsStorageProd' },
        { label: 'Nombre de décimales ( Caisse)', key: 'decimalsCash' },
        { label: 'Base Salaire', key: 'baseSalary' },

        // { label: 'Base Salaire ( Nouvel employeur)', key: 'newBaseSalary' },
        // { label: 'La durée entre les inventaires', key: 'inventoryDuration' },
      ].map(({ label, key }) => (
        <Grid item xs={6} key={key}>
          <TextField
            fullWidth
            label={label}
            type="number"
            value={formData.general[key]}
            onChange={handleChange('general', null, key)}
            sx={inputStyle}
          />
        </Grid>
      ))}
      {/* <Box sx={{ width: '300px', margin: '0 auto', mt: 4 }}>
        <TextField
          fullWidth
          label="Your Label"
          value={value}
          onChange={handleChange}
          variant="outlined" // You can use "filled" or "standard" as well
        />
      </Box> */}
      {/* <Grid item xs={6}>
        <TextField
          fullWidth
          label="Affichage par conditionnement (Magasinage)"
          value={formData.general.storageDisplay}
          onChange={handleChange('general', null, 'storageDisplay')}
          sx={inputStyle}
        />
      </Grid> */}

      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Affichage par conditionnement (Production)"
          value={formData.general.storageDisplay}
          onChange={handleChange('general', null, 'productionDisplay')}
          sx={inputStyle}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Les remarques d'impression don le bon de commande achat local"
          multiline
          rows={4}
          value={formData.general.description || ''} // Add a new key in your state if not already present
          onChange={handleChange('general', null, 'description')}
          sx={inputStyle}
        />
      </Grid>
    </Grid>
  );

  const renderSettings = (section) => (
    <>
      {formData[section].map((item, idx) => (
        <Grid container spacing={2} key={idx} mt={2}>
          <Grid item xs={3}>
            <TextField fullWidth label="Site" value={item.site} sx={inputStyle} />
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth sx={inputStyle}>
              <InputLabel>
                {section === 'productSettings' ? 'Consommation' : 'Consommation'}
              </InputLabel>
              <Select
                value={item.consommation}
                onChange={handleChange(section, idx, 'consommation')}
                label="Consommation"
              >
                <MenuItem value="">Sélectionné</MenuItem>
                <MenuItem value="PL">PL</MenuItem>
                <MenuItem value="MP01">MP01</MenuItem>
                <MenuItem value="MC01">MC01</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={5}>
            <FormControl fullWidth sx={inputStyle}>
              <InputLabel>Production</InputLabel>
              <Select
                value={item.production}
                onChange={handleChange(section, idx, 'production')}
                label="Production"
              >
                <MenuItem value="">Sélectionné</MenuItem>
                <MenuItem value="PF-PRODUCTION">PF-PRODUCTION</MenuItem>
                <MenuItem value="PT-PRODUCTION">PT-PRODUCTION</MenuItem>
                <MenuItem value="SETIF">SETIF</MenuItem>
                <MenuItem value="MC01">MC01</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      ))}
    </>
  );

  return (
    <Box sx={{ width: '100%', p: 4 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Typography variant="h6" mt={4}>
        {steps[activeStep]}
      </Typography>

      {activeStep === 0 && renderGeneral()}
      {activeStep === 1 && renderSettings('productSettings')}
      {activeStep === 2 && renderSettings('panelSettings')}

      <Box mt={4} display="flex" justifyContent="space-between">
        {activeStep > 0 && (
          <Button variant="outlined" onClick={handleBack}>
            ÉTAPE PRÉCÉDENTE
          </Button>
        )}
        <Button variant="contained" color="primary" onClick={handleNext}>
          {activeStep === steps.length - 1 ? 'VALIDÉ' : "L'ÉTAPE SUIVANTE"}
        </Button>
      </Box>
    </Box>
  );
}
