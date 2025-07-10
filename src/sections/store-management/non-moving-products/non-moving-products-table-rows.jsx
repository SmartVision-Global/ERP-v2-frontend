import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { fDate, fTime } from 'src/utils/format-time';

import {  THIRD_TYPE_OPTIONS, BORROWING_NATURE_OPTIONS, BORROWING_TYPE_OPTIONS, BORROWING_STATUS_OPTIONS, BORROWING_RETURN_STATUS_OPTIONS, BORROWING_RETURN_TYPE_OPTIONS, NON_MOVING_PRODUCTS_STATUS_OPTIONS } from 'src/_mock/stores/raw-materials/data';

import { Label } from 'src/components/label';
// Custom cell renderers for StockListView
export function RenderCellId({ params }) {
  return <Typography>{params.row.id}</Typography>;
}

export function RenderCellCode({ params }) {
  return <Typography>{params.row.code ?? 'N/I'}</Typography>;
}


export function RenderCellBuilderCode({ params }) {
  return <Typography>{params.row.builder_code}</Typography>;
}

export function RenderCellDesignation({ params }) {
  return <Typography>{params.row.designation ?? 'N/I'}</Typography>;
}

export function RenderCellQuantity({ params }) {
  return <Typography>{params.row.quantity}</Typography>;
}

export function RenderCellStatus({ params }) {
  const status = NON_MOVING_PRODUCTS_STATUS_OPTIONS.find(option => option.value == params.row.status);
  const color = status?.color ?? 'default';
  const label = status?.label ?? 'N/I';
  return <Label variant="soft" color={color}>{label}</Label>;
}

export function RenderCellType({ params }) {
  const type = THIRD_TYPE_OPTIONS.find(option => option.value == params.row.type);
  const color = type?.color ?? 'default';
  const label = type?.label ?? 'N/I';
  return <Label variant="soft" color={color}>{label}</Label>;
}

export function RenderCellAlert({ params }) {
  return <Typography>{params.row.alert}</Typography>;
}

export function RenderCellMin({ params }) {
  return <Typography>{params.row.min}</Typography>;
}

export function RenderCellConsumption({ params }) {
  return <Typography>{params.row.consumption}</Typography>;
}

export function RenderCellUnknown2() {
  return <Typography>N/I</Typography>;
}

export function RenderCellFamily({ params }) {
  return <Typography>{params.row.family?.name ?? 'N/I'}</Typography>;
}

export function RenderCellSubFamily({ params }) {
  return <Typography>{params.row.sub_family?.name ?? 'N/I'}</Typography>;
}

export function RenderCellCategory({ params }) {
  return <Typography>{params.row.category?.name ?? 'N/I'}</Typography>;
}

export function RenderCellLocation({ params }) {
  const arr = params.row.product_storage;
  const locations = Array.isArray(arr) && arr.length
    ? arr.map(item => item.location).filter(Boolean).join(', ')
    : 'N/I';
  return <Typography>{locations}</Typography>;
}


export function RenderCellDate({ params }) {
  return (
    <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
      <span>{fDate(params.row.datetime)}</span>
      <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
        {fTime(params.row.datetime)}
      </Box>
    </Box>
  );
}

export function RenderCellOperation({ params }) {
  const nature = BORROWING_NATURE_OPTIONS.find(option => option.value == params.row.nature);
  const color = nature?.color ?? 'default';
  return  <Label variant="soft" color={color}>{params.row.nature}</Label>
}

export function RenderCellProduct({ params }) {
  return <Typography>{params.row.product_code ?? 'N/I'}</Typography>;
}

export function RenderCellSupplierCode({ params }) {
  return <Typography>{params.row.supplier_code ?? 'N/I'}</Typography>;
}


export function RenderCellLocalCode({ params }) {
  return <Typography>{params.row.builder_code ?? 'N/I'}</Typography>;
}

export function RenderCellSource({ params }) {
  return <Typography>{params.row.store?.name?? 'N/I'}</Typography>;
}

export function RenderCellSourceStore({ params }) {
  return <Typography>{params.row.source_store?.code?? 'N/I'}</Typography>;
}

