import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { fDate, fTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';

// Custom cell renderers for StockListView
export function RenderCellId({ params }) {
  return <Typography>{params.row.id}</Typography>;
}

export function RenderCellCode({ params }) {
  return <Typography>{params.row.code}</Typography>;
}

export function RenderCellSupplierCode({ params }) {
  return <Typography>{params.row.supplier_code}</Typography>;
}

export function RenderCellBuilderCode({ params }) {
  return <Typography>{params.row.builder_code}</Typography>;
}

export function RenderCellDesignation({ params }) {
  return <Typography>{params.row.designation}</Typography>;
}

export function RenderCellQuantity({ params }) {
  return <Typography>{params.row.quantity}</Typography>;
}

export function RenderCellStatus({ params }) {
  // Adjust label color logic as needed
  return <Label variant="soft" color="default">{params.row.status}</Label>;
}

export function RenderCellUnit({ params }) {
  return <Typography>{params.row.unit_measure?.designation ?? 'N/I'}</Typography>;
}

export function RenderCellAlert({ params }) {
  return <Typography>{params.row.alert}</Typography>;
}

export function RenderCellMin({ params }) {
  return <Typography>{params.row.min}</Typography>;
}

export function RenderCellUnknown1() {
  return <Typography>N/I</Typography>;
}

export function RenderCellUnknown2() {
  return <Typography>N/I</Typography>;
}

export function RenderCellFamily({ params }) {
  return <Typography>{params.row.family?.name ?? 'N/I'}</Typography>;
}

export function RenderCellSousFamilles() {
  return <Typography>N/I</Typography>;
}

export function RenderCellCategory({ params }) {
  return <Typography>{params.row.category?.name ?? 'N/I'}</Typography>;
}

export function RenderCellLocation({ params }) {
  const arr = params.row.product_storage;
  return <Typography>{Array.isArray(arr) && arr.length ? arr[0].location : 'N/I'}</Typography>;
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
