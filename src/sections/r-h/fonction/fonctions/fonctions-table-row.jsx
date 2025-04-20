import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { Typography } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';

import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

export function RenderCellPrice({ params }) {
  return fCurrency(params.row.price);
}

export function RenderCellName({ params }) {
  return <Typography variant="body2">{params.row.name}</Typography>;
}

export function RenderCellSite({ params }) {
  return <Typography variant="body2">{params.row.site_id}</Typography>;
}

export function RenderCellAmount({ params }) {
  return <Typography variant="body2">{params.row.premium_amount}</Typography>;
}
export function RenderCellKeyPost({ params }) {
  return (
    <Label variant="soft" color={params.row.publish === 'published' ? 'primary' : 'warning'}>
      {params.row.key_post ? 'Oui' : 'Nom'}
      {/* {params.row.have_premium} */}
    </Label>
  );
}

export function RenderCellPresentPrime({ params }) {
  return (
    <Label variant="soft" color={params.row.publish === 'published' ? 'primary' : 'warning'}>
      {params.row.have_premium ? 'Oui' : 'Nom'}
      {/* {params.row.have_premium} */}
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
export function RenderCellStatus({ params }) {
  return (
    <Label variant="soft" color={params.row.publish === 'published' ? 'warning' : 'warning'}>
      {params.row.status === 1 ? 'En cours' : 'En cours'}
    </Label>
  );
}
