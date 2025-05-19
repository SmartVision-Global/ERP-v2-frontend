import Box from '@mui/material/Box';

import { createEntity, updateEntity } from 'src/actions/settings/identification/raw-materials';

import { ParamItem } from './param-item';

// ----------------------------------------------------------------------

// Configuration for all parameter types
const PARAMETERS_CONFIG = [
  {
    key: 'categories',
    title: 'Catégories',
    icon: 'carbon:categories',
    label: 'category',
    uuid: '1',
    group: 1,
    canAdd: true,
  },
  {
    key: 'returnPatterns',
    title: 'Motifs de réintégration',
    icon: 'oui:integration-general',
    label: 'returnPattern',
    uuid: '2',
    group: 1,
    nature: 1,
    canAdd: true,
  },
  
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
          label={config.label}
          nature={config.nature}
          group={config.group}
          data={data?.[config.key] || []}
          icon={config.icon}
          uuid={config.uuid}
          canAdd={config.canAdd}
          onCreate={(itemData) => createEntity(config.key, itemData)}
          onUpdate={(id, itemData) => updateEntity(config.key, id, itemData)}
        />
      ))}
    </Box>
  );
}
