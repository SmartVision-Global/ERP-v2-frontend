import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { Typography } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';

import { RouterLink } from 'src/routes/components';

import { fDate, fTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

const TYPE = {
  1: 'FORMATIONS ACADEMIQUES',
  2: 'FORMATIONS PROFESSIONNELLES',
  3: 'EXPERIENCES ANTERIEURES',
  4: 'AUTRE QUALITE',
  5: 'AVOIR',
  6: 'SAVOIR-FAIRE',
  7: 'SAVOIR-ETRE',
};

export function RenderCellLib({ params }) {
  return <Typography variant="body2">{params.row.label?.fr}</Typography>;
}

export function RenderCellSpecialityExist({ params }) {
  return <Typography variant="body2">{params.row.specialty_exist ? 'Oui' : 'Non'}</Typography>;
}

export function RenderCellSpecialityFr({ params }) {
  return (
    <Typography variant="body2">
      {params.row.specialty_exist ? params.row?.specialty?.fr : '-'}
    </Typography>
  );
}

export function RenderCellDiplomaExist({ params }) {
  return <Typography variant="body2">{params.row.diploma_required ? 'Oui' : 'Non'}</Typography>;
}

export function RenderCellType({ params }) {
  return (
    <Label variant="soft" color="info">
      {TYPE[params.row.type]}
    </Label>
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
