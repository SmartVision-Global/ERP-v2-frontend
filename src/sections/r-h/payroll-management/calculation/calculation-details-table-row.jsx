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
      {params?.row?.personal?.name}
    </Typography>
  );
}

export function RenderCellSite({ params }) {
  return (
    <Typography fontSize={12} variant="body2">
      {params?.row?.personal?.site}
    </Typography>
  );
}
export function RenderCellBank({ params }) {
  return (
    <Typography fontSize={12} variant="body2">
      {params?.row?.personal?.bank}
    </Typography>
  );
}
export function RenderCellRib({ params }) {
  return (
    <Typography fontSize={12} variant="body2">
      {params?.row?.personal?.rib}
    </Typography>
  );
}

export function RenderCellJobRegime({ params, href }) {
  return <Typography fontSize={12}>{JOB_REGIME[params.row?.personal?.job_regime]}</Typography>;
}

export function RenderCellJob({ params, href }) {
  return <Typography fontSize={12}>{params.row?.personal?.job}</Typography>;
}

export function RenderCellSalaryGrid({ params, href }) {
  return <Typography fontSize={12}>{params.row?.personal?.salary_grid}</Typography>;
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

export function RenderCellBaseSalary({ params }) {
  return <Typography variant="body2">{fCurrency(params.row?.salary)}</Typography>;
}

export function RenderCellContributorySalary({ params }) {
  return <Typography variant="body2">{fCurrency(params.row?.contributory_salary)}</Typography>;
}

export function RenderCellPostSalary({ params }) {
  return <Typography variant="body2">{fCurrency(params.row?.post_salary)}</Typography>;
}

export function RenderCellNet({ params }) {
  return <Typography variant="body2">{fCurrency(params.row?.net_salary_payable)}</Typography>;
}
