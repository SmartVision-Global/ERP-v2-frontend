import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Grid from '@mui/material/Grid2';
import { Box, Button, Tab, Tabs, MenuItem } from '@mui/material';
import { Form, Field } from 'src/components/hook-form';
import { useMultiLookups } from 'src/actions/lookups';
import { PRODUCT_TYPE_OPTIONS, PRIORITY_OPTIONS } from 'src/_mock/expression-of-needs/Beb/Beb';

// Validation schema for the first tab fields
const bebSchema = z.object({
  nature: z.string().nonempty({ message: 'Nature is required' }),
  requested_date: z.string().nonempty({ message: 'Date de besoins is required' }),
  site_id: z.string().nonempty({ message: 'Site is required' }),
  type: z.string().nonempty({ message: 'Type is required' }),
  priority: z.string().nonempty({ message: 'Priorité is required' }),
  observation: z.string().optional(),
});

// BEB Request Form with two tabs: Informations and Produits
export function BebNewEditForm({ initialData, onSubmit }) {
  const [currentTab, setCurrentTab] = useState(0);
  const { dataLookups, dataLoading } = useMultiLookups([
    { entity: 'sites', url: 'settings/lookups/sites' },
  ]);
  const sites = dataLookups.sites || [];
  

  const methods = useForm({
    resolver: zodResolver(bebSchema),
    defaultValues: {
      nature: initialData?.nature || '',
      requested_date: initialData?.requested_date || '',
      site_id: initialData?.site_id?.toString() || '',
      type: initialData?.type?.toString() || PRODUCT_TYPE_OPTIONS[0]?.value?.toString() || '',
      priority:
        initialData?.priority?.toString() || PRIORITY_OPTIONS[0]?.value?.toString() || '',
      observation: initialData?.observation || '',
    },
  });

  const { handleSubmit, reset } = methods;

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  // Move to next tab or submit at the last tab
  const handleFormSubmit = (data) => {
    if (currentTab === 0) {
      setCurrentTab(1);
    } else {
      onSubmit?.(data);
    }
  };

  useEffect(() => {
    if (!dataLoading && sites.length > 0) {
      reset({
        site_id: initialData?.site_id?.toString() || '',
      });
    }
  }, [dataLoading, sites, reset]);

  return (
    <Form methods={methods} onSubmit={handleSubmit(handleFormSubmit)}>
      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        aria-label="BEB Request Tabs"
        sx={{ mb: 3 }}
      >
        <Tab label="Informations" />
        <Tab label="Produits" />
      </Tabs>

      {currentTab === 0 && (
        <Box>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Field.Select name="nature" label="Nature" size="small">
                <MenuItem value="demande_de_sortie">Demande de sortie</MenuItem>
              </Field.Select>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Field.DatePicker
                name="requested_date"
                label="Date de besoins"
                disablePast
                slotProps={{ textField: { size: 'small' } }}
              />
            </Grid>
           
            <Grid size={{ xs: 12, md: 6 }}>
              <Field.Lookup
                name="site_id"
                label="Site"
                data={sites}
              />
            </Grid>
           

            <Grid size={{ xs: 12, md: 4 }}>
              <Field.Select name="type" label="Type" size="small">
                {PRODUCT_TYPE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Field.Select name="priority" label="Priorité" size="small">
                {PRIORITY_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Field.Text
                name="observation"
                label="Observations"
                multiline
                rows={3}
              />
            </Grid>

            <Grid  display="flex" justifyContent="flex-end">
              <Button type="submit" variant="contained">
                L'ÉTAPE SUIVANTE
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}

      {currentTab === 1 && (
        <Box>
          {/* Second tab (Produits) content goes here */}
        </Box>
      )}
    </Form>
  );
} 