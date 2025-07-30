import { useMemo } from 'react';
import PropTypes from 'prop-types';

import { DataGrid } from '@mui/x-data-grid';

import { useTranslate } from 'src/locales';
import { useGetBorrowingReturnItems } from 'src/actions/store-management/borrowing-return';

import { EmptyContent } from 'src/components/empty-content';

import {
  RenderCellDate,
  RenderCellCode,
  RenderCellQuantity,
  RenderCellDesignation,
  RenderCellWorkshop,
  RenderCellObservationBorrowingReturnProduct
} from '../../table-rows';

const BorrowingReturnProductsList = ({ id }) => {
  const { t } = useTranslate('store-management-module');
  const { items, itemsLoading } = useGetBorrowingReturnItems(id);

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
        field: 'workshop',
        headerName: 'Atelier',
        flex: 1,
        minWidth: 100,
        renderCell: (params) => <RenderCellWorkshop params={params} />,
      }
    ,
    {
      field: 'observation',
      headerName: 'Observation',
      flex: 1,
      minWidth: 100,
      renderCell: (params) => <RenderCellObservationBorrowingReturnProduct params={params} />,
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

BorrowingReturnProductsList.propTypes = {
  id: PropTypes.number.isRequired,
};

export default BorrowingReturnProductsList; 