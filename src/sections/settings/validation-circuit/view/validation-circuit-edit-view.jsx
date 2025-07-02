import { useState } from 'react';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { StepCard } from '../step-card';
import { ValidationRequestDialog } from '../validation-request-dialog';

// ----------------------------------------------------------------------

export function ValidationCircuitEditView({ validationCircuit }) {
  const [openForm, setOpenForm] = useState(false);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit Validation Circuit"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: 'Validation Circuit',
            href: paths.dashboard.settings.validationCircuit.root,
          },
          { name: validationCircuit?.name },
        ]}
        action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => setOpenForm(true)}
            >
              New Validation Request
            </Button>
          }
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      
      <Stack spacing={3}>
        {validationCircuit?.steps.map((step, index) => (
          <StepCard key={step.id} index={index + 1} step={step} />
        ))}
      </Stack>

      <ValidationRequestDialog 
        open={openForm} 
        onClose={() => setOpenForm(false)} 
        targetAction={validationCircuit?.target_action}
      />
    </DashboardContent>
  );
}
