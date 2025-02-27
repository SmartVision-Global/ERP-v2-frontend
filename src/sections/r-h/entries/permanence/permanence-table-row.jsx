import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { Typography } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';

import { RouterLink } from 'src/routes/components';

import { fDate } from 'src/utils/format-time';

import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

export function RenderCellFullname({ params }) {
  return <Typography variant="body2">LAMARA - HOSSEM</Typography>;
}
export function RenderCellType({ params }) {
  return (
    <Label variant="soft" color={params.row.publish === 'published' ? 'info' : 'default'}>
      ABSENCE AUTORISÉE NON PAYÉ
    </Label>
  );
}

export function RenderCellSite({ params }) {
  return <Typography variant="body2">ST-BERBES</Typography>;
}
export function RenderCellFunction({ params }) {
  return <Typography variant="body2">AGENT POLYVALENT NIV 2</Typography>;
}
export function RenderCellAtelier({ params }) {
  return <Typography variant="body2">AT-2</Typography>;
}
export function RenderCellDays({ params }) {
  return <Typography variant="body2">0</Typography>;
}

export function RenderCellStartAt({ params }) {
  return (
    <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
      <span>{fDate(params.row.createdAt)}</span>
    </Box>
  );
}
export function RenderCellEndAt({ params }) {
  return (
    <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
      <span>{fDate(params.row.createdAt)}</span>
    </Box>
  );
}

export function RenderCellNotes({ params }) {
  return <Typography variant="body2">A TRAVAILLE LE JOUR DE SON REPOS SAMEDI</Typography>;
}

export function RenderCellStatus({ params }) {
  return (
    <Label variant="soft" color={params.row.publish === 'published' ? 'info' : 'default'}>
      Valider
    </Label>
  );
}
export function RenderCellNature({ params }) {
  return (
    <Label variant="soft" color={params.row.publish === 'published' ? 'info' : 'default'}>
      50%
    </Label>
  );
}

export function RenderCellValideBy({ params }) {
  return <Typography variant="body2">MEZNANE ILYES</Typography>;
}

export function RenderCellExercice({ params }) {
  return <Typography variant="body2">EX-2</Typography>;
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
            {Math.floor(Math.random() * 1000) + 1}
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
