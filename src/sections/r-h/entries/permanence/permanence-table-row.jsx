import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { Typography } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';

import { RouterLink } from 'src/routes/components';

import { fDate, fTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';

import { STATUS_VALIDATION_OPTIONS } from '../leave-absence/leave-absence-table-row';

// ----------------------------------------------------------------------

export const NATURE = {
  1: 'Jour supplémentaire +50%',
  2: 'Jour supplémentaire +75%',
  3: 'Jour supplémentaire +100%',
};

export function RenderCellFullname({ params }) {
  return <Typography variant="body2">{params.row?.personal?.name}</Typography>;
}
export function RenderCellType({ params }) {
  return (
    <Label variant="soft" color={params.row.publish === 'published' ? 'info' : 'default'}>
      ABSENCE AUTORISÉE NON PAYÉ
    </Label>
  );
}

export function RenderCellSite({ params }) {
  return <Typography variant="body2">{params.row.site?.name}</Typography>;
}
export function RenderCellFunction({ params }) {
  return <Typography variant="body2">AGENT POLYVALENT NIV 2</Typography>;
}
export function RenderCellAtelier({ params }) {
  return <Typography variant="body2">AT-2</Typography>;
}
export function RenderCellDays({ params }) {
  return <Typography variant="body2">0</Typography>;
}

export function RenderCellStartAt({ params }) {
  return (
    <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
      <span>{fDate(params.row.from_date)}</span>
      <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
        {fTime(params.row.created_at)}
      </Box>
    </Box>
  );
}
export function RenderCellEndAt({ params }) {
  return (
    <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
      <span>{fDate(params.row.to_date)}</span>
      <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
        {fTime(params.row.created_at)}
      </Box>
    </Box>
  );
}

export function RenderCellNotes({ params }) {
  return <Typography variant="body2">{params.row.observation}</Typography>;
}

export function RenderCellStatus({ params }) {
  return (
    <Label variant="soft" color={params.row.publish === 'published' ? 'info' : 'default'}>
      {STATUS_VALIDATION_OPTIONS[params.row.status]}
    </Label>
  );
}
export function RenderCellNature({ params }) {
  return (
    <Label variant="soft" color="default">
      {NATURE[params.row.refund_nature]}
    </Label>
  );
}

export function RenderCellValideBy({ params }) {
  return <Typography variant="body2">-</Typography>;
}

export function RenderCellExercice({ params }) {
  return <Typography variant="body2">EX-2</Typography>;
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
