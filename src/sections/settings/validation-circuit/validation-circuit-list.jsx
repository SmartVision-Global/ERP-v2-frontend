import Box from '@mui/material/Box';

import { ValidationCircuitItem } from './validation-circuit-item';

// ----------------------------------------------------------------------

// Configuration for all parameter types
const VALIDATION_CIRCUIT_CONFIG = [
  {
    key: 'transfer_slip',
    title: 'Transfer Slip',
    uuid: '1',
  }
  
];

export function ValidationCircuitList({ data }) {
  return (
    <Box
      sx={{
        gap: 2,
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
      }}
    >
      {VALIDATION_CIRCUIT_CONFIG.map((config) => (
        <ValidationCircuitItem
          key={config.key}
          name={config.key}
          title={config.title}
          data={data}
          uuid={config.uuid}
        />
      ))}
    </Box>
  );
}
