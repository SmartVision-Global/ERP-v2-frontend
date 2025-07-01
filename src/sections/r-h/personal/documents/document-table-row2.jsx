import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
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

export function RenderCellType({ params }) {
  return (
    <Label variant="soft" color={params.row.publish === 'published' ? 'info' : 'default'}>
      {params.row.publish}
    </Label>
  );
}

export function RenderCellLang({ params }) {
  return (
    <Label variant="soft" color={params.row.publish === 'published' ? 'info' : 'default'}>
      {params.row.publish === 'published' ? 'FR' : 'EN'}
    </Label>
  );
}

export function RenderCellContract({ params }) {
  return (
    <Label variant="soft" color={params.row.publish === 'published' ? 'info' : 'default'}>
      {/* {params.row.publish} */}
      {params.row.publish === 'published' ? 'CDI' : 'CDD'}
    </Label>
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
      <ListItemText
        primary={
          <Link component={RouterLink} href={href} color="inherit">
            {params.row.name}
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
            {Math.floor(Math.random() * 100000) + 1}
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

export function RenderCellPriority({ params, href }) {
  return <Typography>-</Typography>;
}

export function RenderCellDescription({ params, href }) {
  return <Typography>Description</Typography>;
}

export function RenderCellComment({ params, href }) {
  return <Typography>Commentaires</Typography>;
}
