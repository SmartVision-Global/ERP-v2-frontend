import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';

import { CONFIG } from 'src/global-config';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------
import { AccountLayout } from 'src/sections/account/account-layout';

import { AuthGuard } from 'src/auth/guard';

import { usePathname } from '../hooks';

const IndexPage = lazy(() => import('src/pages/dashboard/one'));
const PageTwo = lazy(() => import('src/pages/dashboard/two'));
const PageThree = lazy(() => import('src/pages/dashboard/three'));
const PageFour = lazy(() => import('src/pages/dashboard/four'));
const PageFive = lazy(() => import('src/pages/dashboard/five'));
const PageSix = lazy(() => import('src/pages/dashboard/six'));
const PageRhList = lazy(() => import('src/pages/dashboard/r-h/personal/actif/list'));
const PageRhDocumentsList = lazy(() => import('src/pages/dashboard/r-h/personal/documents/list'));
const PageRhBloqueList = lazy(() => import('src/pages/dashboard/r-h/personal/bloque/list'));
const PageRhDasList = lazy(() => import('src/pages/dashboard/r-h/personal/das/list'));
const PageRhPersonelNew = lazy(() => import('src/pages/dashboard/r-h/personal/actif/new'));
const PageRhPersonelEdit = lazy(() => import('src/pages/dashboard/r-h/personal/actif/edit'));

const PageRhDocumentPersonelNew = lazy(
  () => import('src/pages/dashboard/r-h/personal/documents/new')
);

const PageRhFonctionTaskList = lazy(
  () => import('src/pages/dashboard/r-h/fonction/task-resp/list')
);
const PageRhFonctionTaskNew = lazy(() => import('src/pages/dashboard/r-h/fonction/task-resp/new'));
const PageRhFonctionTaskEdit = lazy(
  () => import('src/pages/dashboard/r-h/fonction/task-resp/edit')
);

const PageRhFonctionCareerPathList = lazy(
  () => import('src/pages/dashboard/r-h/fonction/career-path/list')
);
const PageRhFonctionCareerPathNew = lazy(
  () => import('src/pages/dashboard/r-h/fonction/career-path/new')
);

const PageRhFonctionCareerPathEdit = lazy(
  () => import('src/pages/dashboard/r-h/fonction/career-path/edit')
);

const PageRhFonctionFonctionsList = lazy(
  () => import('src/pages/dashboard/r-h/fonction/fonctions/list')
);
const PageRhFonctionFonctionsNew = lazy(
  () => import('src/pages/dashboard/r-h/fonction/fonctions/new')
);

const PageRhFonctionFonctionsEdit = lazy(
  () => import('src/pages/dashboard/r-h/fonction/fonctions/edit')
);

// rh settings

const PageRhSettingsIdentList = lazy(
  () => import('src/pages/dashboard/r-h/rh-settings/param-identification/list')
);
// const PageRhSettingsIdentNew = lazy(
//   () => import('src/pages/dashboard/r-h/rh-settings/param-identification/new')
// );

const PageRhSettingsZonesList = lazy(
  () => import('src/pages/dashboard/r-h/rh-settings/zones/list')
);
const PageRhSettingsZonesNew = lazy(() => import('src/pages/dashboard/r-h/rh-settings/zones/new'));

const PageRhSettingsZonesEdit = lazy(
  () => import('src/pages/dashboard/r-h/rh-settings/zones/edit')
);

const PageRhSettingsJobProgramsList = lazy(
  () => import('src/pages/dashboard/r-h/rh-settings/programmes-travail/list')
);
const PageRhSettingsJobProgramsNew = lazy(
  () => import('src/pages/dashboard/r-h/rh-settings/programmes-travail/new')
);

const PageRhSettingsJobProgramsEdit = lazy(
  () => import('src/pages/dashboard/r-h/rh-settings/programmes-travail/edit')
);

