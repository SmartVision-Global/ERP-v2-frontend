import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import { Stack, IconButton, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function EnterpriseItem({ data = [], title, icon, sx, ...other }) {
  // const menuActions = usePopover();
  const router = useRouter();
  const handleRowClick = (id) => {
    router.push(paths.dashboard.settings.society.root);
  };

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
          <IconButton
            onClick={() => {
              console.log('search');
            }}
          >
            <Iconify icon="eva:search-fill" />
          </IconButton>
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
        {data.map((item) => (
          <Box
            key={item.id}
            onClick={() => handleRowClick(item.id)}
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
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 48,
                  height: 48,
                  bgcolor: 'background.neutral',
                  borderRadius: '50%',
                }}
              >
                <Iconify width={26} icon={icon} />
              </Box>
              <Stack direction="column" spacing={0.5} width="80%">
                <Typography variant="subtitle2">{item?.name}</Typography>
                <Stack>
                  {item?.activity && (
                    <Typography fontSize={12} color="text-secondary">
                      {item?.activity}
                    </Typography>
                  )}
                  {item?.address && (
                    <Typography fontSize={12} color="text-secondary">
                      {' '}
                      {item?.address}
                    </Typography>
                  )}
                </Stack>
              </Stack>
            </Stack>
          </Box>
        ))}
      </Stack>
    </Card>
  );
}
