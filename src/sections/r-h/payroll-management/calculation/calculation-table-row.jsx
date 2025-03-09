import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { Typography } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';

import { RouterLink } from 'src/routes/components';

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

export function RenderCellCompany({ params }) {
  return <Typography variant="body2">SARL EL DIOUANE IMPORT EXPORT ( Alger )</Typography>;
}

export function RenderCellPersonnel({ params }) {
  return <Typography variant="body2">4</Typography>;
}

export function RenderCellAbs({ params }) {
  return <Typography variant="body2">1</Typography>;
}

export function RenderCellOverdays({ params }) {
  return <Typography variant="body2">75</Typography>;
}

export function RenderCellOvertime({ params }) {
  return <Typography variant="body2">0</Typography>;
}

export function RenderCellPrimeCotis({ params }) {
  return <Typography variant="body2">0</Typography>;
}

export function RenderCellPrimeNonCotis({ params }) {
  return <Typography variant="body2">0</Typography>;
}

export function RenderCellBaseSalary({ params }) {
  return (
    <Typography variant="body2" color="text.secondary">
      18000.00
    </Typography>
  );
}

export function RenderCellCotisSalary({ params }) {
  return (
    <Typography variant="body2" color="text.secondary">
      20000.00
    </Typography>
  );
}

export function RenderCellPositionSalary({ params }) {
  return (
    <Typography variant="body2" color="text.secondary">
      18000.00
    </Typography>
  );
}

export function RenderCellImposSalary({ params }) {
  return (
    <Typography variant="body2" color="text.secondary">
      28000.00
    </Typography>
  );
}

export function RenderCellIrg({ params }) {
  return (
    <Typography variant="body2" color="text.secondary">
      25000.00
    </Typography>
  );
}

export function RenderCellNet({ params }) {
  return <Typography variant="body2">18000.00</Typography>;
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
