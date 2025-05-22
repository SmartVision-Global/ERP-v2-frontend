import Box from '@mui/material/Box';

import { createEntity, updateEntity } from 'src/actions/settings/identification/global';

import { ParamItem } from './param-item';

// ----------------------------------------------------------------------

// Configuration for all parameter types
const PARAMETERS_CONFIG = [
  {
    key: 'measurement_units',
    title: 'Unités de mesure',
    icon: 'mdi:ruler',
    uuid: '1',
    canAdd: true,
  },
  {
    key: 'services',
    title: 'Services',
    icon: 'mdi:cog-outline',
    uuid: '2',
    canAdd: true,
  },
  {
    key: 'calibers',
    title: 'Calibres',
    icon: 'mdi:ruler-square',
    uuid: '4',
    canAdd: true,
  },
  {
    key: 'conditionings',
    title: 'Conditionnements',
    icon: 'mdi:package-variant-closed',
    uuid: '5',
    canAdd: true,
  },
  {
    key: 'dimensions',
    title: 'Dimensions',
    icon: 'tabler:dimensions',
    uuid: '6',
    canAdd: true,
  },
  {
    key: 'sectors',
    title: 'Secteurs',
    icon: 'mdi:domain',
    uuid: '7',
    canAdd: true,
  },
  {
    key: 'customer_files',
    title: 'Dossiers clients',
    icon: 'mdi:folder-account',
    uuid: '8',
    canAdd: true,
  },
  {
    key: 'erp_needs',
    title: 'Besoins ERP',
    icon: 'mdi:cube-outline',
    uuid: '9',
    canAdd: true,
  },
  {
    key: 'expense_measurements',
    title: 'Mesures de dépenses',
    icon: 'mdi:cash-register',
    uuid: '10',
    canAdd: true,
  },
  {
    key: 'expenses',
    title: 'Dépenses',
    icon: 'mdi:cash',
    uuid: '11',
    canAdd: true,
  },
  {
    key: 'files',
    title: 'Fichiers',
    icon: 'mdi:file-document-outline',
    uuid: '12',
    canAdd: true,
  },
  {
    key: 'product_conditionings',
    title: 'Conditionnements produits',
    icon: 'mdi:package',
    uuid: '13',
    canAdd: true,
  },
  {
    key: 'product_measurement_units',
    title: 'Unités de mesure produits',
    icon: 'mdi:ruler-square',
    uuid: '14',
    canAdd: true,
  },
  {
    key: 'type_interfaces',
    title: 'Types d\'interfaces',
    icon: 'mdi:view-dashboard-outline',
    uuid: '15',
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
