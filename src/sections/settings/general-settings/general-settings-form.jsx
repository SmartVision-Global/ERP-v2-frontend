import { z } from 'zod';
import React, { useState, useEffect } from 'react';

import {
  Box,
  Button,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Grid,
} from '@mui/material';

import { useGetSites } from 'src/actions/site';
import { useGetStores } from 'src/actions/store'; // Import the useGetStores hook
import { useGetGeneralSettings, createGeneralSetting } from 'src/actions/generalSettings';
import {
  useGetGeneralSettingsInfo,
  createGeneralSettingsInfo,
} from 'src/actions/generalSettingsInfo';

const steps = ['Paramètre général', 'Paramétrage Produit fini', 'Paramétrage Panneau technique'];

const schema = z.object({
  general: z.object({
    decimalsStorageProd: z.number().min(0),
    decimalsCash: z.number().min(0),
    baseSalary: z.number().min(0),
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
  const { generalSettings } = useGetGeneralSettings();
  const { generalSettingsInfo } = useGetGeneralSettingsInfo();
  const { sites } = useGetSites();
  const { stores } = useGetStores(); // Fetch stores

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    general: {
      decimalsStorageProd: 2,
      decimalsCash: 2,
      baseSalary: 30,
      storageDisplay: 'PALETTE',
      productionDisplay: 'Carton/Palette',
    },
    productSettings: [],
    panelSettings: [],
  });

  // Load data for the first tab (general settings)
  useEffect(() => {
    if (generalSettings.length > 0) {
      const settings = generalSettings[0];
      setFormData((prev) => ({
        ...prev,
        general: {
          decimalsStorageProd: settings.decimalsStorageProd || 2,
          decimalsCash: settings.decimalsCash || 2,
          baseSalary: settings.baseSalary || 30,
          storageDisplay: settings.storageDisplay || 'PALETTE',
          productionDisplay: settings.productionDisplay || 'Carton/Palette',
        },
      }));
    }
  }, [generalSettings]);

  // Load data for the second and third tabs (general settings info)
  useEffect(() => {
    if (generalSettingsInfo.length > 0) {
      setFormData((prev) => ({
        ...prev,
        productSettings: generalSettingsInfo
          .filter((info) => info.type === 1)
          .map((info) => ({
            site: info.site.id,
            consommation: info.store?.code || '',
            production: info.store?.designation || '',
          })),
        panelSettings: generalSettingsInfo
          .filter((info) => info.type === 2)
          .map((info) => ({
            site: info.site.id,
            consommation: info.store?.code || '',
            production: info.store?.designation || '',
          })),
      }));
    }
  }, [generalSettingsInfo]);

  // Map sites and stores to product and panel settings
  useEffect(() => {
    if (sites.length > 0) {
      setFormData((prev) => ({
        ...prev,
        productSettings: sites.map((site) => ({
          site: site.id,
          consommation: '',
          production: '',
        })),
        panelSettings: sites.map((site) => ({
          site: site.id,
          consommation: '',
          production: '',
        })),
      }));
    }
  }, [sites]);

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      try {
        const parsed = schema.parse(formData);
        console.log('Form submission:', parsed);

        // Save the general settings to the server
        await createGeneralSetting(parsed.general);

        // Save the product and panel settings to the server
        await Promise.all([
          ...formData.productSettings.map((data) =>
            createGeneralSettingsInfo({ ...data, type: 1 })
          ),
          ...formData.panelSettings.map((data) => createGeneralSettingsInfo({ ...data, type: 2 })),
        ]);

        alert('Settings saved successfully!');
      } catch (err) {
        console.error('Validation error:', err);
        alert('Validation failed. Please check your inputs.');
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
      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Affichage par conditionnement (Production)"
          value={formData.general.productionDisplay}
          onChange={handleChange('general', null, 'productionDisplay')}
          sx={inputStyle}
        />
      </Grid>
    </Grid>
  );

  const renderSettings = (section) => (
    <Box>
      {/* Magasinage Section */}
      <Typography
        variant="subtitle1"
        mt={2}
        mb={1}
        sx={{ backgroundColor: '#ffb822', padding: 1, display: 'inline-block' }}
      >
        Magasinage
      </Typography>
      {formData[section].map((item, idx) => (
        <Grid container spacing={2} key={`magasinage-${idx}`} mt={2}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              disabled
              label="Site"
              value={sites.find((site) => site.id === item.site)?.name || ''}
              sx={inputStyle}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth sx={inputStyle}>
              <InputLabel>Consommation</InputLabel>
              <Select
                value={item.consommation}
                onChange={handleChange(section, idx, 'consommation')}
                label="Consommation"
              >
                <MenuItem value="">Sélectionné</MenuItem>
                {stores.map((store) => (
                  <MenuItem key={store.id} value={store.code}>
                    {store.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      ))}

      {/* Production Section */}
      <Typography
        variant="subtitle1"
        mt={4}
        mb={1}
        sx={{ backgroundColor: '#ffb822', padding: 1, display: 'inline-block' }}
      >
        Production
      </Typography>
      {formData[section].map((item, idx) => (
        <Grid container spacing={2} key={`production-${idx}`} mt={2}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              disabled
              label="Site"
              value={sites.find((site) => site.id === item.site)?.name || ''}
              sx={inputStyle}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth sx={inputStyle}>
              <InputLabel>Production</InputLabel>
              <Select
                value={item.production}
                onChange={handleChange(section, idx, 'production')}
                label="Production"
              >
                <MenuItem value="">Sélectionné</MenuItem>
                {stores.map((store) => (
                  <MenuItem key={store.id} value={store.code}>
                    {store.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      ))}
    </Box>
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
