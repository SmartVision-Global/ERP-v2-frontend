import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { Avatar, Typography } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';

import { RouterLink } from 'src/routes/components';

import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

const VALIDATION_STATUS = {
  1: 'Paie en cours',
  2: 'Paie valide',
};

const STATUS = {
  1: 'En cours',
  2: 'Actif',
  3: 'Bloquer',
};

export function RenderCellUser({ params, href }) {
  return (
    <Box
      sx={{
        py: 0,
        gap: 1,
        width: 1,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Avatar
        alt={params.row.personal?.name}
        src={params.row?.photo?.url}
        variant="rounded"
        sx={{ width: 34, height: 34, borderRadius: '50%' }}
      />

      <ListItemText
        primary={<Typography fontSize={12}>{params.row?.personal?.name}</Typography>}
        secondary={params.row?.personal?.job}
        slotProps={{
          primary: { noWrap: true },
          secondary: { sx: { color: 'text.disabled', fontSize: 10 } },
        }}
      />
    </Box>
  );
}

export function RenderCellStatus({ params }) {
  return (
    <Label
      variant="soft"
      color={
        params.row.personal?.status === 1
          ? 'info'
          : params.row.personal?.status === 2
            ? 'success'
            : 'error'
      }
      // color="info"
    >
      {STATUS[params.row.personal?.status]}
    </Label>
  );
}

export function RenderCellValidation({ params }) {
  return (
    <Label variant="soft" color={params.row?.status === 1 ? 'info' : 'success'}>
      {VALIDATION_STATUS[params.row?.status]}
    </Label>
  );
}
export function RenderCellSite({ params }) {
  return <Typography fontSize={12}>{params.row.personal?.site}</Typography>;
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
