import { useCallback } from 'react';

import Box from '@mui/material/Box';

import { paths } from 'src/routes/paths';

import { ParamItem } from './param-item';

// ----------------------------------------------------------------------

export function JobList({ jobs }) {
  const handleDelete = useCallback((id) => {
    console.info('DELETE', id);
  }, []);

  return (
    <>
      <Box
        sx={{
          gap: 3,
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        }}
      >
        {jobs.map((job) => (
          <ParamItem
            key={job.id}
            job={job}
            editHref={paths.dashboard.rh.rhSettings.root}
            detailsHref={paths.dashboard.rh.rhSettings.root}
            onDelete={() => handleDelete(job.id)}
          />
        ))}
      </Box>

      {/* {jobs.length > 8 && (
        <Pagination
          count={8}
          sx={{
            mt: { xs: 8, md: 8 },
            [`& .${paginationClasses.ul}`]: { justifyContent: 'center' },
          }}
        />
      )} */}
    </>
  );
}
