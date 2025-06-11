import { Box, Typography, ListItemText } from '@mui/material';

import { fCurrency } from 'src/utils/format-number';

import { Label } from 'src/components/label';

export function RenderCellEmployeeNumber({ params, href }) {
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
        primary={<Typography fontSize={12}>{params.row.membership_number ?? '-'}</Typography>}
        // secondary={params.row.category}
        slotProps={{
          primary: { noWrap: true },
          secondary: { sx: { color: 'text.disabled' } },
        }}
      />
    </Box>
  );
}

export function RenderCellYearRef({ params }) {
  return (
    <Label variant="soft" color="info">
      {params.row.year}
    </Label>
  );
}

export function RenderCellPersonalSSN({ params }) {
  return <Typography fontSize={12}>{params.row.personal_ssn}</Typography>;
}

export function RenderCellPersonalName({ params }) {
  return <Typography fontSize={12}>{params.row.personal_name}</Typography>;
}

export function RenderCellPersonalBirthDate({ params }) {
  return <Typography fontSize={12}>{params.row.personal_birth_date}</Typography>;
}

export function RenderCellW1Total({ params }) {
  return <Typography fontSize={12}>{params.row.w1_total}</Typography>;
}

export function RenderCellW2Total({ params }) {
  return <Typography fontSize={12}>{params.row.w2_total}</Typography>;
}
export function RenderCellW3Total({ params }) {
  return <Typography fontSize={12}>{params.row.w3_total}</Typography>;
}
export function RenderCellW4Total({ params }) {
  return <Typography fontSize={12}>{params.row.w4_total}</Typography>;
}

export function RenderCellQ1Total({ params }) {
  return <Typography fontSize={12}>{fCurrency(params.row.q1_total)}</Typography>;
}

export function RenderCellQ2Total({ params }) {
  return <Typography fontSize={12}>{fCurrency(params.row.q2_total)}</Typography>;
}
export function RenderCellQ3Total({ params }) {
  return <Typography fontSize={12}>{fCurrency(params.row.q3_total)}</Typography>;
}
export function RenderCellQ4Total({ params }) {
  return <Typography fontSize={12}>{fCurrency(params.row.q4_total)}</Typography>;
}

export function RenderCellTotal({ params }) {
  return (
    <Typography fontSize={12}>
      {fCurrency(
        params.row.q1_total + params.row.q2_total + params.row.q3_total + params.row.q4_total
      )}
    </Typography>
  );
}

export function RenderCellJ1({ params }) {
  return <Typography fontSize={12}>{params.row.J1}</Typography>;
}

export function RenderCellJ2({ params }) {
  return <Typography fontSize={12}>{params.row.J2}</Typography>;
}
export function RenderCellJ3({ params }) {
  return <Typography fontSize={12}>{params.row.J3}</Typography>;
}
export function RenderCellJ4({ params }) {
  return <Typography fontSize={12}>{params.row.J4}</Typography>;
}

export function RenderCellPersonalStartService({ params }) {
  return <Typography fontSize={12}>{params.row.personal_service_start}</Typography>;
}

export function RenderCellPersonalEndService({ params }) {
  return <Typography fontSize={12}>{params.row.personal_service_end ?? '-'}</Typography>;
}
