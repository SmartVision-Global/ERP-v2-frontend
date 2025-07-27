import { useState, useEffect, forwardRef, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import InputAdornment from '@mui/material/InputAdornment';
import { Tooltip, MenuItem, IconButton, ListItemIcon } from '@mui/material';

import { CONFIG } from 'src/global-config';
import {
  getFiltredDeductionsCompensations,
  useGetDeductionsCompensationsByContributoryImposable,
} from 'src/actions/deduction-conpensation';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { EmptyContent } from 'src/components/empty-content';
import { SearchNotFound } from 'src/components/search-not-found';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = { category: false };
const PAGE_SIZE = CONFIG.pagination.pageSize;
const TYPE = {
  1: 'Retenues',
  2: 'Indemnités',
};
const CONTRIBUTORY_IMPOSABLE = {
  1: 'COTISABLE - IMPOSABLE',
  2: 'NON COTISABLE - IMPOSABLE',

  3: 'NON COTISABLE - NON IMPOSABLE',
};

export function ProductListDialog({
  open,
  action,
  onClose,
  onSelect,
  title = 'Address book',
  type,
}) {
  const { deductionsCompensations, deductionsCompensationsLoading, deductionsCompensationsCount } =
    useGetDeductionsCompensationsByContributoryImposable(type);
  const [rowCount, setRowCount] = useState(deductionsCompensationsCount);
  const [tableData, setTableData] = useState(deductionsCompensations);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE,
  });
  const [searchAddress, setSearchAddress] = useState('');

  const dataFiltered = applyFilter({ inputData: deductionsCompensations, query: searchAddress });

  const notFound = !dataFiltered.length && !!searchAddress;

  const handleSearchAddress = useCallback((event) => {
    setSearchAddress(event.target.value);
  }, []);

  const handleSelectAddress = useCallback(
    (address) => {
      onSelect(address);
      setSearchAddress('');
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
          <Typography>{params.row?.code}</Typography>
        </Box>
      ),
    },

    {
      field: 'name',
      headerName: 'Référence',
      flex: 1,
      minWidth: 300,
      hideable: false,
      renderCell: (params) => (
        <Box>
          <Typography>{params.row?.name}</Typography>
        </Box>
      ),
    },
    {
      field: 'type',
      headerName: 'Type',
      flex: 1,
      minWidth: 95,
      hideable: false,
      renderCell: (params) => (
        <Label variant="soft" color="info">
          {TYPE[params.row.type]}
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
        <Label variant="soft" color={params.row.abs ? 'warning' : 'info'}>
          {params.row.abs ? 'Oui' : 'Non'}
        </Label>
      ),
    },
    {
      field: 'nature',
      headerName: 'Nature',
      flex: 1,
      minWidth: 250,
      hideable: false,
      renderCell: (params) => (
        <Label variant="soft" color="info">
          {CONTRIBUTORY_IMPOSABLE[params.row.contributory_imposable]}
        </Label>
      ),
    },
    {
      type: 'actions',
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      minWidth: 60,
      hideable: false,
      renderCell: (params) => (
        <Tooltip title="Ajouter">
          <IconButton onClick={() => handleSelectAddress(params.row)}>
            <Iconify icon="mingcute:add-line" />
          </IconButton>
        </Tooltip>
      ),
    },
    // {
    //   type: 'actions',
    //   field: 'actions',
    //   headerName: ' ',
    //   align: 'right',
    //   headerAlign: 'right',
    //   width: 80,
    //   sortable: false,
    //   filterable: false,
    //   disableColumnMenu: true,
    //   getActions: (params) => [
    //     <GridActionsLinkItem
    //       showInMenu
    //       icon={<Iconify icon="mingcute:add-line" />}
    //       label="Ajouter"
    //       onClick={() => handleSelectAddress(params.row)}
    //       // href={paths.dashboard.product.details(params.row.id)}
    //       // href={paths.dashboard.root}
    //     />,
    //   ],
    // },
  ];

  useEffect(() => {
    if (deductionsCompensations.length) {
      setTableData(deductionsCompensations);
      setRowCount(deductionsCompensationsCount);
    }
  }, [deductionsCompensations, deductionsCompensationsCount]);

  const handlePaginationModelChange = async (newModel) => {
    try {
      const newData = {
        contributory_imposable: type,
        limit: newModel.pageSize,
        offset: newModel.page * newModel.pageSize,
      };
      const response = await getFiltredDeductionsCompensations(newData);
      setTableData(response.data?.data?.records);
      setPaginationModel(newModel);
    } catch (error) {
      console.log('error in pagination search request', error);
    }
  };

  const renderList = () => (
    <Scrollbar sx={{ p: 4, maxHeight: 480 }}>
      <DataGrid
        disableRowSelectionOnClick
        disableColumnMenu
        rows={tableData}
        rowCount={rowCount}
        columns={columns}
        loading={deductionsCompensationsLoading}
        getRowHeight={() => 'auto'}
        paginationModel={paginationModel}
        paginationMode="server"
        onPaginationModelChange={(model) => handlePaginationModelChange(model)}
        pageSizeOptions={[PAGE_SIZE, 10, 20, { value: -1, label: 'All' }]}
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

  return inputData.filter(({ code, name }) =>
    [name, code].some((field) => field?.toLowerCase().includes(query.toLowerCase()))
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
