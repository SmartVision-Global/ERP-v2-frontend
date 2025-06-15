import { Typography } from '@mui/material';

import { fCurrency } from 'src/utils/format-number';

// ----------------------------------------------------------------------

const JOB_REGIME = {
  1: 'poste',
  2: 'surface',
};

export function RenderCellId({ params }) {
  return (
    <Typography fontSize={12} variant="body2">
      {params?.row?.id}
    </Typography>
  );
}

export function RenderCellPersonal({ params }) {
  return (
    <Typography fontSize={12} variant="body2">
      {params?.row?.name}
    </Typography>
  );
}

export function RenderCellSite({ params }) {
  return (
    <Typography fontSize={12} variant="body2">
      {params?.row?.site}
    </Typography>
  );
}
export function RenderCellBank({ params }) {
  return (
    <Typography fontSize={12} variant="body2">
      {params?.row?.bank}
    </Typography>
  );
}
export function RenderCellRib({ params }) {
  return (
    <Typography fontSize={12} variant="body2">
      {params?.row?.rib}
    </Typography>
  );
}

export function RenderCellJobRegime({ params, href }) {
  return <Typography fontSize={12}>{JOB_REGIME[params.row?.job_regime]}</Typography>;
}

export function RenderCellJob({ params, href }) {
  return <Typography fontSize={12}>{params.row?.job}</Typography>;
}

export function RenderCellSalaryGrid({ params, href }) {
  return <Typography fontSize={12}>{params.row?.salary_grid}</Typography>;
}

export function RenderCellDaysWorked({ params, href }) {
  return <Typography fontSize={12}>{params.row?.days_worked}</Typography>;
}

export function RenderCellAbs({ params }) {
  return <Typography variant="body2">{params.row?.absence}</Typography>;
}
export function RenderCellHolday({ params }) {
  return <Typography variant="body2">{params.row?.holiday}</Typography>;
}

export function RenderCellYear({ params }) {
  return <Typography variant="body2">{params?.row?.year}</Typography>;
}

export function RenderCellCompany({ params }) {
  return <Typography variant="body2">{params.row?.enterprise}</Typography>;
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
      {fCurrency(params.row?.salary)}
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
