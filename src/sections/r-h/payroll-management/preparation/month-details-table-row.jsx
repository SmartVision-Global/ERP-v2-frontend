import { Box, Typography } from '@mui/material';

import { fDate } from 'src/utils/format-time';

import { Label } from 'src/components/label';

const STATUS = {
  1: 'En Attente',
  2: 'Actif',
  3: 'Bloqué',
};

export function RenderCellId({ params, href }) {
  return (
    <Box>
      <Typography>{params.row.personal?.id}</Typography>
    </Box>
  );
}

export function RenderCellUser({ params, href }) {
  return (
    <Box>
      <Typography>{params.row.personal?.name}</Typography>
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

export function RenderCellHoursPerMonth({ params, href }) {
  return (
    <Box>
      <Typography>{params.row.hours_per_month}</Typography>
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

export function RenderCellDelay({ params, href }) {
  return (
    <Box>
      <Typography>{params.row.delay}</Typography>
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

export function RenderCellOvertime50({ params, href }) {
  return (
    <Box>
      <Typography>{params.row.overtime_50}</Typography>
    </Box>
  );
}
export function RenderCellOvertime75({ params, href }) {
  return (
    <Box>
      <Typography>{params.row.overtime_75}</Typography>
    </Box>
  );
}
export function RenderCellOvertime100({ params, href }) {
  return (
    <Box>
      <Typography>{params.row.overtime_100}</Typography>
    </Box>
  );
}

export function RenderCellStatus({ params, href }) {
  return (
    <Label
      variant="soft"
      color={params.row.status === 1 ? 'info' : params.row.status === 2 ? 'success' : 'error'}
    >
      {STATUS[params.row.status]}
    </Label>
  );
}

export function RenderCellServiceStart({ params, href }) {
  return (
    <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
      <span>{fDate(params.row.service_start)}</span>
    </Box>
  );
}

export function RenderCellServiceEnd({ params, href }) {
  return (
    <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
      <span>{params.row.service_end ? fDate(params.row.service_end) : '-'}</span>
    </Box>
  );
}
