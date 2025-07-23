import { useState, forwardRef, useCallback } from 'react';
/* eslint-disable*/
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import InputAdornment from '@mui/material/InputAdornment';
import { Tooltip, MenuItem, IconButton, ListItemIcon, Chip } from '@mui/material';

// Import your BEB data hook (you'll need to create this)
import { useGetBebs } from 'src/actions/expression-of-needs/beb/beb';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { EmptyContent } from 'src/components/empty-content';
import { SearchNotFound } from 'src/components/search-not-found';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = { category: false };

// Removed sample static data; switching to API-driven BEB list

export function BEBListDialog({
  open,
  action,
  onClose,
  selected,
  onSelect,
  title = 'Sélection BEB',
  type,
}) {
  const { bebs: bebItems, bebsLoading: bebItemsLoading } = useGetBebs({ limit: 1000, offset: 0 });
  console.log('bebItems',bebItems);
  const [searchBEB, setSearchBEB] = useState('');
  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);

  const dataFiltered = applyFilter({ inputData: bebItems, query: searchBEB });
  const notFound = !dataFiltered.length && !!searchBEB;

  const handleSearchBEB = useCallback((event) => {
    setSearchBEB(event.target.value);
  }, []);

  const handleSelectBEB = useCallback(
    (bebItem) => {
      onSelect(bebItem);
      setSearchBEB('');
    },
    [onSelect]
  );

  // Status configuration
  const STATUS_CONFIG = {
    pending: { label: 'En attente', color: 'warning' },
    approved: { label: 'Approuvé', color: 'success' },
    rejected: { label: 'Rejeté', color: 'error' },
    draft: { label: 'Brouillon', color: 'default' },
  };

  // Priority configuration
  const PRIORITY_CONFIG = {
    high: { label: 'Haute', color: 'error' },
    medium: { label: 'Moyenne', color: 'warning' },
    low: { label: 'Basse', color: 'info' },
  };

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 1,
      minWidth: 100,
      hideable: false,
    },
    {
      field: 'requested_date',
      headerName: 'Date',
      flex: 1,
      minWidth: 120,
      hideable: false,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2">
            {new Date(params.row.requested_date).toLocaleDateString('fr-FR')}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'code',
      headerName: 'Code',
      flex: 1,
      minWidth: 120,
      hideable: false,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" fontWeight="medium">
            {params.row?.code}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'created_by',
      headerName: 'Demandeur',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2">{params.row?.created_by?.full_name}</Typography>
        </Box>
      ),
    },
    {
      field: 'service',
      headerName: 'Service',
      flex: 1,
      minWidth: 200,
      hideable: false,
      renderCell: (params) => (
        <Box>
          {params.row?.service?.name && (
            <Chip label={params.row?.service?.name} size="small" variant="outlined" color="primary" />
          )}
        </Box>
      ),
    },
    {
      field: 'site',
      headerName: 'Site',
      flex: 1,
      minWidth: 120,
      hideable: false,
      renderCell: (params) => (
        <Box>
          <Chip label={params.row?.site?.name} size="small" variant="outlined" color="primary" />
        </Box>
      ),
    },
    {
      field: 'observation',
      headerName: 'Observation',
      flex: 2,
      minWidth: 200,
      hideable: false,
      renderCell: (params) => (
        <Box>
          <Typography
            variant="body2"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            title={params.row?.observation}
          >
            {params.row?.observation}
          </Typography>
        </Box>
      ),
    },
    
    
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      minWidth: 100,
      hideable: false,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Sélectionner ce BEB">
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleSelectBEB(params.row)}
              disabled={params.row.status === 'rejected'}
            >
              <Iconify icon="mingcute:add-line" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Voir détails">
            <IconButton
              size="small"
              color="info"
              onClick={() => console.log('View details:', params.row)}
            >
              <Iconify icon="mdi:eye" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  const renderList = () => (
    <Scrollbar sx={{ p: 3, maxHeight: 500 }}>
      <DataGrid
        disableColumnSorting
        disableRowSelectionOnClick
        disableColumnMenu
        rows={dataFiltered}
        columns={columns}
        loading={bebItemsLoading}
        getRowHeight={() => 'auto'}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10, 20, { value: -1, label: 'Tout' }]}
        columnVisibilityModel={columnVisibilityModel}
        onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
        slots={{
          noRowsOverlay: () => (
            <EmptyContent
              title="Aucun BEB disponible"
              description="Il n'y a pas de BEB à afficher pour le moment"
            />
          ),
          noResultsOverlay: () => (
            <EmptyContent
              title="Aucun résultat trouvé"
              description="Essayez de modifier vos critères de recherche"
            />
          ),
        }}
        sx={{
          [`& .${gridClasses.cell}`]: {
            alignItems: 'center',
            display: 'inline-flex',
            py: 1,
          },
          [`& .${gridClasses.row}`]: {
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          },
        }}
      />
    </Scrollbar>
  );

  const renderHeader = () => (
    <Box
      sx={{
        p: 3,
        pr: 1.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Box>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body2" color="text.secondary">
          Sélectionnez un BEB dans la liste ci-dessous
        </Typography>
      </Box>
      {action && action}
    </Box>
  );

  const renderSearch = () => (
    <Stack sx={{ p: 3, pt: 2 }}>
      <TextField
        value={searchBEB}
        onChange={handleSearchBEB}
        placeholder="Rechercher par code, demandeur, service ou observation..."
        size="small"
        fullWidth
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

      {/* Filter Summary */}
      {dataFiltered.length > 0 && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
          {dataFiltered.length} BEB trouvé{dataFiltered.length > 1 ? 's' : ''}
          {searchBEB && ` pour "${searchBEB}"`}
        </Typography>
      )}
    </Stack>
  );

  return (
    <Dialog
      fullWidth
      maxWidth="xl"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { height: '80vh' },
      }}
    >
      {renderHeader()}
      {renderSearch()}

      {notFound ? (
        <SearchNotFound
          query={searchBEB}
          sx={{ px: 3, pt: 5, pb: 10 }}
          title="Aucun BEB trouvé"
          description="Aucun BEB ne correspond à votre recherche"
        />
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

  return inputData.filter((item) =>
    [item.code, item.applicant, item.service, item.observation].some((field) =>
      field?.toLowerCase().includes(query.toLowerCase())
    )
  );
}

// Custom GridActionsLinkItem component (from your original code)
export const GridActionsLinkItem = forwardRef((props, ref) => {
  const { label, icon, onClick, sx } = props;

  return (
    <MenuItem ref={ref} sx={sx} onClick={onClick}>
      {icon && <ListItemIcon>{icon}</ListItemIcon>}
      <Typography variant="body2">{label}</Typography>
    </MenuItem>
  );
});
