import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import { Box, Chip, Tooltip, Typography } from '@mui/material';

// ----------------------------------------------------------------------

export function RenderCellCode({ params }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Typography variant="body2">{params.row.code}</Typography>
    </Box>
  );
}

// ----------------------------------------------------------------------

export function RenderCellObservation({ params }) {
  return (
    <Tooltip title={params.row.observation || ''}>
      <Typography variant="body2" noWrap>
        {params.row.observation}
      </Typography>
    </Tooltip>
  );
}

// ----------------------------------------------------------------------

export function RenderCellTaker({ params }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Typography variant="body2">{params.row.taker}</Typography>
    </Box>
  );
}

// ----------------------------------------------------------------------

export function RenderCellStore({ params }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Typography variant="body2">{params.row.store_name}</Typography>
    </Box>
  );
}

// ----------------------------------------------------------------------

export function RenderCellState({ params }) {
  const getStateColor = (state) => {
    switch (state) {
      case 'pending':
        return 'warning';
      case 'validated':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStateLabel = (state) => {
    switch (state) {
      case 'pending':
        return 'En attente';
      case 'validated':
        return 'Validé';
      case 'rejected':
        return 'Rejeté';
      default:
        return state;
    }
  };

  return (
    <Chip
      label={getStateLabel(params.row.state)}
      color={getStateColor(params.row.state)}
      size="small"
    />
  );
}

// ----------------------------------------------------------------------

export function RenderCellBEB({ params }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Typography variant="body2">{params.row.beb}</Typography>
    </Box>
  );
}

// ----------------------------------------------------------------------

export function RenderCellCreatedAt({ params }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Typography variant="body2">
        {params.row.created_at
          ? format(new Date(params.row.created_at), 'dd MMM yyyy HH:mm', { locale: fr })
          : '-'}
      </Typography>
    </Box>
  );
}

// ----------------------------------------------------------------------

export function RenderCellCreatedBy({ params }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Typography variant="body2">{params.row.created_by || '-'}</Typography>
    </Box>
  );
}

// ----------------------------------------------------------------------

export function RenderCellValidatedBy({ params }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Typography variant="body2">{params.row.validated_by || '-'}</Typography>
    </Box>
  );
}
