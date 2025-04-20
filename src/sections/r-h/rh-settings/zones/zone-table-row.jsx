import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { Typography } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';

import { RouterLink } from 'src/routes/components';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

export function RenderCellPrice({ params }) {
  return fCurrency(params.row.price);
}

export function RenderCellCode({ params }) {
  return <Typography variant="body2">{params.row.code}</Typography>;
}

export function RenderCellSite({ params }) {
  return <Typography variant="body2">{params.row.site_id}</Typography>;
}

export function RenderCellColor({ params }) {
  return (
    <Box
      sx={{
        width: 24,
        height: 24,
        borderRadius: '50%',
        backgroundColor: params.row.color,
      }}
    />
  );
}

export function RenderCellSurface({ params }) {
  return <Typography variant="body2">{params.row.surface}</Typography>;
}

export function RenderCellMainActivity({ params }) {
  return <Typography variant="body2">{params.row.main_activity}</Typography>;
}

export function RenderCellSafetyRules({ params }) {
  return <Typography variant="body2">{params.row.safety_rules}</Typography>;
}

export function RenderCellName({ params }) {
  return (
    <Label variant="soft" color={params.row.publish === 'published' ? 'info' : 'default'}>
      {params.row.name}
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
