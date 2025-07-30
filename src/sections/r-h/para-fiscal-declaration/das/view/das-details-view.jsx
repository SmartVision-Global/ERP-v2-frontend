import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { LoadingButton } from '@mui/lab';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { TextField, FormControl, InputAdornment } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

import { showError } from 'src/utils/toast-error';

import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetDasDetails, getFiltredDasDetails, getDocumentsDasDetails } from 'src/actions/das';
import { DAS_DENOM_OPTIONS, DAS_YEAR_REF_OPTIONS, DAS_DECLARATION_TYPE_OPTIONS } from 'src/_mock';

import { Iconify } from 'src/components/iconify';
import { TableToolbarCustom } from 'src/components/table';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import {
  RenderCellJ1,
  RenderCellJ2,
  RenderCellJ3,
  RenderCellJ4,
  RenderCellTotal,
  RenderCellQ1Total,
  RenderCellW1Total,
  RenderCellW2Total,
  RenderCellW3Total,
  RenderCellW4Total,
  RenderCellYearRef,
  RenderCellQ2Total,
  RenderCellQ3Total,
  RenderCellQ4Total,
  RenderCellPersonalSSN,
  RenderCellPersonalName,
  RenderCellEmployeeNumber,
  RenderCellPersonalBirthDate,
  RenderCellPersonalEndService,
  RenderCellPersonalStartService,
} from '../details-table-row';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = { category: false };

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

const FILTERS_OPTIONS = [
  { id: 'id', type: 'input', label: 'N° Employeur', inputType: 'number' },
  {
    id: 'declaration_type',
    type: 'select',
    options: DAS_DECLARATION_TYPE_OPTIONS,
    label: 'Type de déclaration',
  },
  { id: 'year_ref', type: 'select', options: DAS_YEAR_REF_OPTIONS, label: 'Année Réf' },
  { id: 'bill_center', type: 'input', label: 'Centre Payeur' },
  { id: 'denomination', type: 'select', options: DAS_DENOM_OPTIONS, label: 'Dénomination' },
  {
    id: 'social_name',
    type: 'select',
    options: DAS_DENOM_OPTIONS,
    label: 'Nom ou Raison Sociale',
  },
];
const PAGE_SIZE = CONFIG.pagination.pageSize;

