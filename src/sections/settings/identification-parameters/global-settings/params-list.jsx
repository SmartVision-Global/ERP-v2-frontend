import Box from '@mui/material/Box';

import { createMeasurementUnit, updateMeasurementUnit } from 'src/actions/settings/identification/global';

import { ParamItem } from './param-item';


// ----------------------------------------------------------------------

export function ParamsList({ data }) {

  return (
    <Box
      sx={{
        gap: 2,
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
      }}
    >
      {/* measurement units */}
      <ParamItem
        title="Unités de mesure"
        data={data?.measurement_units}
        icon="mdi:ruler"
        uuid="1"
        canAdd
        onCreate={createMeasurementUnit}
        onUpdate={updateMeasurementUnit}
      />
      
    </Box>
  );
}
