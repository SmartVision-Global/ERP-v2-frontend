import { useMemo } from 'react';
import PropTypes from 'prop-types';

import { DataGrid } from '@mui/x-data-grid';

import { useTranslate } from 'src/locales';
import { useGetBorrowingItems } from 'src/actions/store-management/borrowing';

import { EmptyContent } from 'src/components/empty-content';

import {
  RenderCellDate,
  RenderCellCode,
  RenderCellQuantity,
  RenderCellSupplierCode,
  RenderCellLocalCode,
  RenderCellDesignation
} from '../../table-rows';

const BorrowingProductsList = ({ id }) => {
  const { t } = useTranslate('store-management-module');
  console.log('hi habibbi', id)
  const { items, itemsLoading } = useGetBorrowingItems(id);

  const columns = useMemo(
    () => [
      {
        field: 'id',
        headerName: '#',
        flex: 1,
        minWidth: 50,
      },
      {
        field: 'code',
        headerName: 'Code',
        flex: 1,
        minWidth: 100,
        renderCell: (params) => <RenderCellCode params={params} />,
      },
      {
        field: 'supplier_code',
        headerName: 'Code fournisseur',
        flex: 1,
        minWidth: 120,
        renderCell: (params) => <RenderCellSupplierCode params={params} />,
      },
      {
        field: 'local_code',
        headerName: 'Code local',
        flex: 1,
        minWidth: 120,
        renderCell: (params) => <RenderCellLocalCode params={params} />,
      },
      {
        field: 'designation',
        headerName: 'Désignation',
        flex: 1,
        minWidth: 150,
        renderCell: (params) => <RenderCellDesignation params={params} />,
      },
      {
        field: 'lot',
        headerName: 'Lot',
        flex: 1,
        minWidth: 100,
      },
      {
        field: 'qte',
        headerName: 'Qté',
        flex: 1,
        minWidth: 80,
        renderCell: (params) => <RenderCellQuantity params={params} />,
      },
      {
        field: 'returned_qte',
        headerName: 'Qté retourné',
        flex: 1,
        minWidth: 100,
      },
      {
        field: 'current_qte',
        headerName: 'Qté actuelle (magasin)',
        flex: 1,
        minWidth: 100,
      },
      {
        field: 'updated_at',
        headerName: 'Date mise à jour',
        flex: 1,
        minWidth: 150,
        renderCell: (params) => <RenderCellDate params={params} />,
      },
    ],
    [t]
  );

  if (itemsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <DataGrid
      rows={items || []}
      columns={columns}
      loading={itemsLoading}
      getRowHeight={() => 'auto'}
      slots={{
        noRowsOverlay: () => <EmptyContent />,
        noResultsOverlay: () => <EmptyContent title={t('messages.no_results')} />,
      }}
    />
  );
};

BorrowingProductsList.propTypes = {
  id: PropTypes.number.isRequired,
};

export default BorrowingProductsList; 