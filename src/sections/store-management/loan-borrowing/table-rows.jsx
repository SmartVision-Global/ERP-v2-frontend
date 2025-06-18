import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { fDate, fTime } from 'src/utils/format-time';

import { THIRD_STATUS_OPTIONS, THIRD_TYPE_OPTIONS, BORROWING_NATURE_OPTIONS, BORROWING_TYPE_OPTIONS, BORROWING_STATUS_OPTIONS, BORROWING_RETURN_STATUS_OPTIONS } from 'src/_mock/stores/raw-materials/data';

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
  return <Typography>{params.row.product?.designation ?? 'N/I'}</Typography>;
}

export function RenderCellQuantity({ params }) {
  return <Typography>{params.row.quantity}</Typography>;
}

export function RenderCellStatus({ params }) {
  const status = THIRD_STATUS_OPTIONS.find(option => option.value == params.row.status);
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
  return <Typography>{params.row.family?.parent?.name ?? 'N/I'}</Typography>;
}

export function RenderCellSubFamilies({ params }) {
  return <Typography>{params.row.family?.name ?? 'N/I'}</Typography>;
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
  return <Label variant="soft" color="default">{params.row.nature}</Label>;
}

export function RenderCellProduct({ params }) {
  return <Typography>{params.row.product_code ?? 'N/I'}</Typography>;
}

export function RenderCellSupplierCode({ params }) {
  return <Typography>{params.row.product?.supplier_code?? 'N/I'}</Typography>;
}


export function RenderCellLocalCode({ params }) {
  return <Typography>{params.row.product?.local_code?? 'N/I'}</Typography>;
}

export function RenderCellSource({ params }) {
  return <Typography>{params.row.store?.name?? 'N/I'}</Typography>;
}

export function RenderCellDestination({ params }) {
  return <Typography>{params.row.destination_store?.name?? 'N/I'}</Typography>;
}

export function RenderCellCreatedDate({ params }) {
  return (
      <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
        <span>{fDate(params.row.created_at)}</span>
        <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
          {fTime(params.row.created_at)}
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

export function RenderCellStore({ params }) {
  return <Typography>{params.row.store?.code ?? 'N/I'}</Typography>;
}

export function RenderCellNature({ params }) {
  const nature = BORROWING_NATURE_OPTIONS.find(option => option.value == params.row.nature);
  const color = nature?.color ?? 'default';
  const label = nature?.label ?? 'N/I';
  return <Label variant="soft" color={color}>{label}</Label>;
}


export function RenderCellTypeBorrowing({ params }) {
  const type = BORROWING_TYPE_OPTIONS.find(option => option.value == params.row.type);
  const color = type?.color ?? 'default';
  const label = type?.label ?? 'N/I';
  return <Label variant="soft" color={color}>{label}</Label>;
}

export function RenderCellStatusBorrowing({ params }) {
  const status = BORROWING_STATUS_OPTIONS.find(option => option.value == params.row.status);
  const color = status?.color ?? 'default';
  const label = status?.label ?? 'N/I';
  return <Label variant="soft" color={color}>{label}</Label>;
}

export function RenderCellReturnStatusBorrowing({ params }) {
  const status = BORROWING_RETURN_STATUS_OPTIONS.find(option => option.value == params.row.return_status);
  const color = status?.color ?? 'default';
  const label = status?.label ?? 'N/I';
  return <Label variant="soft" color={color}>{label}</Label>;
}

