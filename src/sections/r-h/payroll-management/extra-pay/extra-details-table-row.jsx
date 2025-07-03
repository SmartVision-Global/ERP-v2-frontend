import { Box, Typography } from '@mui/material';

import { Label } from 'src/components/label';

export function RenderCellId({ params, href }) {
  return (
    <Box>
      <Typography>{params.row.personal_id}</Typography>
    </Box>
  );
}

export function RenderCellUser({ params, href }) {
  return (
    <Box>
      <Typography>{params.row.name}</Typography>
    </Box>
  );
}

export function RenderCellEnterprise({ params, href }) {
  return (
    <Box>
      <Typography>{params.row.enterprise}</Typography>
    </Box>
  );
}

export function RenderCellDaysPerMonth({ params, href }) {
  return (
    <Box>
      <Typography>{params.row.days_per_month}</Typography>
    </Box>
  );
}

export function RenderCellDaysWorked({ params, href }) {
  return (
    <Box>
      <Typography>{params.row.days_worked}</Typography>
    </Box>
  );
}

export function RenderCellAbsence({ params, href }) {
  return (
    <Box>
      <Typography>{params.row.absence}</Typography>
    </Box>
  );
}

export function RenderCellHoliday({ params, href }) {
  return (
    <Box>
      <Typography>{params.row.holiday}</Typography>
    </Box>
  );
}

export function RenderCellExtraSalary({ params, href }) {
  return (
    <Box>
      <Typography>{params.row.extra_salary}</Typography>
    </Box>
  );
}

export function RenderCellExtraPayNet({ params, href }) {
  return (
    <Box>
      <Typography>{params.row.extra_pay_net}</Typography>
    </Box>
  );
}

export function RenderCellStatus({ params, href }) {
  return (
    <Label variant="soft" color={params.row.id ? 'info' : 'error'}>
      {params.row.id ? 'Validé' : 'Non Validé'}
    </Label>
  );
}
