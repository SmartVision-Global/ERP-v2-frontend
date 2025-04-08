import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { Avatar, Typography } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';
import LinearProgress from '@mui/material/LinearProgress';

import { RouterLink } from 'src/routes/components';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

export function RenderCellPrice({ params }) {
  return fCurrency(params.row.price);
}

export function RenderCellPublish({ params }) {
  return (
    <Label variant="soft" color={params.row.publish === 'published' ? 'error' : 'default'}>
      {params.row.publish === 'published' ? 'Actif' : 'Bloquer'}
    </Label>
  );
}

export function RenderCellSex({ params }) {
  return (
    <Label variant="soft" color={params.row.publish === 'published' ? 'default' : 'default'}>
      Homme
    </Label>
  );
}

export function RenderCellContract({ params }) {
  return (
    <Label variant="soft" color={params.row.publish === 'published' ? 'info' : 'default'}>
      {/* {params.row.publish} */}
      {params.row.publish === 'published' ? 'CDI' : 'CDD'}
    </Label>
  );
}

export function RenderCellCreatedAt({ params }) {
  return (
    <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
      <span>{fDate(params.row.createdAt)}</span>
      {/* <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
        {fTime(params.row.createdAt)}
      </Box> */}
    </Box>
  );
}

export function RenderCellExpiration({ params }) {
  return (
    <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
      <span>{fDate(params.row.createdAt)}</span>
      {/* <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
        {fTime(params.row.createdAt)}
      </Box> */}
    </Box>
  );
}

export function RenderCellStock({ params }) {
  return (
    <Box sx={{ width: 1, typography: 'caption', color: 'text.secondary' }}>
      <LinearProgress
        value={(params.row.available * 100) / params.row.quantity}
        variant="determinate"
        color={
          (params.row.inventoryType === 'out of stock' && 'error') ||
          (params.row.inventoryType === 'low stock' && 'warning') ||
          'success'
        }
        sx={{ mb: 1, height: 6, width: 80 }}
      />
      {!!params.row.available && params.row.available} {params.row.inventoryType}
    </Box>
  );
}

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
        primary={<Typography fontSize={14}>Amar amour</Typography>}
        secondary="عمار عمور"
        slotProps={{
          primary: { noWrap: true },
          secondary: { sx: { color: 'text.disabled', fontSize: 14 } },
        }}
      />
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
            {Math.floor(Math.random() * 100) + 1}
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

export function RenderCellCompany({ params, href }) {
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
          <Typography color="inherit" fontSize={14}>
            SARL ELDIOUANE IMPORT EXPORT
          </Typography>
        }
        // secondary={params.row.category}
        slotProps={{
          primary: { noWrap: true },
          secondary: { sx: { color: 'text.disabled', fontSize: 12 } },
        }}
      />
    </Box>
  );
}

export function RenderCellSite({ params, href }) {
  return <Typography fontSize={14}>ST-ORAN</Typography>;
}

export function RenderCellFunction({ params, href }) {
  return <Typography fontSize={14}>AGENT POLYVALENT NIV 1</Typography>;
}

export function RenderCellPostalCode({ params, href }) {
  return <Typography fontSize={14}>19000</Typography>;
}

export function RenderCellBlood({ params, href }) {
  return <Typography fontSize={14}>O+</Typography>;
}

export function RenderCellNationality({ params, href }) {
  return <Typography fontSize={14}>Algérienne</Typography>;
}

export function RenderCellBirthday({ params }) {
  return (
    <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
      <span>{fDate('12/12/1995')}</span>
      {/* <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
        {fTime(params.row.createdAt)}
      </Box> */}
    </Box>
  );
}

export function RenderCellBirthLocation({ params, href }) {
  return <Typography fontSize={14}>Alger</Typography>;
}

export function RenderCellMilitary({ params }) {
  return (
    <Label variant="soft" color={params.row.publish === 'published' ? 'info' : 'default'}>
      {/* {params.row.publish} */}
      {params.row.publish === 'published' ? 'Accompli' : 'Sourcis'}
    </Label>
  );
}

export function RenderCellNss({ params, href }) {
  return <Typography fontSize={14}>123451241556251</Typography>;
}

export function RenderCellAdress({ params, href }) {
  return <Typography fontSize={14}>Rue 11 decembre 1960 n4</Typography>;
}

export function RenderCellFamilySituation({ params }) {
  return (
    <Label variant="soft" color={params.row.publish === 'published' ? 'warning' : 'default'}>
      {/* {params.row.publish} */}
      {params.row.publish === 'published' ? 'Célibataire' : 'Marié'}
    </Label>
  );
}

export function RenderCellLieu({ params, href }) {
  return <Typography fontSize={14}>Alger</Typography>;
}
export function RenderCellDepartment({ params, href }) {
  return <Typography fontSize={14}>Production</Typography>;
}
export function RenderCellDirection({ params, href }) {
  return <Typography fontSize={14}>Direction Générale</Typography>;
}
export function RenderCellFiliale({ params, href }) {
  return <Typography fontSize={14}>ELDIOUANE IMP-EXP</Typography>;
}
export function RenderCellSection({ params, href }) {
  return <Typography fontSize={14}>Equipe A</Typography>;
}
export function RenderCellAtelier({ params, href }) {
  return <Typography fontSize={14}>Equipe A</Typography>;
}

export function RenderCellPaymantType({ params }) {
  return (
    <Label variant="soft" color={params.row.publish === 'published' ? 'warning' : 'default'}>
      {/* {params.row.publish} */}
      {params.row.publish === 'published' ? 'Virement' : 'Especes'}
    </Label>
  );
}

export function RenderCellBanq({ params }) {
  return (
    <Label variant="soft" color="default">
      {/* {params.row.publish} */}
      {params.row.publish === 'published' ? 'CPA' : 'BNA'}
    </Label>
  );
}

export function RenderCellRib({ params, href }) {
  return <Typography fontSize={14}>12345678911234567892</Typography>;
}

export function RenderCellTeamType({ params, href }) {
  return <Typography fontSize={14}>Surface</Typography>;
}

export function RenderCellGrid({ params, href }) {
  return <Typography fontSize={14}>AGENT-POLYVALENT-NIV-1-SRF-1</Typography>;
}

export function RenderCellPhone({ params, href }) {
  return <Typography fontSize={14}>0777777777</Typography>;
}
