import { useState, forwardRef, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { MenuItem, ListItemIcon } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import InputAdornment from '@mui/material/InputAdornment';

import { useGetDeductionsCompensationsByContributoryImposable } from 'src/actions/deduction-conpensation';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { EmptyContent } from 'src/components/empty-content';
import { SearchNotFound } from 'src/components/search-not-found';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = { category: false };

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];
export function ProductListDialog({
  list,
  open,
  action,
  onClose,
  selected,
  onSelect,
  title = 'Address book',
  type,
}) {
  const { deductionsCompensations } = useGetDeductionsCompensationsByContributoryImposable(type);
  const [searchAddress, setSearchAddress] = useState('');
  const [selectedRowIds, setSelectedRowIds] = useState([]);

  const dataFiltered = applyFilter({ inputData: list, query: searchAddress });

  const notFound = !dataFiltered.length && !!searchAddress;

  const handleSearchAddress = useCallback((event) => {
    setSearchAddress(event.target.value);
  }, []);

  const handleSelectAddress = useCallback(
    (address) => {
      console.log('address', address);
      onSelect(address);
      setSearchAddress('');
      //   onClose();
    },
    [onSelect]
  );
  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);

  const columns = [
    // { field: 'category', headerName: 'Category', filterable: false },
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
      field: 'code',
      headerName: 'Code',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => (
        <Box>
          <Typography>{params.row.id}</Typography>
        </Box>
      ),
    },

    {
      field: 'ref',
      headerName: 'Référence',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => (
        <Box>
          <Typography>{params.row.ref}</Typography>
        </Box>
      ),
    },
    {
      field: 'type',
      headerName: 'Type',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => (
        <Label variant="soft" color="info">
          {params.row.type}
        </Label>
      ),
    },
    {
      field: 'abs',
      headerName: 'Soumis aux absence',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => (
        <Label variant="soft" color="info">
          {params.row.abs}
        </Label>
      ),
    },
    {
      field: 'nature',
      headerName: 'Nature',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => (
        <Label variant="soft" color="info">
          {params.row.nature}
        </Label>
      ),
    },
    {
      type: 'actions',
      field: 'actions',
      headerName: ' ',
      align: 'right',
      headerAlign: 'right',
      width: 80,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      getActions: (params) => [
        <GridActionsLinkItem
          showInMenu
          icon={<Iconify icon="mingcute:add-line" />}
          label="Ajouter"
          onClick={() => handleSelectAddress(params.row)}
          // href={paths.dashboard.product.details(params.row.id)}
          // href={paths.dashboard.root}
        />,
      ],
    },
  ];
  const productsLoading = false;

  const renderList = () => (
    <Scrollbar sx={{ p: 1, maxHeight: 480 }}>
      <DataGrid
        // checkboxSelection
        disableRowSelectionOnClick
        rows={dataFiltered}
        columns={columns}
        loading={productsLoading}
        getRowHeight={() => 'auto'}
        pageSizeOptions={[5, 10, 20, { value: -1, label: 'All' }]}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        // onRowSelectionModelChange={(newSelectionModel) => setSelectedRowIds(newSelectionModel)}
        columnVisibilityModel={columnVisibilityModel}
        onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
        // disableColumnFilter
        slots={{
          // toolbar: CustomToolbarCallback,
          noRowsOverlay: () => <EmptyContent />,
          noResultsOverlay: () => <EmptyContent title="No results found" />,
        }}
        //   slotProps={{
        //     toolbar: { setFilterButtonEl },
        //     panel: { anchorEl: filterButtonEl },
        //     columnsManagement: { getTogglableColumns },
        //   }}
        sx={{ [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' } }}
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

  return inputData.filter(({ name, company, fullAddress, phoneNumber }) =>
    [name, company, fullAddress, phoneNumber].some((field) =>
      field?.toLowerCase().includes(query.toLowerCase())
    )
  );
}

export const GridActionsLinkItem = forwardRef((props, ref) => {
  const { label, icon, onClick, sx } = props;

  return (
    <MenuItem ref={ref} sx={sx} onClick={onClick}>
      {icon && <ListItemIcon>{icon}</ListItemIcon>}
      <Typography variant="body2">{label}</Typography>
      {/* <Link
          underline="none"
          color="inherit"
          sx={{ width: 1, display: 'flex', alignItems: 'center' }}
        >
          {icon && <ListItemIcon>{icon}</ListItemIcon>}
          {label}
        </Link> */}
    </MenuItem>
  );
});
