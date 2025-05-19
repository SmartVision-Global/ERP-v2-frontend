import { z } from 'zod';
import { toast } from 'sonner';
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

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
    decimalsStorageProd: z.number().min(0, { message: 'This field is required' }),
    decimalsCash: z.number().min(0, { message: 'This field is required' }),
    baseSalary: z.number().min(0, { message: 'This field is required' }),
    storageDisplay: z.string().nonempty({ message: 'This field is required' }),
    productionDisplay: z.string().nonempty({ message: 'This field is required' }),
  }),
  productSettings: z
    .array(
      z.object({
        site: z.string().nonempty({ message: 'Site is required' }),
        consommation: z.string().nonempty({ message: 'Consommation is required' }),
        production: z.string().nonempty({ message: 'Production is required' }),
      })
    )
    .nonempty({ message: 'At least one product setting is required' }),
  panelSettings: z.array(
    z.object({
      site: z.string().nonempty({ message: 'Site is required' }),
      consommation: z.string().nonempty({ message: 'Consommation is required' }),
      production: z.string().nonempty({ message: 'Production is required' }),
    })
  ),
});

export default function GeneralSettingsForm() {
  const { generalSettings } = useGetGeneralSettings();
  const { generalSettingsInfo } = useGetGeneralSettingsInfo();
  const { sites } = useGetSites();
  const { stores } = useGetStores();

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    general: {
      decimalsStorageProd: 2,
      decimalsCash: 2,
      baseSalary: 30,
      storageDisplay: 'PALETTE',
      productionDisplay: 'Carton/Palette',
      remarks: '',
    },
    productSettings: [],
    panelSettings: [],
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: formData,
  });

  const onSubmit = (data) => {
    console.log('Validated data:', data);
  };

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
        const parsed = schema.shape.general.parse(formData.general);
        console.log('Submitting general settings:', parsed);
        await createGeneralSetting(parsed);
        toast.success('Paramètres généraux enregistrés avec succès!');
      }

      if (activeStep === 1) {
        const parsed = schema.shape.productSettings.parse(formData.productSettings);
        console.log('Submitting product settings:', parsed);

        const formattedData = parsed.map((data) => ({
          site_id: parseInt(data.site, 10),
          store_id: stores.find((store) => store.code === data.consommation)?.id || null,
          nature: 1,
          type: 1,
        }));

        console.log('Formatted Product Data:', formattedData);

        if (formattedData.some((data) => !data.store_id)) {
          toast.error('Échec de la validation. Veuillez sélectionner un magasin valide.');
          return;
        }

        await Promise.all(formattedData.map((data) => createGeneralSettingsInfo(data)));
        toast.success('Paramètres produit fini enregistrés avec succès!');
      }

      if (activeStep === 2) {
        const parsed = schema.shape.panelSettings.parse(formData.panelSettings);
        console.log('Submitting panel settings:', parsed);

        const formattedData = parsed.map((data) => ({
          site_id: parseInt(data.site, 10),
          store_id: stores.find((store) => store.code === data.production)?.id || null,
          nature: 2,
          type: 2,
        }));

        console.log('Formatted Panel Data:', formattedData);

        if (formattedData.some((data) => !data.store_id)) {
          toast.error('Échec de la validation. Veuillez sélectionner un magasin valide.');
        }

        await Promise.all(formattedData.map((data) => createGeneralSettingsInfo(data)));
        alert('Paramètres panneau technique enregistrés avec succès!');
      }

      if (activeStep < steps.length - 1) {
        setActiveStep((prev) => prev + 1);
      }
    } catch (err) {
      console.error('Validation or submission error:', err);

      if (err.name === 'ZodError') {
        err.errors.forEach((error) => {
          toast.error(error.message); // Display each error message
        });
      } else {
        toast.error("Une erreur est survenue lors de l'envoi des données. Veuillez réessayer.");
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
        sx={{ backgroundColor: '#ffb822', padding: 1, display: 'inline-block', borderRadius: 1 }}
      >
        Magasinage
      </Typography>
      {formData[section].map((item, idx) => {
        const filteredStores = stores.filter((store) => store.site_id.toString() === item.site);

        return (
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
                  {filteredStores.map((store) => (
                    <MenuItem key={store.id} value={store.code}>
                      {store.designation}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );
      })}

      {/* Production Section */}
      <Typography
        variant="subtitle1"
        mt={4}
        mb={1}
        sx={{ backgroundColor: '#ffb822', padding: 1, display: 'inline-block', borderRadius: 1 }}
      >
        Production
      </Typography>
      {formData[section].map((item, idx) => {
        // Filter stores based on the current site's `site_id`
        const filteredStores = stores.filter((store) => store.site_id.toString() === item.site);

        return (
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
                  {filteredStores.map((store) => (
                    <MenuItem key={store.id} value={store.code}>
                      {store.designation}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );
      })}
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
