import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import { Stack, IconButton, Typography, TextField, InputAdornment } from '@mui/material';

import { PRODUCT_TYPE_OPTIONS } from 'src/_mock/expression-of-needs/Beb/Beb';

import { Iconify } from 'src/components/iconify';

import { AddItemDialog } from './add-item-dialog';

// ----------------------------------------------------------------------

export function ParamItem({
  data = [],
  title,
  name,
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
  const [searchQuery, setSearchQuery] = useState('');

  const handleRowClick = (row) => {
    setSelectedRow(row);
    setOpenDialog(uuid);
  };
  const handleCloseDialog = () => {
    setOpenDialog('');
    setSelectedRow(null);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredData = data.filter((item) =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <TextField
              size="small"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />

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
          {filteredData.map((item) => (
            <Box
              key={item.id}
              onClick={() => handleRowClick(item)}
              sx={{
                px: 1,
                py: 0.5,
                my:1,
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
                  <Stack>
                    <Typography variant="subtitle2">{item?.name}</Typography>
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
                  {item?.nature &&
                    item.nature.length > 0 && (
                      <Stack>
                        <Typography variant="subtitle2">
                          {item.nature
                            .map(
                              (nature) =>
                                PRODUCT_TYPE_OPTIONS.find((option) => option.value == nature)
                                  ?.label
                            )
                            .join(', ')}
                        </Typography>
                      </Stack>
                    )}
                </Stack>

                <Stack />
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
          currentSetting={selectedRow}
        />
      )}
    </>
  );
}
