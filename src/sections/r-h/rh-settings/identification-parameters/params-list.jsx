import Box from '@mui/material/Box';

import { useGetSocieties } from 'src/actions/society';
import { useGetWorkshops } from 'src/actions/workshop';
import {
  createBank,
  createRung,
  updateBank,
  updateRung,
  createGrade,
  updateGrade,
  createSection,
  updateSection,
  createDivision,
  createTeamType,
  updateDivision,
  updateTeamType,
  createDirection,
  updateDirection,
  createDepartment,
  createSubsidiary,
  updateSubsidiary,
  updateDepartment,
  createNationality,
  createPpeCategory,
  updateNationality,
  updatePpeCategory,
  createSalaryCategory,
  updateSalaryCategory,
  createSalaryScaleLevel,
  updateSalaryScaleLevel,
  createLoanAssistancePattern,
  createPpeComplianceStandard,
  updatePpeComplianceStandard,
  updateLoanAssistancePattern,
  createCompensationLeavePattern,
  updateCompensationLeavePattern,
} from 'src/actions/identification';

import { ParamItem } from './param-item';
import { EnterpriseItem } from './enterprise-item';

// ----------------------------------------------------------------------

export function ParamsList({ data }) {
  const { societies } = useGetSocieties();
  const { ateliers } = useGetWorkshops();
  return (
    <Box
      sx={{
        gap: 2,
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
      }}
    >
      {/* Enterprises */}
      <EnterpriseItem title="Entreprises" data={societies} icon="mdi:company" />
      {/* direction */}
      <ParamItem
        title="Direction"
        data={data?.direction}
        canAdd
        icon="mdi:direct-current"
        uuid="2"
        onCreate={createDirection}
        onUpdate={updateDirection}
      />
      <ParamItem title="Ateliers" data={ateliers} icon="mdi:direct-current" />
      <ParamItem
        title="Filiales"
        data={data?.subsidiary}
        icon="mdi:direct-current"
        uuid="4"
        canAdd
        onCreate={createSubsidiary}
        onUpdate={updateSubsidiary}
      />
      <ParamItem
        title="Division"
        data={data?.division}
        icon="mdi:direct-current"
        uuid="5"
        canAdd
        onCreate={createDivision}
        onUpdate={updateDivision}
      />
      <ParamItem
        title="Départements"
        data={data?.department}
        icon="mdi:building"
        uuid="6"
        canAdd
        onCreate={createDepartment}
        onUpdate={updateDepartment}
      />
      <ParamItem
        title="Sections"
        data={data?.section}
        icon="mdi:view-list"
        uuid="7"
        canAdd
        onCreate={createSection}
        onUpdate={updateSection}
      />
      <ParamItem
        title="Nationalités"
        data={data?.nationality}
        icon="mdi:flag"
        uuid="8"
        canAdd
        onCreate={createNationality}
        onUpdate={updateNationality}
      />
      <ParamItem
        title="Catégories EPI"
        data={data?.ppe_category}
        icon="mdi:shield-user"
        uuid="9"
        canAdd
        onCreate={createPpeCategory}
        onUpdate={updatePpeCategory}
      />
      <ParamItem
        title="Normes de conformité EPI"
        data={data?.ppe_compliance_standard}
        icon="mdi:user-box-outline"
        uuid="10"
        canAdd
        onCreate={createPpeComplianceStandard}
        onUpdate={updatePpeComplianceStandard}
      />
      <ParamItem
        title="Grades"
        data={data?.grade}
        icon="mdi:chart-areaspline-variant"
        uuid="11"
        canAdd
        onCreate={createGrade}
        onUpdate={updateGrade}
      />
      <ParamItem
        title="Banques"
        data={data?.bank}
        icon="mdi:bank"
        uuid="12"
        canAdd
        onCreate={createBank}
        onUpdate={updateBank}
      />
      <ParamItem
        title="Type d'équipe"
        data={data?.team_type}
        icon="mdi:users-group"
        uuid="13"
        canAdd
        onCreate={createTeamType}
        onUpdate={updateTeamType}
      />
      <ParamItem
        title="Catégorie socioprofessionnelle"
        data={data?.salary_category}
        icon="mdi:cabin-a-frame"
        uuid="14"
        canAdd
        onCreate={createSalaryCategory}
        onUpdate={updateSalaryCategory}
      />
      <ParamItem
        title="Échelons"
        data={data?.rung}
        icon="mdi:format-list-numbered"
        uuid="15"
        canAdd
        onCreate={createRung}
        onUpdate={updateRung}
      />
      <ParamItem
        title="Niveau de la grille salariale"
        data={data?.salary_scale_level}
        icon="mdi:format-list-numbered"
        uuid="16"
        canAdd
        onCreate={createSalaryScaleLevel}
        onUpdate={updateSalaryScaleLevel}
      />
      <ParamItem
        title="Motifs - Sortie, Congé et Récupération"
        data={data?.compensation_leave_pattern}
        icon="mdi:content-copy"
        uuid="17"
        canAdd
        onCreate={createCompensationLeavePattern}
        onUpdate={updateCompensationLeavePattern}
      />

      <ParamItem
        title="Motifs - Prêt et Aide"
        data={data?.loan_assistance_pattern}
        icon="mdi:content-copy"
        uuid="18"
        canAdd
        onCreate={createLoanAssistancePattern}
        onUpdate={updateLoanAssistancePattern}
      />
    </Box>
  );
}
