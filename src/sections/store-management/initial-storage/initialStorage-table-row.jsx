import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
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

export function RenderCellMagasin({ params }) {
  return <Typography variant="body2">{params.row.store_id || '-'}</Typography>;
}

export function RenderCellSite({ params }) {
  return <Typography variant="body2">{params.row.site?.designation || '-'}</Typography>;
}

export function RenderCellItems({ params }) {
  if (!params.row.items?.length) {
    return <Typography variant="body2">-</Typography>;
  }

  return (
    <Stack spacing={0.5}>
      {params.row.items.map((item, index) => (
        <Tooltip
          key={index}
          title={`PMP: ${item.pmp} | Quantité: ${item.quantity}`}
          arrow
          placement="top"
        >
          <Box>
            <Typography variant="body2" noWrap>
              {item.designation || item.product_id}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              Lot: {item.lot}
            </Typography>
          </Box>
        </Tooltip>
      ))}
    </Stack>
  );
}

export function RenderCellStore({ params }) {
  return <Typography variant="body2">{params.row.store || '-'}</Typography>;
}

export function RenderCellEntrepot({ params }) {
  return <Typography variant="body2">{params.row.code || '-'}</Typography>;
}

export function RenderCellObservation({ params }) {
  return <Typography variant="body2">{params.row.designation || '-'}</Typography>;
}

export function RenderCellCreatedAt({ params }) {
  if (!params.row.createdAt) {
    return <Typography variant="body2">-</Typography>;
  }

  return (
    <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
      <Typography variant="body2">{fDate(params.row.createdAt)}</Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        {fTime(params.row.createdAt)}
      </Typography>
    </Box>
  );
}
