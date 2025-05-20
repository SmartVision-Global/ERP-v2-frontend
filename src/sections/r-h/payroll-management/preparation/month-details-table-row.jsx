import { Box, Avatar, Typography, ListItemText } from '@mui/material';

export function RenderCellUser({ params, href }) {
  return (
    <Box
      sx={{
        py: 0,
        gap: 1,
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
          <Typography
            fontSize={14}
          >{`${params.row.first_name?.fr} ${params.row.last_name?.fr}`}</Typography>
        }
        secondary={`${params.row.first_name?.ar} ${params.row.last_name?.ar}`}
        slotProps={{
          primary: { noWrap: true },
          secondary: { sx: { color: 'text.disabled', fontSize: 14 } },
        }}
      />
    </Box>
  );
}