export function RenderCellExitQuantity({ params }) {
  return <Typography>{params.row.destination_quantity?? 'N/I'}</Typography>;
}

export function RenderCellDestination({ params }) {
  return <Typography>{params.row.destination_store?.code?? 'N/I'}</Typography>;
}

export function RenderCellCreatedDate({ params }) {
  return (
      <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
        <span>{fDate(params.row.created_date)}</span>
        <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
          {fTime(params.row.created_date)}
        </Box>
      </Box>
    );
}

export function RenderCellObservation({ params }) {
  return <Typography>{params.row.observation ?? 'N/I'}</Typography>;
}

export function RenderCellTiers({ params }) {
  return <Typography>{params.row.tier?.code ?? 'N/I'}</Typography>;
}

export function RenderCellLot({ params }) {
  return <Typography>{params.row.lot ?? 'N/I'}</Typography>;
}



export function RenderCellNature({ params }) {
  const nature = BORROWING_NATURE_OPTIONS.find(option => option.value == params.row.nature);
  const color = nature?.color ?? 'default';
  const label = nature?.label ?? 'N/I';
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <Label
        variant="soft"
        color={color}
        sx={{
          height: 'auto',
          lineHeight: '1.5',
          whiteSpace: 'normal',
          padding: '4px 8px',
        }}
      >
        {label}
      </Label>
    </Box>
  );
}


export function RenderCellTypeBorrowing({ params }) {
  const type = BORROWING_TYPE_OPTIONS.find(option => option.value == params.row.type);
  const color = type?.color ?? 'default';
  const label = type?.label ?? 'N/I';
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <Label variant="soft" color={color}>{label}</Label>
    </Box>
  );
}

export function RenderCellTypeBorrowingReturn({ params }) {
  const type = BORROWING_RETURN_TYPE_OPTIONS.find(option => option.value == params.row.type);
  const color = type?.color ?? 'default';
  const label = type?.label ?? 'N/I';
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <Label variant="soft" color={color}>{label}</Label>
    </Box>
  );
}


export function RenderCellStatusBorrowing({ params }) {
  const status = BORROWING_STATUS_OPTIONS.find(option => option.value == params.row.status);
  const color = status?.color ?? 'default';
  const label = status?.label ?? 'N/I';
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <Label variant="soft" color={color}>{label}</Label>
    </Box>
  );
}

export function RenderCellReturnStatusBorrowing({ params }) {
  const status = BORROWING_RETURN_STATUS_OPTIONS.find(option => option.value == params.row.return_status);
  const color = status?.color ?? 'default';
  const label = status?.label ?? 'N/I';
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <Label variant="soft" color={color}>{label}</Label>
    </Box>
  );
}

export function RenderCellLoanBorrowing({ params }) {
  return <Typography>{params.row.borrowing?.code ?? 'N/I'}</Typography>;
}

export function RenderCellWorkshop({ params }) {
  return <Typography>{params.row.workshop?.name ?? 'N/I'}</Typography>;
}

export function RenderCellObservationBorrowingReturnProduct({ params }) {
 
  return <Typography>{params.row.return_borrowing?.observation ?? 'N/I'}</Typography>;
}



  export function RenderCellUnit({ params }) {
    return <Typography>{params.row.unit_measure?.designation ?? 'N/I'}</Typography>;
  }

  export function RenderCellActualQuantity({ params }) {
    return <Typography>{params.row.quantity ?? 'N/I'}</Typography>;
  }

  export function RenderCellLastInventory({ params }) {
    return <Typography>{params.row.last_inventory ?? 'N/I'}</Typography>;
  }
  export function RenderCellLastPurchase({ params }) {
    return <Typography>{params.row.last_purchase ?? 'N/I'}</Typography>;
  }


  export function RenderCellLastExit({ params }) {
    return <Typography>{params.row.last_exit ?? 'N/I'}</Typography>;
  }

  export function RenderCellLastConsumption({ params }) {
    return <Typography>{params.row.last_consumption ?? 'N/I'}</Typography>;
  }