const PageRhSettingsDeductionsCompensationList = lazy(
  () => import('src/pages/dashboard/r-h/rh-settings/retenue-indemnite/list')
);
const PageRhSettingsDeductionsCompensationNew = lazy(
  () => import('src/pages/dashboard/r-h/rh-settings/retenue-indemnite/new')
);

const PageRhSettingsDeductionsCompensationEdit = lazy(
  () => import('src/pages/dashboard/r-h/rh-settings/retenue-indemnite/edit')
);

const PageRhSettingsSalaryGridList = lazy(
  () => import('src/pages/dashboard/r-h/rh-settings/grille-salaire/list')
);
const PageRhSettingsSalaryGridNew = lazy(
  () => import('src/pages/dashboard/r-h/rh-settings/grille-salaire/new')
);

const PageRhSettingsSalaryGridEdit = lazy(
  () => import('src/pages/dashboard/r-h/rh-settings/grille-salaire/edit')
);

const PageRhSettingsCnasRateList = lazy(
  () => import('src/pages/dashboard/r-h/rh-settings/taux-cnas/list')
);
const PageRhSettingsCnasRateNew = lazy(
  () => import('src/pages/dashboard/r-h/rh-settings/taux-cnas/new')
);

const PageRhSettingsCnasRateEdit = lazy(
  () => import('src/pages/dashboard/r-h/rh-settings/taux-cnas/edit')
);

const PageRhSettingsAgenciesList = lazy(
  () => import('src/pages/dashboard/r-h/rh-settings/agences/list')
);
const PageRhSettingsAgenciesNew = lazy(
  () => import('src/pages/dashboard/r-h/rh-settings/agences/new')
);

const PageRhSettingsAgenciesEdit = lazy(
  () => import('src/pages/dashboard/r-h/rh-settings/agences/edit')
);

// ----------------------------------------------------------------------

const PageRhDemandesSortie = lazy(() => import('src/pages/dashboard/r-h/demandes/sortie/list'));
const PageRhDemandeCongieAgenciesNew = lazy(
  () => import('src/pages/dashboard/r-h/demandes/sortie/list')
);
const PageRhDemandeRecupAgenciesNew = lazy(
  () => import('src/pages/dashboard/r-h/demandes/sortie/list')
);
const PageRhDemandePretAgenciesNew = lazy(
  () => import('src/pages/dashboard/r-h/demandes/sortie/list')
);
const PageRhDemandeAideAgenciesNew = lazy(
  () => import('src/pages/dashboard/r-h/demandes/sortie/list')
);

// entries
const PageRhEntriesSocialLoan = lazy(
  () => import('src/pages/dashboard/r-h/entries/social-loan/list')
);
const PageRhEntriesSocialLoanNew = lazy(
  () => import('src/pages/dashboard/r-h/entries/social-loan/new')
);
const PageRhEntriesSocialLoanEdit = lazy(
  () => import('src/pages/dashboard/r-h/entries/social-loan/edit')
);

const PageRhEntriesLeaveAbsence = lazy(
  () => import('src/pages/dashboard/r-h/entries/leave-absence/list')
);
const PageRhEntriesLeaveAbsenceNew = lazy(
  () => import('src/pages/dashboard/r-h/entries/leave-absence/new')
);

const PageRhEntriesLeaveAbsenceEdit = lazy(
  () => import('src/pages/dashboard/r-h/entries/leave-absence/edit')
);

const PageRhEntriesPermanence = lazy(
  () => import('src/pages/dashboard/r-h/entries/permanence/list')
);
const PageRhEntriesPermanenceNew = lazy(
  () => import('src/pages/dashboard/r-h/entries/permanence/new')
);

const PageRhEntriesPermanenceEdit = lazy(
  () => import('src/pages/dashboard/r-h/entries/permanence/edit')
);

