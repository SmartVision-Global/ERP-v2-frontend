import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { fDate, fTime } from 'src/utils/format-time';

import { NATURE_OPTIONS, PRODUCT_TYPE_OPTIONS, STATUS_OPTIONS, PRIORITY_OPTIONS } from 'src/_mock/expression-of-needs/Beb/Beb';

import { Label } from 'src/components/label';


// Custom cell renderers for StockListView
export function RenderCellId({ params }) {
  return <Typography>{params.row.id}</Typography>;
}

export function RenderCellCode({ params }) {
  return <Typography>{params.row.code}</Typography>;
}

export function RenderCellNature({ params }) {
  return <Typography>{NATURE_OPTIONS.find(option => option.value === params.row.nature)?.label ?? 'N/I'}</Typography>;
}

export function RenderCellCreatedBy({ params }) {
  return <Typography>{params.row.created_by?.full_name ?? 'N/I'}</Typography>;
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
  const status = STATUS_OPTIONS.find(option => option.value === params.row.status);
  const color = status ? status.color : 'default';
  const label = status ? status.label : 'N/I';
  return <Label variant="soft" color={color}>{label}</Label>;
}

export function RenderCellType({ params }) {
  const type = PRODUCT_TYPE_OPTIONS.find(option => option.value === params.row.type);
  const color = type ? type.color : 'default';
  const label = type ? type.label : 'N/I';
  return <Label variant="soft" color={color}>{label}</Label>;
}

export function RenderCellService({ params }) {
  return <Typography>{params.row.service?.name ?? 'N/I'}</Typography>;
}

export function RenderCellPriority({ params }) {
  const priority = PRIORITY_OPTIONS.find(option => option.value === params.row.priority);
  const color = priority ? priority.color : 'default';
  const label = priority ? priority.label : 'N/I';
  return <Label variant="soft" color={color}>{label}</Label>;
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

export function RenderCellSite({ params }) {
  return <Typography>{params.row.site?.name ?? 'N/I'}</Typography>;
}


export function RenderCellLocation({ params }) {
  const arr = params.row.product_storage;
  const locations = Array.isArray(arr) && arr.length
    ? arr.map(item => item.location).filter(Boolean).join(', ')
    : 'N/I';
  return <Typography>{locations}</Typography>;
}

export function RenderCellRequestedDate({ params }) {
  return (
    <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
      <span>{fDate(params.row.requested_date)}</span>
      <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
        {fTime(params.row.requested_date)}
      </Box>
    </Box>
  );
}

export function RenderCellTime({ params }) {
  return (
    <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
      <span>{fTime(params.row.requested_date)}</span>
    </Box>
  );
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
