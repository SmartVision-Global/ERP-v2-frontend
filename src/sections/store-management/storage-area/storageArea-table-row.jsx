import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { Typography } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';

import { RouterLink } from 'src/routes/components';

import { fDate, fTime } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export function RenderCellId({ params, href }) {
  return (
    <ListItemText
      primary={
        <Link component={RouterLink} href={href} color="inherit">
          {params.row.id}
        </Link>
      }
    />
  );
}

export function RenderCellSite({ params }) {
  return <Typography variant="body2">{params.row.site?.name || '-'}</Typography>;
}

export function RenderCellMagasin({ params }) {
  return <Typography variant="body2">{params.row.magazin || '-'}</Typography>;
}

export function RenderCellEntrepot({ params }) {
  return <Typography variant="body2">{params.row.entrepot || '-'}</Typography>;
}

export function RenderCellObservation({ params }) {
  return <Typography variant="body2">{params.row.observation || '-'}</Typography>;
}

export function RenderCellCreatedAt({ params }) {
  return (
    <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
      <Typography variant="body2">{fDate(params.row.createdAt)}</Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        {fTime(params.row.createdAt)}
      </Typography>
    </Box>
  );
}