const PageRhEntriesOvertime = lazy(() => import('src/pages/dashboard/r-h/entries/overtime/list'));
const PageRhEntriesOvertimeNew = lazy(() => import('src/pages/dashboard/r-h/entries/overtime/new'));
const PageRhEntriesOvertimeEdit = lazy(
  () => import('src/pages/dashboard/r-h/entries/overtime/edit')
);

const PageRhEntriesRecovery = lazy(() => import('src/pages/dashboard/r-h/entries/recovery/list'));
const PageRhEntriesRecoveryNew = lazy(() => import('src/pages/dashboard/r-h/entries/recovery/new'));
const PageRhEntriesRecoveryEdit = lazy(
  () => import('src/pages/dashboard/r-h/entries/recovery/edit')
);

// Treatment
const PageRhTreatmentLocationAssignment = lazy(
  () => import('src/pages/dashboard/r-h/treatment/location-assignment/list')
);
const PageRhTreatmentLocationAssignmentNew = lazy(
  () => import('src/pages/dashboard/r-h/treatment/location-assignment/new')
);

const PageRhTreatmentPromotionDemotion = lazy(
  () => import('src/pages/dashboard/r-h/treatment/promotion-demotion/list')
);
const PageRhTreatmentPromotionDemotionNew = lazy(
  () => import('src/pages/dashboard/r-h/treatment/promotion-demotion/new')
);

const PageRhTreatmentRenewalContract = lazy(
  () => import('src/pages/dashboard/r-h/treatment/renewal-contract/list')
);
const PageRhTreatmentRenewalContractNew = lazy(
  () => import('src/pages/dashboard/r-h/treatment/renewal-contract/new')
);

const PageRhTreatmentEndRelationship = lazy(
  () => import('src/pages/dashboard/r-h/treatment/end-relationship/list')
);
const PageRhTreatmentEndRelationshipNew = lazy(
  () => import('src/pages/dashboard/r-h/treatment/end-relationship/new')
);

// HSE
// const PageRhHseEpi = lazy(() => import('src/pages/dashboard/r-h/hse/epi/list'));
// const PageRhHseEpiNew = lazy(() => import('src/pages/dashboard/r-h/hse/epi/new'));

// const PageRhHseDischarge = lazy(() => import('src/pages/dashboard/r-h/hse/discharge/list'));
// const PageRhHseDischargeNew = lazy(() => import('src/pages/dashboard/r-h/hse/discharge/new'));

// team management

// const PageRhTeamManagementTeam = lazy(
//   () => import('src/pages/dashboard/r-h/team-management/team/list')
// );
// const PageRhTeamManagementTeamNew = lazy(
//   () => import('src/pages/dashboard/r-h/team-management/team/new')
// );

// const PageRhTeamManagementProgram = lazy(
//   () => import('src/pages/dashboard/r-h/team-management/team-program/list')
// );
// const PageRhTeamManagementProgramNew = lazy(
//   () => import('src/pages/dashboard/r-h/team-management/team-program/new')
// );

// payroll management
const PageRhPayrollManagementCalculation = lazy(
  () => import('src/pages/dashboard/r-h/payroll-management/calculation/list')
);
const PageRhPayrollManagementCalculationNew = lazy(
  () => import('src/pages/dashboard/r-h/payroll-management/calculation/new')
);

const PageRhPayrollManagementPreparation = lazy(
  () => import('src/pages/dashboard/r-h/payroll-management/preparation/list')
);
// const PageRhPayrollManagementPreparationNew = lazy(
//   () => import('src/pages/dashboard/r-h/payroll-management/preparation/new')
// );

// Account
const AccountGeneralPage = lazy(() => import('src/pages/dashboard/user/account/general'));
const AccountChangePasswordPage = lazy(
  () => import('src/pages/dashboard/user/account/change-password')
);
// settings
const SettingsSiteList = lazy(() => import('src/pages/dashboard/settings/sites/list'));
const SettingsSiteNew = lazy(() => import('src/pages/dashboard/settings/sites/new'));

