/* eslint-disable */

import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { DataGrid, GridActionsCellItem, gridClasses } from '@mui/x-data-grid';
import {
  FormControl,
  TextField,
  InputAdornment,
  Typography,
  Modal,
  styled,
} from '@mui/material';

import { CONFIG } from 'src/global-config';
import { useGetRequestPurchasesItems, getFiltredAllRequestPurchaseItems } from 'src/actions/purchase-supply/purchase-order/order';

import { Iconify } from 'src/components/iconify';
import { TableToolbarCustom } from 'src/components/table';
import { EmptyContent } from 'src/components/empty-content';
import { useTranslate } from 'src/locales';

import {
    RenderCellId,
    RenderCellCreatedAt,
    RenderCellPurchaseRequestCode,
    RenderCellPurchaseRequestType,
    RenderCellPurchaseRequestStatus,
    RenderCellProductCode,
    RenderCellProductSupplierCode,
    RenderCellDateNeeded,
    RenderCellObservations,
    RenderCellPurchaseRequestPriority,
    RenderCellConfirmationDate,
    RenderCellNotImplemented,
} from 'src/sections/purchase_supply/table-rows';

// ----------------------------------------------------------------------

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  // Pin the actions column to the right
  '& .MuiDataGrid-columnHeader[data-field="actions"]': {
    position: 'sticky',
    right: 0,
    backgroundColor: theme.palette.grey[200],
    zIndex: theme.zIndex.appBar,
  },
  '& .MuiDataGrid-cell[data-field="actions"]': {
    position: 'sticky',
    right: 0,
    backgroundColor: theme.palette.grey[200],
    zIndex: 1,
    borderLeft: `1px solid ${theme.palette.divider}`,
  },
}));

const PAGE_SIZE = CONFIG.pagination.pageSize;

