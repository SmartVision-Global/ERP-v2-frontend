import { useCallback } from 'react';

import Box from '@mui/material/Box';

import { createDirection } from 'src/actions/identification';

import { ParamItem } from './param-item';

// ----------------------------------------------------------------------

export function JobList({ data }) {
  const handleDelete = useCallback((id) => {
    console.info('DELETE', id);
  }, []);

  return (
    <>
      <Box
        sx={{
          gap: 2,
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        }}
      >
        {/* {jobs.map((job) => (
          <ParamItem
            key={job.id}
            job={job}
            editHref={paths.dashboard.rh.rhSettings.root}
            detailsHref={paths.dashboard.rh.rhSettings.root}
            onDelete={() => handleDelete(job.id)}
          />
        ))} */}
        {/* entreprises */}

        {/* direction */}
        <ParamItem title="Entreprises" data={[]} icon="mdi:direct-current" uuid="1" />
        <ParamItem
          title="Direction"
          data={data?.direction}
          canAdd
          icon="mdi:direct-current"
          uuid="2"
          onCreate={createDirection}
        />
        <ParamItem title="Ateliers" data={[]} icon="mdi:direct-current" uuid="1" />
        <ParamItem title="Filiales" data={[]} icon="mdi:direct-current" uuid="4" canAdd />
        <ParamItem title="Division" data={[]} icon="mdi:direct-current" uuid="5" canAdd />
        <ParamItem title="Départements" data={[]} icon="mdi:direct-current" uuid="6" canAdd />
        <ParamItem title="Sections" data={[]} icon="mdi:direct-current" uuid="7" canAdd />
        <ParamItem title="Nationalités" data={[]} icon="mdi:direct-current" uuid="8" canAdd />
        <ParamItem title="Catégories EPI" data={[]} icon="mdi:direct-current" uuid="9" canAdd />
        <ParamItem
          title="Normes de conformité EPI"
          data={[]}
          icon="mdi:direct-current"
          uuid="10"
          canAdd
        />
        <ParamItem title="Grades" data={[]} icon="mdi:direct-current" uuid="11" canAdd />
        <ParamItem title="Banques" data={[]} icon="mdi:direct-current" uuid="12" canAdd />
        <ParamItem title="Type d'équipe" data={[]} icon="mdi:direct-current" uuid="13" canAdd />
        <ParamItem
          title="Catégorie socioprofessionnelle"
          data={[]}
          icon="mdi:direct-current"
          uuid="14"
          canAdd
        />
        <ParamItem title="Échelons" data={[]} icon="mdi:direct-current" uuid="15" canAdd />
        <ParamItem
          title="Niveau de la grille salariale"
          data={[]}
          icon="mdi:direct-current"
          uuid="16"
          canAdd
        />
        <ParamItem
          title="Motifs - Sortie, Congé et Récupération"
          data={[]}
          icon="mdi:direct-current"
          uuid="17"
          canAdd
        />
        <ParamItem
          title="Motifs - Prêt et Aide"
          data={[]}
          icon="mdi:direct-current"
          uuid="18"
          canAdd
        />
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
