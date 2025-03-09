import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { Typography } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';

import { RouterLink } from 'src/routes/components';

import { fDate, fTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

export function RenderCellMonth({ params }) {
  return (
    <Label variant="soft" color="info">
      Décembre
    </Label>
  );
}
export function RenderCellYear({ params }) {
  return <Typography variant="body2">2024</Typography>;
}

export function RenderCellPP({ params }) {
  return (
    <Label variant="soft" color="info">
      Non
    </Label>
  );
}

export function RenderCellPRC({ params }) {
  return (
    <Label variant="soft" color="info">
      Non
    </Label>
  );
}

export function RenderCellPRI({ params }) {
  return (
    <Label variant="soft" color="info">
      Non
    </Label>
  );
}

export function RenderCellCompany({ params }) {
  return <Typography variant="body2">SARL EL DIOUANE IMPORT EXPORT ( Alger )</Typography>;
}

export function RenderCellMaxPoint({ params }) {
  return <Typography variant="body2">0</Typography>;
}

export function RenderCellMinPoint({ params }) {
  return <Typography variant="body2">1</Typography>;
}

export function RenderCellCreatedAt({ params }) {
  return (
    <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
      <span>{fDate(params.row.createdAt)}</span>
      <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
        {fTime(params.row.createdAt)}
      </Box>
    </Box>
  );
}
export function RenderCellStatus({ params }) {
  return (
    <Label variant="soft" color="primary">
      OUVERTE
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
            {Math.floor(Math.random() * 1000) + 1}
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
