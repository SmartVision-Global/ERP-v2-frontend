import { useState } from 'react';
import { usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import { Stack, IconButton, Typography } from '@mui/material';

import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';

import { AddFilialeDialog } from './add-filiale-dialog';
import { AddDirectionDialo } from './add-direction-dialog';
import { AddDivisionsDialog } from './add-divisions-dialog';

// ----------------------------------------------------------------------

const DIALOG_OPEN = ['5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18'];
const NAME_OPTIONS = {
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
export function ParamItem({ job, editHref, detailsHref, onDelete, sx, ...other }) {
  const menuActions = usePopover();
  const [openDialog, setOpenDialog] = useState('');
  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: 'right-top' } }}
    >
      <MenuList>
        <li>
          <MenuItem component={RouterLink} href={detailsHref} onClick={() => menuActions.onClose()}>
            <Iconify icon="solar:eye-bold" />
            View
          </MenuItem>
        </li>

        <li>
          <MenuItem component={RouterLink} href={editHref} onClick={() => menuActions.onClose()}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>
        </li>

        <MenuItem
          onClick={() => {
            menuActions.onClose();
            onDelete();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );

  return (
    <>
      <Card sx={sx} {...other}>
        {/* <IconButton onClick={menuActions.onOpen} sx={{ position: 'absolute', top: 8, right: 8 }}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton> */}

        <Box
          sx={{
            p: 3,
            pb: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="subtitle1">{job.title}</Typography>
          <Stack direction="row" spacing={1}>
            <IconButton
              onClick={() => {
                console.log('search');
              }}
            >
              <Iconify icon="eva:search-fill" />
            </IconButton>

            {job.can_add && (
              <IconButton
                onClick={() => {
                  setOpenDialog(job.uuid);
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
          {job.items.map((item) => (
            <Box key={item.id}>
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
                  <Iconify width={26} icon={job.icon} />
                </Box>
                <Stack direction="column" spacing={0.5} width="80%">
                  <Typography variant="subtitle2">{item?.title}</Typography>
                  <Stack>
                    {item?.category && (
                      <Typography fontSize={12} color="text-secondary">
                        {item?.category}
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

      {renderMenuActions()}

      {openDialog === '2' && (
        <AddDirectionDialo open={openDialog === '2'} onClose={() => setOpenDialog('')} />
      )}
      {openDialog === '4' && (
        <AddFilialeDialog open={openDialog === '4'} onClose={() => setOpenDialog('')} />
      )}
      {DIALOG_OPEN.includes(openDialog) && (
        <AddDivisionsDialog
          open={DIALOG_OPEN.includes(openDialog)}
          onClose={() => setOpenDialog('')}
          name={NAME_OPTIONS[job.uuid].name}
          title={NAME_OPTIONS[job.uuid].title}
        />
      )}
    </>
  );
}
