import { forwardRef } from 'react';

import { MenuItem, ListItemIcon, Link } from '@mui/material';

import { RouterLink } from 'src/routes/components';

export const GridActionsLinkItem = forwardRef((props, ref) => {
    const { href, label, icon, sx } = props;
  
    return (
      <MenuItem ref={ref} sx={sx}>
        <Link
          component={RouterLink}
          href={href}
          underline="none"
          color="inherit"
          sx={{ width: 1, display: 'flex', alignItems: 'center' }}
        >
          {icon && <ListItemIcon>{icon}</ListItemIcon>}
          {label}
        </Link>
      </MenuItem>
    );
  });
  