import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { Typography } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';

import { RouterLink } from 'src/routes/components';

import { fDate, fTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

const MONTHS = {
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

const STATUS = {
  1: 'OUVERTE',
  2: 'PREPARATION',
  3: 'FERME',
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

export function RenderCellPP({ params }) {
  return (
    <Label variant="soft" color="info">
      {params.row.presence_bonus_exists ? 'Oui' : 'Non'}
    </Label>
  );
}

export function RenderCellPRC({ params }) {
  return (
    <Label variant="soft" color="info">
      {params.row.collective_return_bonus_exists ? 'Oui' : 'Non'}
    </Label>
  );
}

export function RenderCellPRI({ params }) {
  return (
    <Label variant="soft" color="info">
      {params.row.individual_performance_bonus_exists ? 'Oui' : 'Non'}
    </Label>
  );
}

export function RenderCellCompany({ params }) {
  return <Typography variant="body2">{params.row?.enterprise_id}</Typography>;
}

export function RenderCellMaxPoint({ params }) {
  return <Typography variant="body2">{params.row.maximum_point}</Typography>;
}

export function RenderCellMinPoint({ params }) {
  return <Typography variant="body2">{params.row.lowest_point}</Typography>;
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
export function RenderCellStatus({ params }) {
  return (
    <Label variant="soft" color="primary">
      {STATUS[params.row.status]}
    </Label>
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
