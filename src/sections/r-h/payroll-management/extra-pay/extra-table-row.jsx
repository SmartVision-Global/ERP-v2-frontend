import { Typography } from '@mui/material';

import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

export const MONTHS = {
  1: 'Janvier',
  2: 'Février',
  3: 'Mars',
  4: 'Avril',
  5: 'Mai',
  6: 'Juin',
  7: 'Juillet',
  8: 'Aout',
  9: 'Septembre',
  10: 'Octobre',
  11: 'Novembre',
  12: 'Décembre',
};

export function RenderCellMonth({ params }) {
  return (
    <Label variant="soft" color="info">
      {MONTHS[params.row.month]}
    </Label>
  );
}
export function RenderCellYear({ params }) {
  return <Typography variant="body2">{params.row.year}</Typography>;
}

export function RenderCellCompany({ params }) {
  return <Typography variant="body2">{params.row?.enterprise}</Typography>;
}

export function RenderCellAbsences({ params }) {
  return <Typography variant="body2">{params.row?.total_absences}</Typography>;
}

export function RenderCellDaysWorked({ params }) {
  return <Typography variant="body2">{params.row?.total_days_worked}</Typography>;
}

export function RenderCellExtraPayNet({ params }) {
  return <Typography variant="body2">{params.row?.total_extra_pay_net}</Typography>;
}

export function RenderCellExtraSalary({ params }) {
  return <Typography variant="body2">{params.row?.total_extra_salary}</Typography>;
}

export function RenderCellExtraHoliday({ params }) {
  return <Typography variant="body2">{params.row?.total_holiday}</Typography>;
}
