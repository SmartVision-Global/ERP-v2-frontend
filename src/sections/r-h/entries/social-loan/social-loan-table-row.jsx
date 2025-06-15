import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { Typography } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';

import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';

import {
  STATUS_VALIDATION_OPTIONS,
  STATUS_VALIDATION_OPTIONS_COLORS,
} from '../leave-absence/leave-absence-table-row';

// ----------------------------------------------------------------------

export function RenderCellFullname({ params }) {
  return <Typography variant="body2">{params.row?.personal?.name}</Typography>;
}
export function RenderCellPretAmount({ params }) {
  return <Typography variant="body2">{fCurrency(params.row.loan_amount)}</Typography>;
}
export function RenderCellObservation({ params }) {
  return <Typography variant="body2">{params.row.observation}</Typography>;
}

export function RenderCellTauxRemb({ params }) {
  return (
    <Label variant="soft" color={params.row.publish === 'published' ? 'info' : 'default'}>
      100%
    </Label>
  );
}
export function RenderCellLoanTermMonths({ params }) {
  return (
    <Label variant="soft" color="info">
      {params.row.loan_term_months} MOIS
    </Label>
  );
}

export function RenderCellStatus({ params }) {
  return (
    <Label variant="soft" color={STATUS_VALIDATION_OPTIONS_COLORS[params.row.status]}>
      {STATUS_VALIDATION_OPTIONS[params.row.status]}
    </Label>
  );
}

export function RenderCellStartDate({ params }) {
  return (
    <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
      <span>{fDate(params.row.start_date)}</span>
      {/* <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
        {fTime(params.row.createdAt)}
      </Box> */}
    </Box>
  );
}
export function RenderCellCreatedAt({ params }) {
  return (
    <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
      <span>{fDate(params.row.created_at)}</span>
      <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
        {fTime(params.row.created_at)}
      </Box>
    </Box>
  );
}

export function RenderCellId({ params, href }) {
  return (
    <Box
      sx={{
        py: 2,
        gap: 2,
        width: 1,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <ListItemText
        primary={
          <Link component={RouterLink} href={href} color="inherit">
            {params.row.id}
          </Link>
        }
        // secondary={params.row.category}
        slotProps={{
          primary: { noWrap: true },
          secondary: { sx: { color: 'text.disabled' } },
        }}
      />
    </Box>
  );
}
