import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import InputAdornment from '@mui/material/InputAdornment';

import { fDate, fTime } from 'src/utils/format-time';

import { useGetHistory } from 'src/actions/history';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { EmptyContent } from 'src/components/empty-content';
import { SearchNotFound } from 'src/components/search-not-found';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = { category: false };

export function HistoryListDialog({ open, action, onClose, title = 'Address book', entity, id }) {
  const { history } = useGetHistory(id, entity);
  const [searchAddress, setSearchAddress] = useState('');

  const dataFiltered = applyFilter({ inputData: history, query: searchAddress });

  const notFound = !dataFiltered.length && !!searchAddress;

  const handleSearchAddress = useCallback((event) => {
    setSearchAddress(event.target.value);
  }, []);

  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 1,

      minWidth: 60,
      hideable: false,
      renderCell: (params) => (
        <Box>
          <Typography>{params.row.id}</Typography>
        </Box>
      ),
    },
    {
      field: 'fullname',
      headerName: 'Nom - Prénom',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => (
        <Box>
          <Typography>{params.row?.personal?.name}</Typography>
        </Box>
      ),
    },

    {
      field: 'amount',
      headerName: 'Montant',
      flex: 1,
      minWidth: 120,
      hideable: false,
      renderCell: (params) => (
        <Box>
          <Typography>{params.row?.data?.loan_amount}</Typography>
        </Box>
      ),
    },
    {
      field: 'start_date',
      headerName: 'Au',
      flex: 1,
      minWidth: 140,
      hideable: false,
      renderCell: (params) => (
        <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
          <span>{fDate(params.row?.data?.start_date)}</span>
        </Box>
      ),
    },
    {
      field: 'observation',
      headerName: 'Designation',
      flex: 1,
      minWidth: 200,
      hideable: false,
      renderCell: (params) => <Typography>{params.row?.data?.observation}</Typography>,
    },
    {
      field: 'status',
      headerName: 'Est comptabilé',
      flex: 1,
      minWidth: 250,
      hideable: false,
      renderCell: (params) => (
        <Label variant="soft" color={params.row?.data?.status === '1' ? 'primary' : 'default'}>
          {params.row?.data?.status === '1' ? 'Oui' : 'Non'}
        </Label>
      ),
    },
    {
      field: 'updated_by',
      headerName: 'Modifier par',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => (
        <Box>
          <Typography>{params.row?.user?.full_name}</Typography>
        </Box>
      ),
    },
    {
      field: 'updated_at',
      headerName: 'Date de modification',
      flex: 1,
      minWidth: 180,
      hideable: false,
      renderCell: (params) => (
        <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
          <span>{fDate(params.row?.updated_at)}</span>
          <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
            {fTime(params.row.updated_at)}
          </Box>
        </Box>
      ),
    },
  ];
  const productsLoading = false;

  const renderList = () => (
    <Scrollbar sx={{ p: 4, maxHeight: 480 }}>
      <DataGrid
        disableRowSelectionOnClick
        rows={dataFiltered}
        columns={columns}
        loading={productsLoading}
        getRowHeight={() => 'auto'}
        pageSizeOptions={[5, 10, 20, { value: -1, label: 'All' }]}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        columnVisibilityModel={columnVisibilityModel}
        onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
        slots={{
          noRowsOverlay: () => <EmptyContent />,
          noResultsOverlay: () => <EmptyContent title="No results found" />,
        }}
        sx={{
          [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' },
          '& .MuiDataGrid-columnHeader[data-field="actions"]': {
            position: 'sticky',
            right: 0,
            backgroundColor: (theme) => theme.palette.grey[200],
            zIndex: (theme) => theme.zIndex.appBar, // keep it above scrollbars
          },

          // Sticky actions column - Cell
          '& .MuiDataGrid-cell[data-field="actions"]': {
            position: 'sticky',
            right: 0,
            backgroundColor: (theme) => theme.palette.grey[200],
            zIndex: 1,
            borderLeft: (theme) => `1px solid ${theme.palette.divider}`,
          },
        }}
      />
    </Scrollbar>
  );

  return (
    <Dialog fullWidth maxWidth="lg" open={open} onClose={onClose}>
      <Box
        sx={{
          p: 3,
          pr: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6"> {title} </Typography>

        {action && action}
      </Box>

      <Stack sx={{ p: 2, pt: 0 }}>
        <TextField
          value={searchAddress}
          onChange={handleSearchAddress}
          placeholder="Search..."
          size="small"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            },
          }}
        />
      </Stack>

      {notFound ? (
        <SearchNotFound query={searchAddress} sx={{ px: 3, pt: 5, pb: 10 }} />
      ) : (
        renderList()
      )}
    </Dialog>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, query }) {
  if (!query) {
    return inputData;
  }

  return inputData.filter(({ personal, data }) => {
    const { name } = personal;
    return [name].some((field) => field?.toLowerCase().includes(query.toLowerCase()));
  });
}
