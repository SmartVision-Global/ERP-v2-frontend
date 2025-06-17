import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { Avatar, Typography } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';

import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';
import { fDate, fTime, daysToNow } from 'src/utils/format-time';

import { Label } from 'src/components/label';

const BLOOD_TYPE = {
  1: 'A+',
  2: 'B+',
  3: 'AB+',
  4: 'O+',
  5: 'A-',
  6: 'B-',
  7: 'AB-',
  8: 'O-',
};

const NATIONAL_SERVICE = {
  1: 'Accompli',
  2: 'Dégage',
  3: 'Sourcie',
  4: 'Autre',
};

const FAMILY_SITUATION = {
  1: 'Célibataire',
  2: 'Divorcé',
  3: 'Marié',
  4: 'Veuf',
};
const PAYMENT_TYPE = {
  1: 'Virement',
  2: 'Especes',
  3: 'Autre',
};

const JOB_REGIME = {
  1: 'poste',
  2: 'surface',
};

const STATUS = {
  1: 'En cours',
  2: 'Actif',
  3: 'Bloquer',
};

// ----------------------------------------------------------------------

const GENDER = {
  1: 'Homme',
  2: 'Femme',
};

const CONTRACT_TYPE = {
  1: 'CDD',
  2: 'CDI',
  3: 'Autre',
};

export function RenderCellPrice({ params }) {
  return fCurrency(params.row.salary_grid?.salary);
}

export function RenderCellPublish({ params }) {
  return (
    <Label variant="soft" color={params.row.publish === 'published' ? 'error' : 'default'}>
      {params.row.publish === 'published' ? 'Actif' : 'Bloquer'}
    </Label>
  );
}
export function RenderCellStatus({ params }) {
  return (
    <Label
      variant="soft"
      color={params.row.status === 1 ? 'info' : params.row.status === 2 ? 'success' : 'error'}
    >
      {STATUS[params.row.status]}
    </Label>
  );
}

export function RenderCellSex({ params }) {
  return (
    <Label variant="soft" color={params.row.gender === '1' ? 'default' : 'default'}>
      {GENDER[params.row.gender]}
    </Label>
  );
}

export function RenderCellContract({ params }) {
  const daysToEndContract = daysToNow(params.row.to_date);
  return (
    <Label
      variant="soft"
      color={
        params.row.contract_type === '1'
          ? 'info'
          : params.row.contract_type === '2'
            ? 'warning'
            : 'default'
      }
      sx={
        params.row.contract_type == '1' && daysToEndContract < 10
          ? {
              // Add an animated background / border / color pulse
              animation: 'pulse 1.5s infinite',
              '@keyframes pulse': {
                '0%': {
                  boxShadow: '0 0 0 0 rgba(25, 118, 210, 0.7)',
                },
                '70%': {
                  boxShadow: '0 0 0 10px rgba(25, 118, 210, 0)',
                },
                '100%': {
                  boxShadow: '0 0 0 0 rgba(25, 118, 210, 0)',
                },
              },
            }
          : {}
      }
    >
      {CONTRACT_TYPE[params.row.contract_type]}
    </Label>
  );
}
export function RenderCellServiceStart({ params }) {
  return (
    <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
      <span>{fDate(params.row.service_start)}</span>
      {/* <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
        {fTime(params.row.createdAt)}
      </Box> */}
    </Box>
  );
}

