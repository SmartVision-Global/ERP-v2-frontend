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
import { useGetStores } from 'src/actions/store';
import { useGetGeneralSettings, createGeneralSetting } from 'src/actions/generalSettings';
import {
  useGetGeneralSettingsInfo,
  createGeneralSettingsInfo,
} from 'src/actions/generalSettingsInfo.js';

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
        consommation: z.string().optional(),
        production: z.string().optional(),
      })
    )
    .optional(),
  panelSettings: z
    .array(
      z.object({
        site: z.string().nonempty({ message: 'Site is required' }),
        consommation: z.string().optional(),
        production: z.string().optional(),
      })
    )
    .optional(),
});

export default function GeneralSettingsForm() {
  const { generalSettings } = useGetGeneralSettings();
  let { generalSettingsInfo } = useGetGeneralSettingsInfo();
  const { sites } = useGetSites();
  const { stores } = useGetStores();

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    general: {
      decimalsStorageProd: 0,
      decimalsCash: 0,
      baseSalary: 0,
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

  useEffect(() => {
    if (!sites?.length) {
      return;
    }

    let productSettings = sites.map((site) => ({
      site: site.id.toString(),
      consommation: '',
      production: '',
    }));

    let panelSettings = sites.map((site) => ({
      site: site.id.toString(),
      consommation: '',
      production: '',
    }));

    if (generalSettings) {
      setFormData((prev) => ({
        ...prev,
        general: {
          decimalsStorageProd: Number(generalSettings.round_number) || 0,
          decimalsCash: Number(generalSettings.fund_round_number) || 0,
          baseSalary: Number(generalSettings.base_salary) || 0,
          storageDisplay: generalSettings.con_auto || 'PALETTE',
          productionDisplay: generalSettings.fo_auto || 'Carton/Palette',
          remarks: generalSettings.command_order_print_designation || '',
        },
      }));
    }

    if (generalSettingsInfo?.length > 0) {
      const settingsRecords = generalSettingsInfo;

      productSettings = sites.map((site) => {
        const siteSettings = settingsRecords.filter(
          (info) => info.site?.id === site.id && info.type === 1
        );

        const consumptionSettings = siteSettings.filter((s) => s.nature === 1);
        const latestConsumption = consumptionSettings[consumptionSettings.length - 1];

        const productionSettings = siteSettings.filter((s) => s.nature === 2);
        const latestProduction = productionSettings[productionSettings.length - 1];

        return {
          site: site.id.toString(),
          consommation: latestConsumption?.store?.code ?? '',
          production: latestProduction?.store?.code ?? '',
        };
      });

      panelSettings = sites.map((site) => {
        const siteSettings = settingsRecords.filter(
          (info) => info.site?.id === site.id && info.type === 2
        );

        const consumptionSettings = siteSettings.filter((s) => s.nature === 1);
        const latestConsumption = consumptionSettings[consumptionSettings.length - 1];

        const productionSettings = siteSettings.filter((s) => s.nature === 2);
        const latestProduction = productionSettings[productionSettings.length - 1];

        return {
          site: site.id.toString(),
          consommation: latestConsumption?.store?.code ?? '',
          production: latestProduction?.store?.code ?? '',
        };
      });
    }

    setFormData((prev) => ({
      ...prev,
      productSettings,
      panelSettings,
    }));
  }, [sites, generalSettings, generalSettingsInfo]);

  const handleNext = async () => {
    try {
      if (activeStep === 0) {
        const generalData = {
          round_number: formData.general.decimalsStorageProd.toString(),
          fund_round_number: formData.general.decimalsCash.toString(),
          base_salary: formData.general.baseSalary.toString(),
          con_auto: formData.general.storageDisplay,
          fo_auto: formData.general.productionDisplay,
          command_order_print_designation: formData.general.remarks,
        };

        await createGeneralSetting(generalData);
        toast.success('Paramètres généraux enregistrés avec succès!');
      }

      if (activeStep === 1 || activeStep === 2) {
        const settings = activeStep === 1 ? formData.productSettings : formData.panelSettings;
        const type = activeStep === 1 ? 1 : 2;

        const details = [];
        settings.forEach((data) => {
          const siteId = parseInt(data.site, 10);

          const consumptionStore = data.consommation
            ? stores?.find((store) => store.code === data.consommation)
            : null;

          details.push({
            site_id: siteId,
            store_id: consumptionStore?.id || null,
            nature: 1,
            type: type,
          });

          const productionStore = data.production
            ? stores?.find((store) => store.code === data.production)
            : null;

          details.push({
            site_id: siteId,
            store_id: productionStore?.id || null,
            nature: 2,
            type: type,
          });
        });

        console.log('Formatted Data to send:', details);
        try {
          await createGeneralSettingsInfo({ details });

          toast.success(
            activeStep === 1
              ? 'Paramètres produit fini enregistrés avec succès!'
              : 'Paramètres panneau technique enregistrés avec succès!'
          );
        } catch (error) {
          console.error('Error saving settings:', error);
          toast.error("Une erreur est survenue lors de l'enregistrement des paramètres.");
          throw error;
        }
      }

      if (activeStep < steps.length - 1) {
        setActiveStep((prev) => prev + 1);
      }
    } catch (err) {
      console.error('Validation or submission error:', err);

      if (err?.name === 'ZodError') {
        err.errors.forEach((error) => {
          toast.error(error.message);
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
        if (updated[section] && updated[section][index]) {
          updated[section][index][field] = value;
        }
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

  const renderSettings = (section) => {
    const settings = formData[section] || [];

    if (settings.length === 0) {
      return (
        <Box mt={2}>
          <Typography>Chargement des paramètres...</Typography>
        </Box>
      );
    }

    return (
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
        {settings.map((item, idx) => {
          const filteredStores =
            stores?.filter((store) => store.site_id.toString() === item.site) || [];

          return (
            <Grid container spacing={2} key={`magasinage-${idx}`} mt={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  disabled
                  label="Site"
                  value={sites?.find((site) => site.id.toString() === item.site)?.name || ''}
                  sx={inputStyle}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth sx={inputStyle}>
                  <InputLabel>Consommation</InputLabel>
                  <Select
                    value={item.consommation || ''}
                    onChange={handleChange(section, idx, 'consommation')}
                    label="Consommation"
                  >
                    <MenuItem value="">Aucune sélection</MenuItem>
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

        {/* Production Section - Similar changes */}
        <Typography
          variant="subtitle1"
          mt={4}
          mb={1}
          sx={{ backgroundColor: '#ffb822', padding: 1, display: 'inline-block', borderRadius: 1 }}
        >
          Production
        </Typography>
        {settings.map((item, idx) => {
          const filteredStores =
            stores?.filter((store) => store.site_id.toString() === item.site) || [];

          return (
            <Grid container spacing={2} key={`production-${idx}`} mt={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  disabled
                  label="Site"
                  value={sites?.find((site) => site.id.toString() === item.site)?.name || ''}
                  sx={inputStyle}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth sx={inputStyle}>
                  <InputLabel>Production</InputLabel>
                  <Select
                    value={item.production || ''}
                    onChange={handleChange(section, idx, 'production')}
                    label="Production"
                  >
                    <MenuItem value="">Aucune sélection</MenuItem>
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
  };

  return (
    <Box sx={{ width: '100%', p: 4 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel onClick={() => setActiveStep(index)} style={{ cursor: 'pointer' }}>
              {label}
            </StepLabel>
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