const SettingsAtelierList = lazy(() => import('src/pages/dashboard/settings/ateliers/list'));
const SettingsAtelierNew = lazy(() => import('src/pages/dashboard/settings/ateliers/new'));

const SettingsMachineList = lazy(() => import('src/pages/dashboard/settings/machines/list'));
const SettingsMachineNew = lazy(() => import('src/pages/dashboard/settings/machines/new'));

const SettingsEntrepriseList = lazy(() => import('src/pages/dashboard/settings/entreprises/list'));
const SettingsEntrepriseNew = lazy(() => import('src/pages/dashboard/settings/entreprises/new'));

const SettingsServiceList = lazy(() => import('src/pages/dashboard/settings/services/list'));
const SettingsServiceNew = lazy(() => import('src/pages/dashboard/settings/services/new'));

const ComingSoonPage = lazy(() => import('src/pages/coming-soon'));

function SuspenseOutlet() {
  const pathname = usePathname();
  return (
    <Suspense key={pathname} fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  );
}

const dashboardLayout = () => (
  <DashboardLayout>
    <SuspenseOutlet />
  </DashboardLayout>
);
const accountLayout = () => (
  <AccountLayout>
    <SuspenseOutlet />
  </AccountLayout>
);

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: CONFIG.auth.skip ? dashboardLayout() : <AuthGuard>{dashboardLayout()}</AuthGuard>,
    children: [
      { element: <IndexPage />, index: true },
      { path: 'two', element: <PageTwo /> },
      { path: 'three', element: <PageThree /> },
      {
        path: 'humain-ressource',
        children: [
          //  { element:<PageRhList /> ,index:true},
          {
            path: 'personal',

            children: [
              { element: <PageRhList />, index: true },
              { path: 'documents', element: <PageRhDocumentsList /> },
              { path: 'bloc', element: <PageRhBloqueList /> },
              { path: 'das', element: <PageRhDasList /> },
              { path: 'new', element: <PageRhPersonelNew /> },
              { path: 'documents/new', element: <PageRhDocumentPersonelNew /> },
              { path: ':id/edit', element: <PageRhPersonelEdit /> },
            ],
          },
          {
            path: 'fonction',

            children: [
              { path: 'task-responsabilities', element: <PageRhFonctionTaskList />, index: true },
              { path: 'task-responsabilities/new', element: <PageRhFonctionTaskNew /> },
              { path: 'task-responsabilities/:id/edit', element: <PageRhFonctionTaskEdit /> },

              { path: 'career-path', element: <PageRhFonctionCareerPathList /> },
              { path: 'career-path/new', element: <PageRhFonctionCareerPathNew /> },
              { path: 'career-path/:id/edit', element: <PageRhFonctionCareerPathEdit /> },

              { path: 'fonctions', element: <PageRhFonctionFonctionsList /> },
              { path: 'fonctions/new', element: <PageRhFonctionFonctionsNew /> },
              { path: 'fonctions/:id/edit', element: <PageRhFonctionFonctionsEdit /> },

              // { path: 'documents', element: <PageRhDocumentsList /> },
              // { path: 'bloc', element: <PageRhBloqueList /> },
              // { path: 'das', element: <PageRhDasList /> },
              // { path: 'new', element: <PageRhPersonelNew /> },
              // { path: 'documents/new', element: <PageRhDocumentPersonelNew /> },
            ],
          },
          {
            path: 'settings',

            children: [
              { path: 'identification', element: <PageRhSettingsIdentList />, index: true },
              // { path: 'identification/new', element: <PageRhSettingsIdentNew/> },

              { path: 'zones', element: <PageRhSettingsZonesList /> },
              { path: 'zones/new', element: <PageRhSettingsZonesNew /> },
              { path: 'zones/:id/edit', element: <PageRhSettingsZonesEdit /> },

              { path: 'work-programs', element: <PageRhSettingsJobProgramsList /> },
              { path: 'work-programs/new', element: <PageRhSettingsJobProgramsNew /> },
              { path: 'work-programs/:id/edit', element: <PageRhSettingsJobProgramsEdit /> },

              {
                path: 'deductions-compensation',
                element: <PageRhSettingsDeductionsCompensationList />,
              },
              {
                path: 'deductions-compensation/new',
                element: <PageRhSettingsDeductionsCompensationNew />,
              },
              {
                path: 'deductions-compensation/:id/edit',
                element: <PageRhSettingsDeductionsCompensationEdit />,
              },

              { path: 'salary-grid', element: <PageRhSettingsSalaryGridList /> },
              { path: 'salary-grid/new', element: <PageRhSettingsSalaryGridNew /> },
              { path: 'salary-grid/:id/edit', element: <PageRhSettingsSalaryGridEdit /> },

              { path: 'cnas-rate', element: <PageRhSettingsCnasRateList /> },
              { path: 'cnas-rate/new', element: <PageRhSettingsCnasRateNew /> },
              { path: 'cnas-rate/:id/edit', element: <PageRhSettingsCnasRateEdit /> },

              { path: 'agencies', element: <PageRhSettingsAgenciesList /> },
              { path: 'agencies/new', element: <PageRhSettingsAgenciesNew /> },
              { path: 'agencies/:id/edit', element: <PageRhSettingsAgenciesEdit /> },
            ],
          },
          {
            path: 'demandes',
            children: [
              { path: 'sortie', element: <ComingSoonPage />, index: true },
              { path: 'conge', element: <ComingSoonPage /> },
              { path: 'recuperation', element: <ComingSoonPage /> },
              { path: 'pret', element: <ComingSoonPage /> },
              { path: 'aide', element: <ComingSoonPage /> },
            ],
          },
          {
            path: 'entries',
            children: [
              { path: 'social-loan', element: <PageRhEntriesSocialLoan />, index: true },
              { path: 'social-loan/new', element: <PageRhEntriesSocialLoanNew /> },
              { path: 'social-loan/:id/edit', element: <PageRhEntriesSocialLoanEdit /> },

              { path: 'leave-absence', element: <PageRhEntriesLeaveAbsence /> },
              { path: 'leave-absence/new', element: <PageRhEntriesLeaveAbsenceNew /> },
              { path: 'leave-absence/:id/edit', element: <PageRhEntriesLeaveAbsenceEdit /> },

              { path: 'permanence', element: <PageRhEntriesPermanence /> },
              { path: 'permanence/new', element: <PageRhEntriesPermanenceNew /> },
              { path: 'permanence/:id/edit', element: <PageRhEntriesPermanenceEdit /> },

              { path: 'overtime', element: <PageRhEntriesOvertime /> },
              { path: 'overtime/new', element: <PageRhEntriesOvertimeNew /> },
              { path: 'overtime/:id/edit', element: <PageRhEntriesOvertimeEdit /> },

              { path: 'recovery', element: <PageRhEntriesRecovery /> },
              { path: 'recovery/new', element: <PageRhEntriesRecoveryNew /> },
              { path: 'recovery/:id/edit', element: <PageRhEntriesRecoveryEdit /> },
            ],
          },
          {
            path: 'treatment',
            children: [
              {
                path: 'location-assignment',
                element: <PageRhTreatmentLocationAssignment />,
                index: true,
              },
              {
                path: 'location-assignment/new',
                element: <PageRhTreatmentLocationAssignmentNew />,
              },

              { path: 'promotion-demotion', element: <PageRhTreatmentPromotionDemotion /> },
              { path: 'promotion-demotion/new', element: <PageRhTreatmentPromotionDemotionNew /> },

              { path: 'renewal-contract', element: <PageRhTreatmentRenewalContract /> },
              { path: 'renewal-contract/new', element: <PageRhTreatmentRenewalContractNew /> },

              { path: 'end-relationship', element: <PageRhTreatmentEndRelationship /> },
              { path: 'end-relationship/new', element: <PageRhTreatmentEndRelationshipNew /> },
            ],
          },
          {
            path: 'hse',
            children: [
              { path: 'epi', element: <ComingSoonPage />, index: true },
              {
                path: 'epi/new',
                element: <ComingSoonPage />,
              },

              { path: 'discharge', element: <ComingSoonPage /> },
              { path: 'discharge/new', element: <ComingSoonPage /> },
            ],
          },
          {
            path: 'team-management',
            children: [
              { path: 'team', element: <ComingSoonPage />, index: true },
              {
                path: 'team/new',
                element: <ComingSoonPage />,
              },

              { path: 'team-program', element: <ComingSoonPage /> },
              { path: 'team-program/new', element: <ComingSoonPage /> },
            ],
          },
          {
            path: 'payroll-management',
            children: [
              { path: 'calculation', element: <PageRhPayrollManagementCalculation />, index: true },
              {
                path: 'calculation/new',
                element: <PageRhPayrollManagementCalculationNew />,
              },

              { path: 'preparation', element: <PageRhPayrollManagementPreparation /> },
              { path: 'preparation/new', element: <ComingSoonPage /> },
            ],
          },
        ],
      },
      {
        path: 'user',
        children: [
          // { index: true, element: <UserProfilePage /> },
          // { path: 'profile', element: <UserProfilePage /> },
          // { path: 'cards', element: <UserCardsPage /> },
          // { path: 'list', element: <UserListPage /> },
          // { path: 'new', element: <UserCreatePage /> },
          // { path: ':id/edit', element: <UserEditPage /> },
          {
            path: 'account',
            element: accountLayout(),
            children: [
              { index: true, element: <AccountGeneralPage /> },
              // { path: 'billing', element: <AccountBillingPage /> },
              // { path: 'notifications', element: <AccountNotificationsPage /> },
              // { path: 'socials', element: <AccountSocialsPage /> },
              { path: 'change-password', element: <AccountChangePasswordPage /> },
            ],
          },
        ],
      },
      {
        path: 'settings',
        children: [
          // { index: true, element: <UserProfilePage /> },
          // { path: 'profile', element: <UserProfilePage /> },
          // { path: 'cards', element: <UserCardsPage /> },
          // { path: 'list', element: <UserListPage /> },
          // { path: 'new', element: <UserCreatePage /> },
          // { path: ':id/edit', element: <UserEditPage /> },
          {
            path: 'site',
            children: [
              { index: true, element: <SettingsSiteList /> },
              { path: 'new', element: <SettingsSiteNew /> },
            ],
          },
          {
            path: 'service',
            children: [
              { index: true, element: <SettingsServiceList /> },
              { path: 'new', element: <SettingsServiceNew /> },
            ],
          },
          {
            path: 'workshop',
            children: [
              { index: true, element: <SettingsAtelierList /> },
              { path: 'new', element: <SettingsAtelierNew /> },
            ],
          },
          {
            path: 'machine',
            children: [
              { index: true, element: <SettingsMachineList /> },
              { path: 'new', element: <SettingsMachineNew /> },
            ],
          },
          {
            path: 'society',
            children: [
              { index: true, element: <SettingsEntrepriseList /> },
              { path: 'new', element: <SettingsEntrepriseNew /> },
            ],
          },
          {
            path: 'account',
            element: accountLayout(),
            children: [
              { index: true, element: <AccountGeneralPage /> },
              // { path: 'billing', element: <AccountBillingPage /> },
              // { path: 'notifications', element: <AccountNotificationsPage /> },
              // { path: 'socials', element: <AccountSocialsPage /> },
              { path: 'change-password', element: <AccountChangePasswordPage /> },
            ],
          },
        ],
      },

      {
        path: 'group',
        children: [
          { element: <PageFour />, index: true },
          { path: 'five', element: <PageFive /> },
          { path: 'six', element: <PageSix /> },
        ],
      },
    ],
  },
];
