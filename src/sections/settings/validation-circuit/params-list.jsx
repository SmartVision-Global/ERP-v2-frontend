import Box from '@mui/material/Box';

import { createEntity, updateEntity } from 'src/actions/settings/identification/global';

import { ParamItem } from './param-item';

// ----------------------------------------------------------------------

// Configuration for all parameter types
const PARAMETERS_CONFIG = [
  {
    key: 'transfer_slip',
    title: 'Transfer Slip',
    uuid: '1',
    canAdd: true,
  }
  
];

export function ParamsList({ data }) {
  return (
    <Box
      sx={{
        gap: 2,
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
      }}
    >
      {PARAMETERS_CONFIG.map((config) => (
        <ParamItem
          key={config.key}
          name={config.key}
          title={config.title}
          data={data}
          uuid={config.uuid}
          canAdd={config.canAdd}
          onCreate={(itemData) => createEntity(config.key, itemData)}
          onUpdate={(id, itemData) => updateEntity(config.key, id, itemData)}
        />
      ))}
    </Box>
  );
}
