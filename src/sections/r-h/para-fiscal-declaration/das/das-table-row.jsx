import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';
import LinearProgress from '@mui/material/LinearProgress';

import { fCurrency } from 'src/utils/format-number';

import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

export function RenderCellQ1Total({ params }) {
  return <Typography fontSize={12}>{fCurrency(params.row.q1_total)}</Typography>;
}

export function RenderCellQ2Total({ params }) {
  return <Typography fontSize={12}>{fCurrency(params.row.q2_total)}</Typography>;
}
export function RenderCellQ3Total({ params }) {
  return <Typography fontSize={12}>{fCurrency(params.row.q3_total)}</Typography>;
}
export function RenderCellQ4Total({ params }) {
  return <Typography fontSize={12}>{fCurrency(params.row.q4_total)}</Typography>;
}
export function RenderCellTotal({ params }) {
  return (
    <Typography fontSize={12}>
      {fCurrency(
        params.row.q1_total + params.row.q2_total + params.row.q3_total + params.row.q4_total
      )}
    </Typography>
  );
}

export function RenderCellYearRef({ params }) {
  return (
    <Label variant="soft" color="info">
      {params.row.year}
    </Label>
  );
}
export function RenderCellBillCenter({ params }) {
  return (
    <Label variant="soft" color="default">
      {params.row.paying_center}
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

export function RenderCellTotalEmployees({ params }) {
  return (
    <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
      <span>{params.row.personal_count}</span>
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

export function RenderCellDeclarationType({ params, href }) {
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
        primary={<Typography fontSize={12}>{params.row.declaration_type}</Typography>}
        // secondary={params.row.category}
        slotProps={{
          primary: { noWrap: true },
          secondary: { sx: { color: 'text.disabled' } },
        }}
      />
    </Box>
  );
}

export function RenderCellEmployeeNumber({ params, href }) {
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
        primary={<Typography>{params.row.membership_number ?? '-'}</Typography>}
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
        primary={
          <Typography color="inherit" fontSize={12}>
            {params.row.name}
          </Typography>
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

export function RenderCellAddress({ params, href }) {
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
          <Typography color="inherit" fontSize={12}>
            {params.row.address}
          </Typography>
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
