import { useMemo } from 'react';

import Box from '@mui/material/Box';

import { useTranslate } from 'src/locales';
import { createEntity, updateEntity } from 'src/actions/purchase-supply/settings/settings';

import { ParamItem } from './param-item';
// ----------------------------------------------------------------------

// Configuration for all parameter types
const PARAMETERS_CONFIG = (t) => [
  {
    key: 'charge_types',
    title: t('headers.charge_types'),
    icon: 'vscode-icons:file-type-inc',
    uuid: '1',
    canAdd: true,
  },
  
];

export function ParamsList({ data }) {
  const { t } = useTranslate('purchase-supply-module');
  const PARAMETERS_CONFIG_ = useMemo(() => PARAMETERS_CONFIG(t), [t]);
  return (
    <Box
      sx={{
        gap: 2,
        display: 'grid',
        
        gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(2, 1fr)' },
      }}
    >
      {PARAMETERS_CONFIG_.map((config) => (
        <ParamItem
          key={config.key}
          name={config.key}
          title={config.title}
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