export function RenderCellServiceEnd({ params }) {
  return (
    <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
      <span>{params.row.service_end ? fDate(params.row.service_end) : '-'}</span>
      {/* <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
        {fTime(params.row.createdAt)}
      </Box> */}
    </Box>
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

export function RenderCellUpdatedAt({ params }) {
  return (
    <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
      <span>{fDate(params.row.created_at)}</span>
      <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
        {fTime(params.row.updated_at)}
      </Box>
    </Box>
  );
}

export function RenderCellExpiration({ params }) {
  return (
    <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
      {/* {params.row.service_end ? fDate(params.row.service_end):-} */}
      <span>{params.row.service_end ? fDate(params.row.service_end) : '-'}</span>
      {/* <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
        {fTime(params.row.createdAt)}
      </Box> */}
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
        alt={params.row?.first_name?.fr}
        src={params.row?.photo?.url}
        variant="rounded"
        sx={{ width: 34, height: 34, borderRadius: '50%' }}
      />

      <ListItemText
        primary={
          <Typography
            fontSize={12}
          >{`${params.row.first_name?.fr} ${params.row.last_name?.fr}`}</Typography>
        }
        secondary={`${params.row.first_name?.ar} ${params.row.last_name?.ar}`}
        slotProps={{
          primary: { noWrap: true },
          secondary: { sx: { color: 'text.disabled', fontSize: 12 } },
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
          <Typography color="inherit" fontSize={12}>
            {params.row.enterprise?.name}
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
  return <Typography fontSize={12}>{params.row.site?.name}</Typography>;
}

export function RenderCellFunction({ params, href }) {
  return <Typography fontSize={12}>{params.row.job?.name}</Typography>;
}

export function RenderCellPostalCode({ params, href }) {
  return <Typography fontSize={14}>19000</Typography>;
}

export function RenderCellBlood({ params, href }) {
  return <Typography fontSize={14}>{BLOOD_TYPE[params.row.blood_group]}</Typography>;
}

export function RenderCellNationality({ params, href }) {
  return <Typography fontSize={14}>{params.row.nationality?.name}</Typography>;
}

export function RenderCellBirthday({ params }) {
  return (
    <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
      <span>{fDate(params.row.birth_date)}</span>
    </Box>
  );
}

export function RenderCellBirthLocation({ params, href }) {
  return <Typography fontSize={14}>{params.row?.birth_place.fr}</Typography>;
}

export function RenderCellMilitary({ params }) {
  return (
    <Label variant="soft" color={params.row.publish === 'published' ? 'info' : 'default'}>
      {/* {params.row.publish} */}
      {NATIONAL_SERVICE[params.row.national_service_situation]}
    </Label>
  );
}

export function RenderCellNss({ params, href }) {
  return <Typography fontSize={14}>{params.row.social_security_number}</Typography>;
}

export function RenderCellAdress({ params, href }) {
  return <Typography fontSize={14}>{params.row?.address.fr}</Typography>;
}

export function RenderCellFamilySituation({ params }) {
  return (
    <Label variant="soft" color="default">
      {/* {params.row.publish} */}
      {FAMILY_SITUATION[params.row.family_situation]}
    </Label>
  );
}

export function RenderCellLieu({ params, href }) {
  return <Typography fontSize={14}>Alger</Typography>;
}
export function RenderCellDepartment({ params, href }) {
  return <Typography fontSize={14}>{params.row.department?.name}</Typography>;
}
export function RenderCellDirection({ params, href }) {
  return <Typography fontSize={14}>{params.row.direction?.name}</Typography>;
}
export function RenderCellFiliale({ params, href }) {
  return <Typography fontSize={14}>{params.row.subsidiary?.name}</Typography>;
}
export function RenderCellSection({ params, href }) {
  return <Typography fontSize={14}>{params.row.section?.name}</Typography>;
}
export function RenderCellAtelier({ params, href }) {
  return <Typography fontSize={14}>{params.row.workshop?.name}</Typography>;
}

export function RenderCellPaymantType({ params }) {
  return (
    <Label variant="soft" color="default">
      {/* {params.row.publish} */}
      {PAYMENT_TYPE[params.row.payment_type]}
    </Label>
  );
}

export function RenderCellBanq({ params }) {
  return (
    <Label variant="soft" color="default">
      {/* {params.row.publish} */}
      {params.row.bank?.name ?? '-'}
    </Label>
  );
}

export function RenderCellRib({ params, href }) {
  return <Typography fontSize={14}>{params.row.rib ?? '-'}</Typography>;
}

export function RenderCellTeamType({ params, href }) {
  return <Typography fontSize={14}>{JOB_REGIME[params.row.job_regime]}</Typography>;
}

export function RenderCellGrid({ params, href }) {
  return <Typography fontSize={14}>{params.row.salary_grid?.code}</Typography>;
}

export function RenderCellPhone({ params, href }) {
  return <Typography fontSize={14}>{params.row.phone}</Typography>;
}

export function RenderCellContractStartAt({ params }) {
  return (
    <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
      <span>{fDate(params.row.from_date)}</span>
      {/* <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
        {fTime(params.row.created_at)}
      </Box> */}
    </Box>
  );
}

export function RenderCellContractEndAt({ params }) {
  return (
    <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
      <span>{params.row.to_date ? fDate(params.row.to_date) : '-'}</span>
      {/* <span>To now :{daysToNow(params.row.to_date)}</span> */}
      {/* <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
        {fTime(params.row.created_at)}
      </Box> */}
    </Box>
  );
}
