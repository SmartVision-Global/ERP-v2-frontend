import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { Typography } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';

import { RouterLink } from 'src/routes/components';

import { fDate, fTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

export const ABS_TYPE_OPTIONS = {
  1: 'MALADIE',
  2: 'CONGE ANNUEL',
  3: 'ABSENCE AUTORISEE PAYE',
  4: 'ABSENCE AUTORISEE NON PAYE',
  5: 'ABSENCE NON AUTORISEE',
  6: 'CONGE EXCEPTIONNEL',
  7: 'CONGE SANS SOLDE',
  8: 'SORTIE AUTORISEE PAYE',
  9: 'SORTIE AUTORISEE NON PAYE',
  10: 'SORTIE NON AUTORISEE',
  11: 'RETARD PAYE',
  12: 'RETARD NON PAYE',
};

export const STATUS_VALIDATION_OPTIONS = {
  1: 'En attente',
  2: 'Validé',
  3: 'Archivé',
  4: 'Annulée',
};

export function RenderCellFullname({ params }) {
  return <Typography variant="body2">{params.row?.personal?.name}</Typography>;
}
export function RenderCellType({ params }) {
  return (
    <Label variant="soft" color={params.row.publish === 'published' ? 'info' : 'default'}>
      {ABS_TYPE_OPTIONS[params.row.type]}
    </Label>
  );
}

export function RenderCellSite({ params }) {
  return <Typography variant="body2">{params.row?.site?.name}</Typography>;
}
export function RenderCellFunction({ params }) {
  return <Typography variant="body2">AGENT POLYVALENT NIV 2</Typography>;
}
export function RenderCellAtelier({ params }) {
  return <Typography variant="body2">AT-2</Typography>;
}
export function RenderCellIntermidiate({ params }) {
  return <Typography variant="body2">IN-2</Typography>;
}

export function RenderCellStartAt({ params }) {
  return (
    <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
      <span>{fDate(params.row.from_date)}</span>
    </Box>
  );
}
export function RenderCellEndAt({ params }) {
  return (
    <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
      <span>{fDate(params.row.to_date)}</span>
    </Box>
  );
}

export function RenderCellDesignation({ params }) {
  return <Typography variant="body2">{params.row.observation}</Typography>;
}

export function RenderCellStatus({ params }) {
  return (
    <Label variant="soft" color={params.row.status === '1' ? 'info' : 'error'}>
      {STATUS_VALIDATION_OPTIONS[params.row.status]}
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
        slotProps={{
          primary: { noWrap: true },
          secondary: { sx: { color: 'text.disabled' } },
        }}
      />
    </Box>
  );
}
