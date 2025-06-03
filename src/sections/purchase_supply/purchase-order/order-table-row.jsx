import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { Avatar, Typography } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';

import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';

const STATUS = {
  1: 'En cours',
  2: 'Actif',
  3: 'Bloquer',
};
const ORDER_TYPE = {};

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
export function RenderCellTemp({ params }) {
  return (
    <Label variant="soft" color="default">
      {params.row.temp}
    </Label>
  );
}
export function RenderCellStatus({ params }) {
  return (
    <Label
      variant="soft"
      color={params.row.status === 1 ? 'info' : params.row.status === 2 ? 'success' : 'error'}
    >
      {STATUS[params.row.status]}
    </Label>
  );
}
export function RenderCellBEB({ params }) {
  return fCurrency(params.row.beb);
}
export function RenderCellSite({ params }) {
  return <Typography fontSize={14}>{params.row.site?.name}</Typography>;
}
export function RenderCellPriority({ params }) {
  return (
    <Label variant="soft" color="default">
      {params.row.priority}
    </Label>
  );
}
export function RenderCellType({ params }) {
  return (
    <Label variant="soft" color="default">
      {/* {params.row.publish} */}
      {ORDER_TYPE[params.row.type]}
    </Label>
  );
}