export default function PurchaseRequestListView({ onSelectProduct }) {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: PAGE_SIZE,
  });
  const [previewImage, setPreviewImage] = useState(null);

  const { t } = useTranslate('purchase-supply-module');
  const { items, itemsLoading, itemsCount } = useGetRequestPurchasesItems({
    limit: paginationModel.pageSize,
    offset: 0,
  });

  const [tableData, setTableData] = useState([]);
  const [rowCount, setRowCount] = useState(0);

  useEffect(() => {
    setTableData(items);
    setRowCount(itemsCount);
  }, [items, itemsCount]);

  const columns = useMemo(() => [
    { field: 'id', headerName: t('headers.id'), width: 70, renderCell: (params) => <RenderCellId params={params} />},
    { field: 'purchase_request.code', headerName: t('headers.code'), flex: 1, minWidth: 150, renderCell: (params) => <RenderCellPurchaseRequestCode params={params} />},
    { field: 'type', headerName: t('headers.type'), flex: 1, minWidth: 150, renderCell: (params) => <RenderCellPurchaseRequestType params={params} />},
    { field: 'created_at', headerName: t('headers.created_at'), flex: 1, minWidth: 150, renderCell: (params) => <RenderCellCreatedAt params={params} />},
    { field: 'status', headerName: t('headers.status'), flex: 1, minWidth: 150, renderCell: (params) => <RenderCellPurchaseRequestStatus params={params} />},
    {
        field: 'product.image',
        headerName: t('headers.image'),
        width: 80,
        renderCell: (params) => {
          const src = params.row.product?.image;
          return src ? (
            <img
              src={src}
              alt="product"
              style={{ width: 40, height: 40, cursor: 'pointer' }}
              onClick={() => setPreviewImage(src)}
            />
          ) : (
            t('messages.no_image')
          );
        },
    },
    { field: 'product.code', headerName: t('headers.product_code'), flex: 1, minWidth: 150, renderCell: (params) => <RenderCellProductCode params={params} />},
    { field: 'product.supplier_code', headerName: t('headers.supplier_code'), flex: 1, minWidth: 150, renderCell: (params) => <RenderCellProductSupplierCode params={params} />},
    { field: 'local_code', headerName: t('headers.local_code'), flex: 1, minWidth: 150, renderCell: (params) => <RenderCellNotImplemented />},
    { field: 'designation', headerName: t('headers.designation'), flex: 1, minWidth: 150, renderCell: (params) => <RenderCellNotImplemented />},
    { field: 'purchased_quantity', headerName: t('headers.requested_quantity'), flex: 1, minWidth: 150, renderCell: (params) => <RenderCellNotImplemented />},
    { field: 'ordered_quantity', headerName: t('headers.ordered_quantity'), flex: 1, minWidth: 150, renderCell: (params) => <RenderCellNotImplemented />},
    { field: 'remaining_quantity', headerName: t('headers.remaining_quantity'), flex: 1, minWidth: 150, renderCell: (params) => <RenderCellNotImplemented />},
    { field: 'date_needed', headerName: t('headers.date_needed'), flex: 1, minWidth: 150, renderCell: (params) => <RenderCellDateNeeded params={params} />},
    { field: 'unit_measure', headerName: t('headers.unit_measure'), flex: 1, minWidth: 150, renderCell: (params) => <RenderCellNotImplemented />},
    { field: 'family', headerName: t('headers.family'), flex: 1, minWidth: 150, renderCell: (params) => <RenderCellNotImplemented />},
    { field: 'sub_family', headerName: t('headers.sub_family'), flex: 1, minWidth: 150, renderCell: (params) => <RenderCellNotImplemented />},
    { field: 'category', headerName: t('headers.category'), flex: 1, minWidth: 150, renderCell: (params) => <RenderCellNotImplemented />},
    { field: 'observation', headerName: t('headers.observation'), flex: 1, minWidth: 150, renderCell: (params) => <RenderCellObservations params={params} />},
    { field: 'priority', headerName: t('headers.priority'), flex: 1, minWidth: 150, renderCell: (params) => <RenderCellPurchaseRequestPriority params={params} />},
    { field: 'created_by', headerName: t('headers.created_by'), flex: 1, minWidth: 150, renderCell: (params) => <RenderCellNotImplemented />},
    { field: 'confirmed_by', headerName: t('headers.confirmed_by'), flex: 1, minWidth: 150, renderCell: (params) => <RenderCellNotImplemented />},
    { field: 'confirmation_date', headerName: t('headers.confirmation_date'), flex: 1, minWidth: 150, renderCell: (params) => <RenderCellConfirmationDate params={params} />},
    { field: 'confirmation_notes', headerName: t('headers.confirmation_notes'), flex: 1, minWidth: 150, renderCell: (params) => <RenderCellNotImplemented />},
    { field: 'treated_by', headerName: t('headers.treated_by'), flex: 1, minWidth: 150, renderCell: (params) => <RenderCellNotImplemented />},
    { field: 'date_of_treatment', headerName: t('headers.date_of_treatment'), flex: 1, minWidth: 150, renderCell: (params) => <RenderCellNotImplemented />},
    { field: 'site', headerName: t('headers.site'), flex: 1, minWidth: 150, renderCell: (params) => <RenderCellNotImplemented />},
    {
      field: 'actions', type: 'actions', headerName: 'Actions', width: 80,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Iconify icon="eva:plus-fill" />}
          label={t('form.actions.add')}
          onClick={() => onSelectProduct(params.row)}
          color="primary"
        />
      ],
    },
  ], [t, onSelectProduct]);


  const [filterButtonEl, setFilterButtonEl] = useState(null);
  const [editedFilters, setEditedFilters] = useState({});

  const handleReset = useCallback(async () => {
    try {
      const response = await getFiltredAllRequestPurchaseItems({
        limit: PAGE_SIZE,
        offset: 0,
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
  }, []);

  const handleFilter = useCallback(async (data) => {
    try {
      const response = await getFiltredAllRequestPurchaseItems(data);
      setTableData(response.data?.data?.records);
      setRowCount(response.data?.data?.total);
    } catch (error) {
      console.log('Error in search filters tasks', error);
    }
  }, []);

  const handlePaginationModelChange = async (newModel) => {
    try {
      const newData = {
        ...editedFilters,
        limit: newModel.pageSize,
        offset: newModel.page * newModel.pageSize,
      };
      const response = await getFiltredAllRequestPurchaseItems(newData);
      setTableData(response.data?.data?.records);
      setPaginationModel(newModel);
    } catch (error)      {
      console.log('error in pagination search request', error);
    }
  };

  const FILTERS_OPTIONS = useMemo(() => [
    { id: 'product.code', type: 'input', label: t('filters.code') },
    { id: 'product.supplier_code', type: 'input', label: t('filters.supplier_code') },
    { id: 'product.builder_code', type: 'input', label: t('filters.builder_code') },
    { id: 'product.designation', type: 'input', label: t('filters.designation') },
  ], [t]);


  return (
    <Card
      sx={{
        flexGrow: { md: 1 },
        display: { md: 'flex' },
        flexDirection: { md: 'column' },
        height: '100%'
      }}
    >
        <Modal open={!!previewImage} onClose={() => setPreviewImage(null)}>
            <Box
            sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'background.paper',
                p: 1,
            }}
            >
            <img src={previewImage} alt="product preview" style={{ maxWidth: '90vw', maxHeight: '90vh' }} />
            </Box>
      </Modal>
      <TableToolbarCustom
        filterOptions={FILTERS_OPTIONS}
        filters={editedFilters}
        setFilters={setEditedFilters}
        onReset={handleReset}
        handleFilter={handleFilter}
        setPaginationModel={setPaginationModel}
        paginationModel={paginationModel}
      />
      <StyledDataGrid
        disableRowSelectionOnClick
        disableColumnMenu
        rows={tableData}
        rowCount={rowCount}
        columns={columns}
        loading={itemsLoading}
        getRowHeight={() => 'auto'}
        paginationModel={paginationModel}
        paginationMode="server"
        onPaginationModelChange={(model) => handlePaginationModelChange(model)}
        pageSizeOptions={[10, 20, 50]}
        slots={{
          noRowsOverlay: () => <EmptyContent />,
          noResultsOverlay: () => <EmptyContent title={t('messages.no_results')} />,
        }}
        slotProps={{
          toolbar: { setFilterButtonEl },
          panel: { anchorEl: filterButtonEl },
        }}
        sx={{ [`& .${gridClasses.cell}`]: { py: 1, alignItems: 'center', display: 'inline-flex' } }}
      />
    </Card>
  );
} 