export function DasDetailsView() {
  const { id: enterprise_id = '', year = '' } = useParams();

  const { dasDetails, dasDetailsLoading, dasDetailsCount } = useGetDasDetails({
    limit: PAGE_SIZE,
    offset: 0,
    enterprise_id,
    year,
  });
  const [tableData, setTableData] = useState(dasDetails);
  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const [editedFilters, setEditedFilters] = useState({});
  const [isDownloading, setIsDownloading] = useState(false);

  const [rowCount, setRowCount] = useState(dasDetailsCount);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE,
  });
  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);

  useEffect(() => {
    if (dasDetails.length) {
      setTableData(dasDetails);
      setRowCount(dasDetailsCount);
    }
  }, [dasDetails, dasDetailsCount]);

  const handleReset = useCallback(async () => {
    try {
      const response = await getFiltredDasDetails({
        limit: PAGE_SIZE,
        offset: 0,
        enterprise_id,
        year,
      });
      setEditedFilters({});
      setPaginationModel({
        page: 0,
        pageSize: PAGE_SIZE,
      });
      setTableData(response.data?.data?.records);
      setRowCount(response.data?.data?.total);
    } catch (error) {
      console.log(error);
    }
  }, [enterprise_id, year]);

  const handleFilter = useCallback(
    async (data) => {
      try {
        const response = await getFiltredDasDetails({ ...data, enterprise_id, year });
        setTableData(response.data?.data?.records);
        setRowCount(response.data?.data?.total);
      } catch (error) {
        console.log('Error in search filters tasks', error);
      }
    },

    [enterprise_id, year]
  );
  const handlePaginationModelChange = async (newModel) => {
    try {
      const newData = {
        ...editedFilters,
        limit: newModel.pageSize,
        offset: newModel.page * newModel.pageSize,
        enterprise_id,
        year,
      };
      const response = await getFiltredDasDetails(newData);
      setTableData(response.data?.data?.records);
      setPaginationModel(newModel);
    } catch (error) {
      console.log('error in pagination search request', error);
    }
  };

  const handleDownloadDocuments = async (withDetails) => {
    setIsDownloading(true);
    try {
      const response = await getDocumentsDasDetails({
        enterprise_id,
        year,
        with_details: withDetails,
      });
      const blob = new Blob([response.data], {
        type: response.headers['content-type'],
      });
      // Extract filename from headers (optional but recommended)
      const contentDisposition = response.headers['content-disposition'];
      let fileName = 'downloaded-file';

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+)"?/);
        if (match?.[1]) {
          fileName = decodeURIComponent(match[1]);
        }
      }

      // Create a temporary download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      // Cleanup
      window.URL.revokeObjectURL(url);
      setIsDownloading(false);
    } catch (error) {
      setIsDownloading(false);

      console.error('Error downloading file:', error);
      showError(error);
      // alert('Failed to download file.');
    } finally {
      setIsDownloading(false);
    }
  };

  const columns = [
    { field: 'category', headerName: 'Category', filterable: false },
    {
      field: 'id',
      headerName: 'N° Employeur',
      flex: 0.5,
      minWidth: 120,
      hideable: false,
      renderCell: (params) => (
        // <RenderCellProduct params={params} href={paths.dashboard.product.details(params.row.id)} />
        <RenderCellEmployeeNumber params={params} href={paths.dashboard.root} />
      ),
    },

    {
      field: 'year_ref',
      headerName: 'Année Réf',
      width: 110,

      renderCell: (params) => <RenderCellYearRef params={params} />,
    },
    {
      field: 'personal_ssn',
      headerName: 'N° Immatriculation + Clé',
      minWidth: 140,

      renderCell: (params) => <RenderCellPersonalSSN params={params} />,
    },
    {
      field: 'personal_name',
      headerName: 'Nom-Prénom',
      minWidth: 120,

      renderCell: (params) => <RenderCellPersonalName params={params} />,
    },
    {
      field: 'personal_birth_date',
      headerName: 'Date de naissance',
      minWidth: 140,
      renderCell: (params) => <RenderCellPersonalBirthDate params={params} />,
    },
    {
      field: 'w1_total',
      headerName: 'Durée de travail Trimstre 1',
      minWidth: 200,

      renderCell: (params) => <RenderCellW1Total params={params} />,
    },
    {
      field: 'j1',
      headerName: 'Unité de mesure de la durée de travail Trimstre 1',
      minWidth: 110,

      renderCell: (params) => <RenderCellJ1 params={params} />,
    },
    {
      field: 'q1_total',
      headerName: 'Montant Total Trimstre 1',
      minWidth: 200,

      renderCell: (params) => <RenderCellQ1Total params={params} />,
    },

    {
      field: 'w2_total',
      headerName: 'Durée de travail Trimstre 2',
      minWidth: 200,

      renderCell: (params) => <RenderCellW2Total params={params} />,
    },
    {
      field: 'j2',
      headerName: 'Unité de mesure de la durée de travail Trimstre 2',
      minWidth: 110,

      renderCell: (params) => <RenderCellJ2 params={params} />,
    },

    {
      field: 'q2_total',
      headerName: 'Montant Total Trimstre 2',
      minWidth: 200,

      renderCell: (params) => <RenderCellQ2Total params={params} />,
    },
    {
      field: 'w3_total',
      headerName: 'Durée de travail Trimstre 3',
      minWidth: 200,

      renderCell: (params) => <RenderCellW3Total params={params} />,
    },
    {
      field: 'j3',
      headerName: 'Unité de mesure de la durée de travail Trimstre 3',
      minWidth: 110,

      renderCell: (params) => <RenderCellJ3 params={params} />,
    },
    {
      field: 'q3_total',
      headerName: 'Montant Total Trimstre 3',
      minWidth: 200,
      renderCell: (params) => <RenderCellQ3Total params={params} />,
    },
    {
      field: 'w4_total',
      headerName: 'Durée de travail Trimstre 4',
      minWidth: 200,

      renderCell: (params) => <RenderCellW4Total params={params} />,
    },
    {
      field: 'j4',
      headerName: 'Unité de mesure de la durée de travail Trimstre 4',
      minWidth: 110,

      renderCell: (params) => <RenderCellJ4 params={params} />,
    },
    {
      field: 'q4_total',
      headerName: 'Montant Total Trimstre 4',
      minWidth: 210,

      renderCell: (params) => <RenderCellQ4Total params={params} />,
    },

    {
      field: 'total',
      headerName: 'Total Annuel des Salaires',
      minWidth: 200,
      renderCell: (params) => <RenderCellTotal params={params} />,
    },
    {
      field: 'service_start',
      headerName: 'Date Entrée',
      minWidth: 120,

      renderCell: (params) => <RenderCellPersonalStartService params={params} />,
    },
    {
      field: 'service_end',
      headerName: 'Date Sortie',
      minWidth: 120,

      renderCell: (params) => <RenderCellPersonalEndService params={params} />,
    },
  ];

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  return (
    <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <CustomBreadcrumbs
        heading="List"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Ressources humaine', href: paths.dashboard.root },
          { name: 'Das' },
          { name: dasDetails?.length ? dasDetails[0]?.enterprise_name : '-' },
          { name: year },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card
        sx={{
          flexGrow: { md: 1 },
          display: { md: 'flex' },
          flexDirection: { md: 'column' },
        }}
      >
        <TableToolbarCustom
          filterOptions={FILTERS_OPTIONS}
          filters={editedFilters}
          setFilters={setEditedFilters}
          onReset={handleReset}
          handleFilter={handleFilter}
          setPaginationModel={setPaginationModel}
          paginationModel={paginationModel}
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'end',
            flexDirection: 'row',
            gap: 1,
            mr: 2,
          }}
        >
          <LoadingButton
            startIcon={<Iconify icon="eva:download-fill" />}
            loading={isDownloading}
            color="secondary"
            variant="outlined"
            onClick={() => handleDownloadDocuments(0)}
          >
            Télécharger
          </LoadingButton>
          <LoadingButton
            startIcon={<Iconify icon="eva:download-fill" />}
            loading={isDownloading}
            color="secondary"
            variant="outlined"
            onClick={() => handleDownloadDocuments(1)}
          >
            Télécharger avec details
          </LoadingButton>
        </Box>
        <Box paddingX={4} paddingY={2} sx={{}}>
          <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 0.5 } }} size="small">
            <TextField
              fullWidth
              // value={currentFilters.name}
              // onChange={handleFilterName}
              placeholder="Search "
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                },
              }}
              size="small"
            />
          </FormControl>
        </Box>

        <DataGrid
          disableRowSelectionOnClick
          disableColumnMenu
          disableColumnSorting
          rows={tableData}
          rowCount={rowCount}
          columns={columns}
          loading={dasDetailsLoading}
          getRowId={(row) => row.personal_ssn}
          getRowHeight={() => 'auto'}
          paginationModel={paginationModel}
          paginationMode="server"
          onPaginationModelChange={(model) => handlePaginationModelChange(model)}
          pageSizeOptions={[2, 10, 20, { value: -1, label: 'All' }]}
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
          slots={{
            noRowsOverlay: () => <EmptyContent />,
            noResultsOverlay: () => <EmptyContent title="No results found" />,
          }}
          slotProps={{
            toolbar: { setFilterButtonEl },
            panel: { anchorEl: filterButtonEl },
            columnsManagement: { getTogglableColumns },
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
      </Card>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
