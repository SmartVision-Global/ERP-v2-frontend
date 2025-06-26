import { forwardRef } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import { Stack, Divider, CardHeader, CardContent } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetGeneralSettingsContracts } from 'src/actions/generalSettings';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = { category: false };

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

export function ContractListView() {
  const { generalSettings: contract } = useGetGeneralSettingsContracts();
  // console.log('contract', JSON.parse(contract)[1]);
  // const contractParsed = contract ?? JSON.parse(contract);
  // console.log('contractParsed', contractParsed['1']);

  return (
    <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <CustomBreadcrumbs
        heading="List"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          // { name: 'Ressources humaine', href: paths.dashboard.root },
          { name: 'Zones' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={
              contract
                ? paths.dashboard.rh.rhSettings.editContract
                : paths.dashboard.rh.rhSettings.newContract
            }
            variant="contained"
            startIcon={<Iconify icon={contract ? 'eva:edit-outline' : 'mingcute:add-line'} />}
          >
            {contract ? 'Modifier' : 'Ajouter'}
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card
        sx={{
          flexGrow: { md: 1 },
          display: { md: 'flex' },
          flexDirection: { md: 'column' },
        }}
      >
        <Box paddingX={4} paddingY={2} sx={{}}>
          <Stack spacing={3} sx={{ p: 3 }}>
            {!contract ? (
              <EmptyContent filled sx={[{ py: 10 }]} title="Le contrat n'est pas encore créé" />
            ) : (
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Card>
                    <CardHeader title="Contract CDD" sx={{ mb: 3 }} />

                    <Divider />
                    <CardContent
                      sx={{
                        // p: 4,
                        // mb: 2,
                        maxHeight: 400,
                        overflow: 'auto',
                        '&::-webkit-scrollbar': {
                          width: '8px', // Width of the scrollbar
                        },
                        '&::-webkit-scrollbar-track': {
                          backgroundColor: '#f1f1f1', // Track color
                          borderRadius: '4px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                          backgroundColor: '#888', // Thumb color
                          borderRadius: '4px',
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                          backgroundColor: '#555', // Thumb color on hover
                        },
                      }}
                    >
                      <div
                        dangerouslySetInnerHTML={{
                          __html: contract ? JSON.parse(contract)[1].text : '',
                        }}
                        className="prose prose-sm max-w-none"
                      />
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Card>
                    <CardHeader title="Contract CDI" sx={{ mb: 3 }} />

                    <Divider />
                    <CardContent>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: contract ? JSON.parse(contract)[2].text : '',
                        }}
                        className="prose prose-sm max-w-none"
                      />
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Card>
                    <CardHeader title="Autre contrat" sx={{ mb: 3 }} />

                    <Divider />
                    <CardContent>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: contract ? JSON.parse(contract)[2].text : '',
                        }}
                        className="prose prose-sm max-w-none"
                      />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}
          </Stack>
        </Box>
      </Card>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export const GridActionsLinkItem = forwardRef((props, ref) => {
  const { href, label, icon, sx } = props;

  return (
    <MenuItem ref={ref} sx={sx}>
      <Link
        component={RouterLink}
        href={href}
        underline="none"
        color="inherit"
        sx={{ width: 1, display: 'flex', alignItems: 'center' }}
      >
        {icon && <ListItemIcon>{icon}</ListItemIcon>}
        {label}
      </Link>
    </MenuItem>
  );
});

// ----------------------------------------------------------------------
