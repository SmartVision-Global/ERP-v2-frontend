import { useState } from 'react';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import { Stack, Button, Typography } from '@mui/material';

import { Iconify } from 'src/components/iconify';

import { AddItemDialog } from './add-item-dialog';

// ----------------------------------------------------------------------


export function ParamItem({
  data = { steps: [] },
  title,
  name,
  canAdd = false,
  uuid,
  onCreate,
  onUpdate,
  sx,
  ...other
}) {
  const [openDialog, setOpenDialog] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);

  const router = useRouter();

  const handleRowClick = (row) => {
    setSelectedRow(row);
    setOpenDialog(uuid);
  };
  const handleCloseDialog = () => {
    setOpenDialog('');
    setSelectedRow(null);
  };


  return (
    <>
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
            {canAdd && (
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
            )}
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
              onClick={() => handleRowClick(step)}
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
                      Required approvals: {step?.required_approvals}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Card>
      {openDialog && (
        <AddItemDialog
          open={openDialog && true}
          onClose={handleCloseDialog}
          name={name}
          title={title}
          onCreate={onCreate}
          onUpdate={onUpdate}
          currentProduct={selectedRow}
        />
      )}
    </>
  );
}
