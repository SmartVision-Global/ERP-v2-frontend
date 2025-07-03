import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import { Stack, Button, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

export function ValidationCircuitItem({
  data = { steps: [] },
  title,
  name,
  uuid,
  sx,
  ...other
}) {
  const router = useRouter();
  const { t } = useTranslate('settings-module');

  return (
    <Card sx={sx} {...other}>
      <Box
        sx={{
          p: 3,
          pb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="subtitle1">{title}</Typography>
        <Stack direction="row" spacing={1}>
         
            <Button
              onClick={() => {
                router.push(paths.dashboard.settings.validationCircuit.details(data.target_action));
              }}
              sx={{
                backgroundColor: 'black',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'grey.800',
                },
              }}
            >
              Details
            </Button>
          
        </Stack>
      </Box>

      <Divider sx={{ borderStyle: 'dashed' }} />
      <Stack
        direction="column"
        spacing={1}
        sx={{
          p: 4,
          mb: 2,
          maxHeight: 300,
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
        {(data?.steps || []).map((step) => (
          <Box
            key={step.id}
            sx={{
              px: 1,
              py: 0.5,
              borderRadius: 1,
              cursor: 'pointer',
              ':hover': {
                backgroundColor: 'lightgrey',
              },
            }}
          >
            <Stack direction="row" spacing={2} display="flex" alignItems="center">
              <Stack direction="column" spacing={0.5} width="80%">
                <Typography variant="subtitle2">{step?.name}</Typography>
                <Stack>
                  <Typography fontSize={12} color="text-secondary">
                    {t('text.required_approvals')}:  {step?.required_approvals}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Box>
        ))}
      </Stack>
    </Card>
  );
}
