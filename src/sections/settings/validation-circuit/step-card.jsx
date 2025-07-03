import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

// ----------------------------------------------------------------------

export function StepCard({ step, index }) {
  const { name, description, required_approvals, users, order } = step;

  return (
    <Card>
      <Stack direction="row" alignItems="center" sx={{ p: 3 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            flexShrink: 0,
            display: 'flex',
            borderRadius: '50%',
            alignItems: 'center',
            justifyContent: 'center',
            border: (theme) => `solid 1px ${theme.palette.grey[500]}`,
          }}
        >
          <Typography variant="h6">{index}</Typography>
        </Box>
      </Stack>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Box sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ pb: 2 }}>
          <Typography variant="subtitle2" sx={{ width: '30%' }}>
            Approver
          </Typography>
          <Typography variant="subtitle2" sx={{ width: '25%' }}>
            Step Name
          </Typography>
          <Typography variant="subtitle2" sx={{ width: '25%' }}>
            Description
          </Typography>
          <Typography variant="subtitle2" sx={{ width: '10%', textAlign: 'center' }}>
            Order
          </Typography>
          <Typography variant="subtitle2" sx={{ width: '10%', textAlign: 'center' }}>
            Required
          </Typography>
        </Stack>

        <Stack spacing={2}>
          {users.map((user) => (
            <Stack key={user.id} direction="row" alignItems="center" spacing={2}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '30%' }}>
                <Avatar alt={user.username} src={user.avatarUrl} />
                <ListItemText
                  primary={user.username}
                  secondary={user.full_name}
                  primaryTypographyProps={{ typography: 'subtitle2' }}
                  secondaryTypographyProps={{ component: 'span', typography: 'caption' }}
                />
              </Stack>

              <Typography variant="body2" sx={{ width: '25%' }}>
                {name}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', width: '25%' }}>
                {description}
              </Typography>
              <Typography variant="body2" sx={{ width: '10%', textAlign: 'center' }}>
                {order}
              </Typography>
              <Typography variant="body2" sx={{ width: '10%', textAlign: 'center' }}>
                {required_approvals}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Box>
    </Card>
  );
}

StepCard.propTypes = {
  index: PropTypes.number,
  step: PropTypes.object,
}; 