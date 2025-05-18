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
  // console.log('stores', stores);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    general: {
      decimalsStorageProd: 2,
      decimalsCash: 2,
      baseSalary: 30,
      storageDisplay: 'PALETTE',
      productionDisplay: 'Carton/Palette',
      remarks: '', // Added this field
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
          site: site.id.toString(), // Convert `site.id` to a string
          consommation: '',
          production: '',
        })),
        panelSettings: sites.map((site) => ({
          site: site.id.toString(), // Convert `site.id` to a string
          consommation: '',
          production: '',
        })),
      }));
    }
  }, [sites]);
  const handleNext = async () => {
    try {
      if (activeStep === 0) {
        // Validate and submit general settings
        const parsed = schema.shape.general.parse(formData.general);
        console.log('Submitting general settings:', parsed);
        await createGeneralSetting(parsed);
        alert('Paramètres généraux enregistrés avec succès!');
      }

      if (activeStep === 1) {
        const parsed = schema.shape.productSettings.parse(formData.productSettings);
        console.log('Submitting product settings:', parsed);

        const formattedData = parsed.map((data) => ({
          site_id: parseInt(data.site, 10),
          store_id: stores.find((store) => store.code === data.consommation)?.id || null,
          nature: 'product',
          type: 1,
        }));

        console.log('Formatted Product Data:', formattedData);

        // Ensure all required fields are valid
        if (formattedData.some((data) => !data.store_id)) {
          throw new Error('Invalid store_id in product settings.');
        }

        await Promise.all(formattedData.map((data) => createGeneralSettingsInfo(data)));
        alert('Paramètres produit fini enregistrés avec succès!');
      }

      if (activeStep === 2) {
        const parsed = schema.shape.panelSettings.parse(formData.panelSettings);
        console.log('Submitting panel settings:', parsed);

        const formattedData = parsed.map((data) => ({
          site_id: parseInt(data.site, 10),
          store_id: stores.find((store) => store.code === data.production)?.id || null,
          nature: 'panel',
          type: 2,
        }));

        console.log('Formatted Panel Data:', formattedData);

        // Ensure all required fields are valid
        if (formattedData.some((data) => !data.store_id)) {
          throw new Error('Invalid store_id in panel settings.');
        }

        await Promise.all(formattedData.map((data) => createGeneralSettingsInfo(data)));
        alert('Paramètres panneau technique enregistrés avec succès!');
      }

      // Go to next step unless it's the last
      if (activeStep < steps.length - 1) {
        setActiveStep((prev) => prev + 1);
      }
    } catch (err) {
      console.error('Validation or submission error:', err);

      // Provide detailed feedback to the user
      if (err.name === 'ZodError') {
        alert('Échec de la validation. Veuillez vérifier vos saisies.');
      } else if (err.message.includes('Invalid store_id')) {
        alert('Échec de la validation. Veuillez sélectionner un magasin valide.');
      } else {
        alert("Une erreur est survenue lors de l'envoi des données. Veuillez réessayer.");
      }
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
      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Les remarques d'impression dans le bon de commande achat local"
          value={formData.general.remarks || ''}
          onChange={handleChange('general', null, 'remarks')}
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
              value={sites.find((site) => site.id.toString() === item.site)?.name || ''}
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
                    {store.designation}
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
              value={sites.find((site) => site.id.toString() === item.site)?.name || ''}
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
                    {store.designation}
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
          {activeStep === steps.length - 1 || activeStep === 0 ? 'VALIDÉ' : "L'ÉTAPE SUIVANTE"}
        </Button>
      </Box>
    </Box>
  );
}
