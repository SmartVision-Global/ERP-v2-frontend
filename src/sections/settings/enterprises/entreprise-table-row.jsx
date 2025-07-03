import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';

import { fDate, fTime } from 'src/utils/format-time';

import { Image } from 'src/components/image';

// ----------------------------------------------------------------------

export function RenderCellEnterprise({ params, href }) {
  return (
    <Box
      sx={{
        py: 0.5,
        gap: 1,
        width: 1,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Image
        alt={params.row?.name}
        src={params.row?.logo?.url}
        variant="rounded"
        sx={{ width: 64, height: 64, borderRadius: 1 }}
      />

      <ListItemText
        primary={<Typography fontSize={12}>{params.row.name}</Typography>}
        // secondary={`${params.row.first_name?.ar} ${params.row.last_name?.ar}`}
        slotProps={{
          primary: { noWrap: true },
          // secondary: { sx: { color: 'text.disabled', fontSize: 12 } },
        }}
      />
    </Box>
  );
}

export function RenderCellDesignation({ params }) {
  return <Typography variant="body2">{params.row?.activity}</Typography>;
}

export function RenderCellAddress({ params }) {
  return <Typography variant="body2">{params.row?.address}</Typography>;
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
    <Typography fontSize={12} fontWeight={600}>
      {params.row?.id}
    </Typography>
  );
}
