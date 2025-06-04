import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import { Typography } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';
import LinearProgress from '@mui/material/LinearProgress';

import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';

// ----------------------------------------------------------------------
const CONTRIBUTORY_IMPOSABLE = {
  1: 'COTISABLE - IMPOSABLE',
  2: 'NON COTISABLE - IMPOSABLE',

  3: 'NON COTISABLE - NON IMPOSABLE',
  4: 'AUTRE',
};

const CONTRIBUTORY_IMPOSABLE_COLORS = {
  1: 'primary',
  2: 'secondary',

  3: 'info',
  4: 'warning',
};

const PERIODIC = {
  1: 'Mensuelle',
  2: 'AUTRE',
};

const CALCULATION_BASE = {
  1: 'TAUX',
  2: 'Montant',
};
const DISPLAY_BASE = {
  1: 'SALAIRE',
  2: 'JOURS',
};

const TYPE = {
  1: 'Retenues',
  2: 'Indemnités',
};

export function RenderCellPrice({ params }) {
  return fCurrency(params.row.price);
}

export function RenderCellName({ params }) {
  return <Typography variant="body2">{params.row.name}</Typography>;
}

export function RenderCellCode({ params }) {
  return <Typography variant="body2">{params.row.code}</Typography>;
}

export function RenderCellContract({ params }) {
  return (
    <Label variant="soft" color={params.row.publish === 'published' ? 'info' : 'default'}>
      Missions Principales
    </Label>
  );
}
export function RenderCellType({ params }) {
  return (
    <Label variant="soft" color="info">
      {TYPE[params.row.type]}
    </Label>
  );
}

export function RenderCellAbs({ params }) {
  return (
    <Label variant="soft" color="info">
      {params.row.subject_absence ? 'Oui' : 'Non'}
    </Label>
  );
}

export function RenderCellDelete({ params }) {
  return (
    <Label variant="soft" color="info">
      {params.row.is_deletable ? 'Oui' : 'Non'}
    </Label>
  );
}

export function RenderCellCategory({ params }) {
  return (
    <Label variant="soft" color={CONTRIBUTORY_IMPOSABLE_COLORS[params.row.contributory_imposable]}>
      {CONTRIBUTORY_IMPOSABLE[params.row.contributory_imposable]}
    </Label>
  );
}

export function RenderCellCountBase({ params }) {
  return (
    <Label variant="soft" color="primary">
      {CALCULATION_BASE[params.row.calculation_base]}
    </Label>
  );
}

export function RenderCellDisplayBase({ params }) {
  return (
    <Label variant="soft" color="primary">
      {DISPLAY_BASE[params.row.display_base]}
    </Label>
  );
}

export function RenderCellPeriode({ params }) {
  return (
    <Label variant="soft" color="primary">
      {PERIODIC[params.row.periodic]}
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

export function RenderCellDesignation({ params }) {
  return (
    <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
      <span>{params.row.designation}</span>
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
