import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import { Stack, IconButton, Typography } from '@mui/material';

import { Iconify } from 'src/components/iconify';

import { AddItemDialog } from './add-item-dialog';

// ----------------------------------------------------------------------

const DIALOG_OPEN = [
  '2',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
];
const NAME_OPTIONS = {
  1: { name: 'entreprise', title: 'Entreprises' },

  2: { name: 'directions', title: 'Direction' },
  4: { name: 'filiale', title: 'Filiales' },

  5: { name: 'divisions', title: 'Divisions' },
  6: { name: 'departement', title: 'Département' },
  7: { name: 'section', title: 'Section' },

  8: { name: 'nationality', title: 'Nationalité' },
  9: { name: 'category', title: 'Catégories EPI' },
  10: { name: 'epi', title: 'Normes de conformité EPI' },
  11: { name: 'grade', title: 'Grade' },
  12: { name: 'bank', title: 'Banque' },
  13: { name: 'team_type', title: "Type d'équipe" },
  14: { name: 'socio_category', title: 'Catégorie socioprofessionnelle' },
  15: { name: 'echelons', title: 'Échelons' },
  16: { name: 'salary_grid', title: 'Niveau de la grille salariale' },
  17: { name: 'demande_motif', title: 'Motifs des demandes' },
  18: { name: 'demande_motif', title: 'Motifs des demandes ' },
};
export function ParamItem({
  data = [],
  title,
  canAdd = false,
  icon,
  uuid,
  onCreate,
  onUpdate,
  sx,
  ...other
}) {
  const [openDialog, setOpenDialog] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const handleRowClick = (row) => {
    setSelectedRow(row);
    setOpenDialog(uuid);
  };
  const handleCloseDialog = () => {
    setOpenDialog('');
    setSelectedRow(null);
  };
  console.log('openDialog', openDialog);

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
            <IconButton
              onClick={() => {
                console.log('search');
              }}
            >
              <Iconify icon="eva:search-fill" />
            </IconButton>

            {canAdd && (
              <IconButton
                onClick={() => {
                  setOpenDialog(uuid);
                }}
              >
                <Iconify icon="mdi:add-circle-outline" />
              </IconButton>
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
          {data.map((item) => (
            <Box
              key={item.id}
              onClick={() => handleRowClick(item)}
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
                    {item?.designation && (
                      <Typography fontSize={12} color="text-secondary">
                        {item?.designation}
                      </Typography>
                    )}
                    {item?.adress && (
                      <Typography fontSize={12} color="text-secondary">
                        {' '}
                        {item?.adress}
                      </Typography>
                    )}
                  </Stack>
                </Stack>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Card>
      {DIALOG_OPEN.includes(openDialog) && (
        <AddItemDialog
          open={DIALOG_OPEN.includes(openDialog)}
          onClose={handleCloseDialog}
          name={NAME_OPTIONS[uuid].name}
          title={NAME_OPTIONS[uuid].title}
          onCreate={onCreate}
          onUpdate={onUpdate}
          currentProduct={selectedRow}
        />
      )}
    </>
  );
}
