import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import { Typography } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';
import LinearProgress from '@mui/material/LinearProgress';

import { RouterLink } from 'src/routes/components';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

export function RenderCellPrice({ params }) {
  return fCurrency(params.row.price);
}

// export function RenderCellType({ params }) {
//   return <Typography variant="body2">CNAS</Typography>;
// }

export function RenderCellColor({ params }) {
  return <Typography variant="body2">red</Typography>;
}

export function RenderCellCategorySocio({ params }) {
  return <Typography variant="body2">9</Typography>;
}

export function RenderCellEchelle({ params }) {
  return <Typography variant="body2">25.5</Typography>;
}

export function RenderCellIrg({ params }) {
  return <Typography variant="body2">red</Typography>;
}

export function RenderCellLevel({ params }) {
  return <Typography variant="body2">0.5</Typography>;
}
export function RenderCellAddress({ params }) {
  return <Typography variant="body2">SETIF</Typography>;
}
export function RenderCellFullname({ params }) {
  return <Typography variant="body2">GUENDOUZ - MESSAOUD</Typography>;
}
export function RenderCellCode({ params }) {
  return <Typography variant="body2">ATF-1</Typography>;
}
export function RenderCellNature({ params }) {
  return (
    <Label variant="soft" color="warning">
      DEMARRAGE
    </Label>
  );
}
export function RenderCellSite({ params }) {
  return <Typography variant="body2">ST-SETIF</Typography>;
}
export function RenderCellContractType({ params }) {
  return (
    <Label variant="soft" color="info">
      CDI
    </Label>
  );
}

export function RenderCellObservation({ params }) {
  return (
    <Typography variant="body2">
      TRANSFER A ENTREPRISE EL DIOUANE TYRE ACCORDE PAR DJABER
    </Typography>
  );
}

export function RenderCellProbation({ params }) {
  return <Typography variant="body2">0</Typography>;
}

export function RenderCellWorkRithme({ params }) {
  return <Typography variant="body2">R22</Typography>;
}

export function RenderCellMissionEndDate({ params }) {
  return <Typography variant="body2">-</Typography>;
}

export function RenderCellFonction({ params }) {
  return <Typography variant="body2">AGENT POLYVALENT NIV 1</Typography>;
}

export function RenderCellAbs({ params }) {
  return (
    <Label variant="soft" color="info">
      Oui
    </Label>
  );
}
export function RenderCellStatus({ params }) {
  return (
    <Label variant="soft" color="primary">
      Validé
    </Label>
  );
}

export function RenderCellCountBase({ params }) {
  return (
    <Label variant="soft" color="primary">
      TAUX
    </Label>
  );
}

export function RenderCellDisplayBase({ params }) {
  return (
    <Label variant="soft" color="primary">
      SALAIRE
    </Label>
  );
}

export function RenderCellPeriode({ params }) {
  return (
    <Label variant="soft" color="primary">
      MENSUELE
    </Label>
  );
}

export function RenderCellWorkTime({ params }) {
  return (
    <Label variant="soft" color="info">
      95.0 HEURES
    </Label>
  );
}
export function RenderCellWorkStop({ params }) {
  return (
    <Label variant="soft" color="info">
      0.0 HEURE
    </Label>
  );
}
export function RenderCellGridSalary({ params }) {
  return (
    <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
      <span>AGENT-POLYVALENT-NIV-1-SRF-1</span>
      {/* <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
        {fTime(params.row.createdAt)}
      </Box> */}
    </Box>
  );
}
export function RenderCellStartAt({ params }) {
  return (
    <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
      <span>{fDate(params.row.createdAt)}</span>
      {/* <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
        {fTime(params.row.createdAt)}
      </Box> */}
    </Box>
  );
}
export function RenderCellEndAt({ params }) {
  return (
    <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
      <span>{fDate(params.row.createdAt)}</span>
      {/* <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
        {fTime(params.row.createdAt)}
      </Box> */}
    </Box>
  );
}
export function RenderCellCreatedAt({ params }) {
  return (
    <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
      <span>{fDate(params.row.createdAt)}</span>
      {/* <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
        {fTime(params.row.createdAt)}
      </Box> */}
    </Box>
  );
}

export function RenderCellUsername({ params }) {
  return (
    <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
      <span> 19######80</span>
    </Box>
  );
}
export function RenderCellStock({ params }) {
  return (
    <Box sx={{ width: 1, typography: 'caption', color: 'text.secondary' }}>
      <LinearProgress
        value={(params.row.available * 100) / params.row.quantity}
        variant="determinate"
        color={
          (params.row.inventoryType === 'out of stock' && 'error') ||
          (params.row.inventoryType === 'low stock' && 'warning') ||
          'success'
        }
        sx={{ mb: 1, height: 6, width: 80 }}
      />
      {!!params.row.available && params.row.available} {params.row.inventoryType}
    </Box>
  );
}

export function RenderCellUser({ params, href }) {
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
      <Avatar
        alt={params.row.name}
        src={params.row.coverUrl}
        variant="rounded"
        sx={{ width: 34, height: 34, borderRadius: '50%' }}
      />

      <ListItemText
        primary={
          <Link component={RouterLink} href={href} color="inherit">
            {params.row.name}
          </Link>
        }
        secondary={params.row.category}
        slotProps={{
          primary: { noWrap: true },
          secondary: { sx: { color: 'text.disabled' } },
        }}
      />
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

export function RenderCellCompany({ params, href }) {
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
        primary={<Typography color="inherit">{params.row.name}</Typography>}
        // secondary={params.row.category}
        slotProps={{
          primary: { noWrap: true },
          secondary: { sx: { color: 'text.disabled' } },
        }}
      />
    </Box>
  );
}
