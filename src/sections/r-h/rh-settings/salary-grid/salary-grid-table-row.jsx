import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { Typography } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';

import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

export function RenderCellPrice({ params }) {
  return fCurrency(params.row.price);
}

export function RenderCellSumContributor({ params }) {
  return <Typography variant="body2">{params.row.contributory_salary}</Typography>;
}
export function RenderCellSalary({ params }) {
  return <Typography variant="body2">{params.row.salary}</Typography>;
}

export function RenderCellPostSalary({ params }) {
  return <Typography variant="body2">{params.row.post_salary}</Typography>;
}

export function RenderCellSumTaxable({ params }) {
  return <Typography variant="body2">{params.row.taxable_wages}</Typography>;
}

export function RenderCellIrg({ params }) {
  return <Typography variant="body2">{params.row.retenueIRG}</Typography>;
}

export function RenderCellBaseSalary({ params }) {
  return <Typography variant="body2">{params.row.salary}</Typography>;
}
export function RenderCellNetSalary({ params }) {
  return <Typography variant="body2">{params.row.net_salary}</Typography>;
}
export function RenderCellNetSalaryPayable({ params }) {
  return <Typography variant="body2">{params.row.net_salary_payable}</Typography>;
}

export function RenderCellCode({ params }) {
  return (
    <Label variant="soft" color={params.row.publish === 'published' ? 'info' : 'default'}>
      {params.row.code}
    </Label>
  );
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

export function RenderCellDesignation({ params }) {
  return (
    <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
      <span>{params.row.designation}</span>
    </Box>
  );
}
export function RenderCellEchelle({ params }) {
  return (
    <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
      <span>{params.row.rung?.name}</span>
    </Box>
  );
}

export function RenderCellCategorySocio({ params }) {
  return (
    <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
      <span>{params.row.salary_category?.name}</span>
    </Box>
  );
}
export function RenderCellLevel({ params }) {
  return (
    <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
      <span>{params.row.salary_scale_level?.name}</span>
    </Box>
  );
}

export function RenderCellId({ params, href }) {
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
        primary={
          <Link component={RouterLink} href={href} color="inherit">
            {params.row.id}
          </Link>
        }
        // secondary={params.row.category}
        slotProps={{
          primary: { noWrap: true },
          secondary: { sx: { color: 'text.disabled' } },
        }}
      />
    </Box>
  );
}
