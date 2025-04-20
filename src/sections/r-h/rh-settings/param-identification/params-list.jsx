import { useCallback } from 'react';

import Box from '@mui/material/Box';

import {
  createBank,
  createRung,
  createGrade,
  createSection,
  createDivision,
  createTeamType,
  createDirection,
  createDepartment,
  createSubsidiary,
  createNationality,
  createPpeCategory,
  createSalaryCategory,
  createSalaryScaleLevel,
  createLoanAssistancePattern,
  createPpeComplianceStandard,
  createCompensationLeavePattern,
} from 'src/actions/identification';

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
        <ParamItem title="Entreprises" data={[]} icon="mdi:company" uuid="1" />
        <ParamItem
          title="Direction"
          data={data?.direction}
          canAdd
          icon="mdi:direct-current"
          uuid="2"
          onCreate={createDirection}
        />
        <ParamItem title="Ateliers" data={[]} icon="mdi:direct-current" uuid="1" />
        <ParamItem
          title="Filiales"
          data={data?.subsidiary}
          icon="mdi:direct-current"
          uuid="4"
          canAdd
          onCreate={createSubsidiary}
        />
        <ParamItem
          title="Division"
          data={data?.division}
          icon="mdi:direct-current"
          uuid="5"
          canAdd
          onCreate={createDivision}
        />
        <ParamItem
          title="Départements"
          data={data?.department}
          icon="mdi:building"
          uuid="6"
          canAdd
          onCreate={createDepartment}
        />
        <ParamItem
          title="Sections"
          data={data?.section}
          icon="mdi:view-list"
          uuid="7"
          canAdd
          onCreate={createSection}
        />
        <ParamItem
          title="Nationalités"
          data={data?.nationality}
          icon="mdi:flag"
          uuid="8"
          canAdd
          onCreate={createNationality}
        />
        <ParamItem
          title="Catégories EPI"
          data={data?.ppe_category}
          icon="mdi:shield-user"
          uuid="9"
          canAdd
          onCreate={createPpeCategory}
        />
        <ParamItem
          title="Normes de conformité EPI"
          data={data?.ppe_compliance_standard}
          icon="mdi:user-box-outline"
          uuid="10"
          canAdd
          onCreate={createPpeComplianceStandard}
        />
        <ParamItem
          title="Grades"
          data={data?.grade}
          icon="mdi:chart-areaspline-variant"
          uuid="11"
          canAdd
          onCreate={createGrade}
        />
        <ParamItem
          title="Banques"
          data={data?.bank}
          icon="mdi:bank"
          uuid="12"
          canAdd
          onCreate={createBank}
        />
        <ParamItem
          title="Type d'équipe"
          data={data?.team_type}
          icon="mdi:users-group"
          uuid="13"
          canAdd
          onCreate={createTeamType}
        />
        <ParamItem
          title="Catégorie socioprofessionnelle"
          data={data?.salary_category}
          icon="mdi:cabin-a-frame"
          uuid="14"
          canAdd
          onCreate={createSalaryCategory}
        />
        <ParamItem
          title="Échelons"
          data={data?.rung}
          icon="mdi:format-list-numbered"
          uuid="15"
          canAdd
          onCreate={createRung}
        />
        <ParamItem
          title="Niveau de la grille salariale"
          data={data?.salary_scale_level}
          icon="mdi:format-list-numbered"
          uuid="16"
          canAdd
          onCreate={createSalaryScaleLevel}
        />
        <ParamItem
          title="Motifs - Sortie, Congé et Récupération"
          data={data?.compensation_leave_pattern}
          icon="mdi:content-copy"
          uuid="17"
          canAdd
          onCreate={createCompensationLeavePattern}
        />

        <ParamItem
          title="Motifs - Prêt et Aide"
          data={data?.loan_assistance_pattern}
          icon="mdi:content-copy"
          uuid="18"
          canAdd
          onCreate={createLoanAssistancePattern}
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
