import { Typography } from '@mui/material';

import { Label } from 'src/components/label';

import { MONTHS } from '../preparation/month-table-row';

// ----------------------------------------------------------------------

export function RenderCellMonth({ params }) {
  return (
    <Label variant="soft" color="info">
      {MONTHS[params.row?.month]}
    </Label>
  );
}
export function RenderCellYear({ params }) {
  return <Typography variant="body2">{params?.row?.year}</Typography>;
}

export function RenderCellCompany({ params }) {
  return <Typography variant="body2">{params.row?.enterprise}</Typography>;
}

export function RenderCellPersonal({ params }) {
  return <Typography variant="body2">4</Typography>;
}

export function RenderCellAbs({ params }) {
  return <Typography variant="body2">{params.row?.total_absences}</Typography>;
}

export function RenderCellOverdays({ params }) {
  return <Typography variant="body2">{params.row?.total_days_worked}</Typography>;
}

export function RenderCellOvertime({ params }) {
  return (
    <Typography variant="body2">
      {params.row?.total_overtime_50 +
        params.row?.total_overtime_75 +
        params.row?.total_overtime_100}
    </Typography>
  );
}

export function RenderCellPrimeCotis({ params }) {
  return <Typography variant="body2">0</Typography>;
}

export function RenderCellPrimeNonCotis({ params }) {
  return <Typography variant="body2">0</Typography>;
}

export function RenderCellBaseSalary({ params }) {
  return (
    <Typography variant="body2" color="text.secondary">
      {params.row?.total_net_salary?.toFixed(2)}
    </Typography>
  );
}

export function RenderCellCotisSalary({ params }) {
  return (
    <Typography variant="body2" color="text.secondary">
      {params?.row?.total_contributory_salary?.toFixed(2)}
    </Typography>
  );
}

export function RenderCellPositionSalary({ params }) {
  return (
    <Typography variant="body2" color="text.secondary">
      {params.row?.total_post_salary?.toFixed(2)}
    </Typography>
  );
}

export function RenderCellImposSalary({ params }) {
  return (
    <Typography variant="body2" color="text.secondary">
      {params.row?.total_taxable_wages?.toFixed(2)}
    </Typography>
  );
}

export function RenderCellIrg({ params }) {
  return (
    <Typography variant="body2" color="text.secondary">
      {params.row?.total_tax?.toFixed(2)}
    </Typography>
  );
}

export function RenderCellNet({ params }) {
  return <Typography variant="body2">{params.row?.total_net_salary?.toFixed(2)}</Typography>;
}
