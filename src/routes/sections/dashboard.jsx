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
const PageRhList = lazy(() => import('src/pages/dashboard/r-h/personal/actif/list'));
const PageRhDocumentsList = lazy(() => import('src/pages/dashboard/r-h/personal/documents/list'));
const PageRhBloqueList = lazy(() => import('src/pages/dashboard/r-h/personal/block/list'));
const PageRhDasList = lazy(() => import('src/pages/dashboard/r-h/para-tax-declaration/das/list'));
const PageRhDasDetails = lazy(
  () => import('src/pages/dashboard/r-h/para-tax-declaration/das/details')
);

const PageRhPersonalNew = lazy(() => import('src/pages/dashboard/r-h/personal/actif/new'));
const PageRhPersonalEdit = lazy(() => import('src/pages/dashboard/r-h/personal/actif/edit'));

const PageRhDocumentPersonalNew = lazy(
  () => import('src/pages/dashboard/r-h/personal/documents/new')
);

const PageRhFunctionTaskList = lazy(
  () => import('src/pages/dashboard/r-h/fonction/task-resp/list')
);
const PageRhFunctionTaskNew = lazy(() => import('src/pages/dashboard/r-h/fonction/task-resp/new'));
const PageRhFunctionTaskEdit = lazy(
  () => import('src/pages/dashboard/r-h/fonction/task-resp/edit')
);

const PageRhFunctionCareerPathList = lazy(
  () => import('src/pages/dashboard/r-h/fonction/career-path/list')
);
const PageRhFunctionCareerPathNew = lazy(
  () => import('src/pages/dashboard/r-h/fonction/career-path/new')
);

const PageRhFunctionCareerPathEdit = lazy(
  () => import('src/pages/dashboard/r-h/fonction/career-path/edit')
);

const PageRhFunctionJobList = lazy(() => import('src/pages/dashboard/r-h/fonction/jobs/list'));
const PageRhFunctionJobNew = lazy(() => import('src/pages/dashboard/r-h/fonction/jobs/new'));

const PageRhFunctionJobEdit = lazy(() => import('src/pages/dashboard/r-h/fonction/jobs/edit'));

// rh settings

const PageRhSettingsIdentList = lazy(
  () => import('src/pages/dashboard/r-h/rh-settings/identification-parameters/list')
);

const PageRhSettingsZonesList = lazy(
  () => import('src/pages/dashboard/r-h/rh-settings/zones/list')
);
const PageRhSettingsZonesNew = lazy(() => import('src/pages/dashboard/r-h/rh-settings/zones/new'));

const PageRhSettingsZonesEdit = lazy(
  () => import('src/pages/dashboard/r-h/rh-settings/zones/edit')
);

const PageRhSettingsJobProgramsList = lazy(
  () => import('src/pages/dashboard/r-h/rh-settings/work-programs/list')
);
const PageRhSettingsJobProgramsNew = lazy(
  () => import('src/pages/dashboard/r-h/rh-settings/work-programs/new')
);

const PageRhSettingsJobProgramsEdit = lazy(
  () => import('src/pages/dashboard/r-h/rh-settings/work-programs/edit')
);

const PageRhSettingsDeductionsCompensationList = lazy(
  () => import('src/pages/dashboard/r-h/rh-settings/deductions-compensations/list')
);
const PageRhSettingsDeductionsCompensationNew = lazy(
  () => import('src/pages/dashboard/r-h/rh-settings/deductions-compensations/new')
);

const PageRhSettingsDeductionsCompensationEdit = lazy(
  () => import('src/pages/dashboard/r-h/rh-settings/deductions-compensations/edit')
);

const PageRhSettingsSalaryGridList = lazy(
  () => import('src/pages/dashboard/r-h/rh-settings/salary-grid/list')
);
const PageRhSettingsSalaryGridNew = lazy(
  () => import('src/pages/dashboard/r-h/rh-settings/salary-grid/new')
);

const PageRhSettingsSalaryGridEdit = lazy(
  () => import('src/pages/dashboard/r-h/rh-settings/salary-grid/edit')
);

const PageRhSettingsCnasRateList = lazy(
  () => import('src/pages/dashboard/r-h/rh-settings/rate/list')
);
const PageRhSettingsCnasRateNew = lazy(
  () => import('src/pages/dashboard/r-h/rh-settings/rate/new')
);

const PageRhSettingsCnasRateEdit = lazy(
  () => import('src/pages/dashboard/r-h/rh-settings/rate/edit')
);

const PageRhSettingsAgenciesList = lazy(
  () => import('src/pages/dashboard/r-h/rh-settings/agencies/list')
);
const PageRhSettingsAgenciesNew = lazy(
  () => import('src/pages/dashboard/r-h/rh-settings/agencies/new')
);

const PageRhSettingsAgenciesEdit = lazy(
  () => import('src/pages/dashboard/r-h/rh-settings/agencies/edit')
);

// ----------------------------------------------------------------------

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

const PageRhEntriesRecoveryList = lazy(
  () => import('src/pages/dashboard/r-h/entries/recovery/list')
);
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
const PageRhTreatmentLocationAssignmentEdit = lazy(
  () => import('src/pages/dashboard/r-h/treatment/location-assignment/edit')
);

const PageRhTreatmentPromotionDemotion = lazy(
  () => import('src/pages/dashboard/r-h/treatment/promotion-demotion/list')
);
const PageRhTreatmentPromotionDemotionNew = lazy(
  () => import('src/pages/dashboard/r-h/treatment/promotion-demotion/new')
);
const PageRhTreatmentPromotionDemotionEdit = lazy(
  () => import('src/pages/dashboard/r-h/treatment/promotion-demotion/edit')
);
const PageRhTreatmentRenewalContract = lazy(
  () => import('src/pages/dashboard/r-h/treatment/renewal-contract/list')
);
const PageRhTreatmentRenewalContractNew = lazy(
  () => import('src/pages/dashboard/r-h/treatment/renewal-contract/new')
);
const PageRhTreatmentRenewalContractEdit = lazy(
  () => import('src/pages/dashboard/r-h/treatment/renewal-contract/edit')
);
const PageRhTreatmentEndRelationship = lazy(
  () => import('src/pages/dashboard/r-h/treatment/end-relationship/list')
);
const PageRhTreatmentEndRelationshipNew = lazy(
  () => import('src/pages/dashboard/r-h/treatment/end-relationship/new')
);
const PageRhTreatmentEndRelationshipEdit = lazy(
  () => import('src/pages/dashboard/r-h/treatment/end-relationship/edit')
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

const PageRhPayrollManagementCalculationPayroll = lazy(
  () => import('src/pages/dashboard/r-h/payroll-management/calculation/payroll')
);

const PageRhPayrollManagementPreparation = lazy(
  () => import('src/pages/dashboard/r-h/payroll-management/preparation/list')
);
const PageRhPayrollManagementPreparationNew = lazy(
  () => import('src/pages/dashboard/r-h/payroll-management/preparation/new')
);

const PageRhPayrollManagementPreparationDetails = lazy(
  () => import('src/pages/dashboard/r-h/payroll-management/preparation/details')
);
// ============== purchase_Supply ==================
//purchase Order
const PagePurchaseOrder = lazy(
  () => import('src/pages/dashboard/purchase-supply/purchase-order/list')
);
const PageNewPurchaseOrder = lazy(
  () => import('src/pages/dashboard/purchase-supply/purchase-order/new')
);
//Processing Da
const PageProcessingDa = lazy(
  () => import('src/pages/dashboard/purchase-supply/processing-da/list')
);

// Account
const AccountGeneralPage = lazy(() => import('src/pages/dashboard/user/account/general'));
const AccountChangePasswordPage = lazy(
  () => import('src/pages/dashboard/user/account/change-password')
);
// settings
const SettingsSiteList = lazy(() => import('src/pages/dashboard/settings/sites/list'));
const SettingsSiteNew = lazy(() => import('src/pages/dashboard/settings/sites/new'));
const SettingsSiteEdit = lazy(() => import('src/pages/dashboard/settings/sites/edit'));

const SettingsAtelierList = lazy(() => import('src/pages/dashboard/settings/workshop/list'));
const SettingsAtelierNew = lazy(() => import('src/pages/dashboard/settings/workshop/new'));
const SettingsAtelierEdit = lazy(() => import('src/pages/dashboard/settings/workshop/edit'));

const SettingsMachineList = lazy(() => import('src/pages/dashboard/settings/machines/list'));
const SettingsMachineNew = lazy(() => import('src/pages/dashboard/settings/machines/new'));
const SettingsMachineEdit = lazy(() => import('src/pages/dashboard/settings/machines/edit'));

const SettingsEntrepriseList = lazy(() => import('src/pages/dashboard/settings/enterprises/list'));
const SettingsEntrepriseNew = lazy(() => import('src/pages/dashboard/settings/enterprises/new'));
const SettingsEntrepriseEdit = lazy(() => import('src/pages/dashboard/settings/enterprises/edit'));

const SettingsServiceList = lazy(() => import('src/pages/dashboard/settings/services/list'));
const SettingsServiceNew = lazy(() => import('src/pages/dashboard/settings/services/new'));
const SettingsGeneralSettings = lazy(
  () => import('src/pages/dashboard/settings/generalSettings/update')
);

const SettingsStoreList = lazy(() => import('src/pages/dashboard/settings/stores/list'));
const SettingsStoreNew = lazy(() => import('src/pages/dashboard/settings/stores/new'));

const SettingsIdentificationGlobalSettings = lazy(
  () => import('src/pages/dashboard/settings/identification-parameters/global-settings/list')
);

const PageSettingsIdentFamCategRpList = lazy(
  () => import('src/pages/dashboard/settings/identification-parameters/fam-categ-rp/list')
);
const SettingsServiceEdit = lazy(() => import('src/pages/dashboard/settings/services/edit'));

// gestion magasinage
const PageStoreRawMaterialsStocksList = lazy(
  () => import('src/pages/dashboard/store/raw-materials/stocks/list')
);
const PageStoreRawMaterialsStocksNew = lazy(
  () => import('src/pages/dashboard/store/raw-materials/stocks/new')
);
const PageStoreRawMaterialsStocksEdit = lazy(
  () => import('src/pages/dashboard/store/raw-materials/stocks/edit')
);
// expression de besoins
const PageExpressionOfNeedsBebList = lazy(
  () => import('src/pages/dashboard/expression-of-needs/Beb/list')
);
const PageExpressionOfNeedsBebNew = lazy(
  () => import('src/pages/dashboard/expression-of-needs/Beb/new')
);
const PageExpressionOfNeedsBebEdit = lazy(
  () => import('src/pages/dashboard/expression-of-needs/Beb/edit')
);

const PageStoreStorageEreaList = lazy(
  () => import('src/pages/dashboard/store/raw-materials/storage-area/list')
);
const PageStoreStorageAreaNew = lazy(
  () => import('src/pages/dashboard/store/raw-materials/storage-area/new')
);

const PageStoreInitialStorageList = lazy(
  () => import('src/pages/dashboard/store/raw-materials/initial-storage/list')
);
const PageStoreInitialStorageNew = lazy(
  () => import('src/pages/dashboard/store/raw-materials/initial-storage/new')
);

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
      {
        path: 'humain-ressource',
        children: [
          {
            path: 'personal',

            children: [
              { element: <PageRhList />, index: true },
              { path: 'documents', element: <PageRhDocumentsList /> },
              // { path: 'bloc', element: <PageRhBloqueList /> },
              // { path: 'das', element: <PageRhDasList /> },
              { path: 'new', element: <PageRhPersonalNew /> },
              { path: 'documents/new', element: <PageRhDocumentPersonalNew /> },
              { path: ':id/edit', element: <PageRhPersonalEdit /> },
            ],
          },
          {
            path: 'fonction',

            children: [
              { path: 'task-responsabilities', element: <PageRhFunctionTaskList />, index: true },
              { path: 'task-responsabilities/new', element: <PageRhFunctionTaskNew /> },
              { path: 'task-responsabilities/:id/edit', element: <PageRhFunctionTaskEdit /> },

              { path: 'career-path', element: <PageRhFunctionCareerPathList /> },
              { path: 'career-path/new', element: <PageRhFunctionCareerPathNew /> },
              { path: 'career-path/:id/edit', element: <PageRhFunctionCareerPathEdit /> },

              { path: 'fonctions', element: <PageRhFunctionJobList /> },
              { path: 'fonctions/new', element: <PageRhFunctionJobNew /> },
              { path: 'fonctions/:id/edit', element: <PageRhFunctionJobEdit /> },
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

              { path: 'recovery', element: <PageRhEntriesRecoveryList /> },
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
              {
                path: 'location-assignment/:id/edit',
                element: <PageRhTreatmentLocationAssignmentEdit />,
              },

              { path: 'promotion-demotion', element: <PageRhTreatmentPromotionDemotion /> },
              { path: 'promotion-demotion/new', element: <PageRhTreatmentPromotionDemotionNew /> },
              {
                path: 'promotion-demotion/:id/edit',
                element: <PageRhTreatmentPromotionDemotionEdit />,
              },

              { path: 'renewal-contract', element: <PageRhTreatmentRenewalContract /> },
              { path: 'renewal-contract/new', element: <PageRhTreatmentRenewalContractNew /> },
              {
                path: 'renewal-contract/:id/edit',
                element: <PageRhTreatmentRenewalContractEdit />,
              },

              { path: 'end-relationship', element: <PageRhTreatmentEndRelationship /> },
              { path: 'end-relationship/new', element: <PageRhTreatmentEndRelationshipNew /> },
              {
                path: 'end-relationship/:id/edit',
                element: <PageRhTreatmentEndRelationshipEdit />,
              },
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
              {
                path: 'calculation/:id/payroll',
                element: <PageRhPayrollManagementCalculationPayroll />,
              },

              { path: 'preparation', element: <PageRhPayrollManagementPreparation /> },
              // { path: 'preparation/new', element: <ComingSoonPage /> },
              { path: 'preparation/new', element: <PageRhPayrollManagementPreparationNew /> },
              {
                path: 'preparation/:id/details',
                element: <PageRhPayrollManagementPreparationDetails />,
              },
            ],
          },
          {
            path: 'para-tax-declaration',
            children: [
              { path: 'das', element: <PageRhDasList />, index: true },
              { path: 'das/details/:id/:year', element: <PageRhDasDetails />, index: true },

              {
                path: 'das/new',
                element: <ComingSoonPage />,
              },

              { path: 'dac', element: <ComingSoonPage /> },
              { path: 'dac/new', element: <ComingSoonPage /> },
            ],
          },
        ],
      },
      // Purchase Supply
      {
        path: 'purchase-supply',
        children: [
          { path: 'purchase-order', element: <PagePurchaseOrder />, index: true },
          { path: 'purchase-order/new', element: <PageNewPurchaseOrder /> },
          { path: 'processing-da', element: <PageProcessingDa /> },
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
            path: 'general-settings',
            element: <SettingsGeneralSettings />,
          },
          {
            path: 'site',
            children: [
              { index: true, element: <SettingsSiteList /> },
              { path: 'new', element: <SettingsSiteNew /> },
              { path: ':id/edit', element: <SettingsSiteEdit /> },
            ],
          },
          {
            path: 'store',
            children: [
              { index: true, element: <SettingsStoreList /> },
              { path: 'new', element: <SettingsStoreNew /> },
            ],
          },
          {
            path: 'identification',
            children: [
              { index: true, element: <SettingsIdentificationGlobalSettings /> },
              { path: 'global-settings', element: <SettingsIdentificationGlobalSettings /> },
              {
                path: 'raw-materials',
                element: <PageSettingsIdentFamCategRpList group={1} nature={1} />,
              },
              {
                path: 'spare-parts',
                element: <PageSettingsIdentFamCategRpList group={2} nature={1} />,
              },
              { path: 'tools', element: <PageSettingsIdentFamCategRpList group={3} nature={1} /> },
              {
                path: 'supplies',
                element: <PageSettingsIdentFamCategRpList group={4} nature={1} />,
              },
            ],
          },
          {
            path: 'service',
            children: [
              { index: true, element: <SettingsServiceList /> },
              { path: 'new', element: <SettingsServiceNew /> },
              { path: ':id/edit', element: <SettingsServiceEdit /> },
            ],
          },
          {
            path: 'workshop',
            children: [
              { index: true, element: <SettingsAtelierList /> },
              { path: 'new', element: <SettingsAtelierNew /> },
              { path: ':id/edit', element: <SettingsAtelierEdit /> },
            ],
          },
          {
            path: 'machine',
            children: [
              { index: true, element: <SettingsMachineList /> },
              { path: 'new', element: <SettingsMachineNew /> },
              { path: ':id/edit', element: <SettingsMachineEdit /> },
            ],
          },
          {
            path: 'society',
            children: [
              { index: true, element: <SettingsEntrepriseList /> },
              { path: 'new', element: <SettingsEntrepriseNew /> },
              { path: ':id/edit', element: <SettingsEntrepriseEdit /> },
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
        path: 'store',
        children: [
          {
            path: 'raw-materials',
            children: [
              { index: true, element: <PageStoreRawMaterialsStocksList /> },
              { path: 'stocks', element: <PageStoreRawMaterialsStocksList /> },
              { path: 'storage-area', element: <PageStoreStorageEreaList /> },
              { path: 'storage-area/new', element: <PageStoreStorageAreaNew /> },
              { path: 'initial-storage', element: <PageStoreInitialStorageList /> },
              { path: 'initial-storage/new', element: <PageStoreInitialStorageNew /> },
              { path: 'stocks/new', element: <PageStoreRawMaterialsStocksNew /> },
              { path: 'stocks/:id/edit', element: <PageStoreRawMaterialsStocksEdit /> },
            ],
          },
        ],
      },
      {
        path: 'expression-of-needs',
        children: [
          { index: true, element: <PageExpressionOfNeedsBebList /> },
          { path: 'beb', element: <PageExpressionOfNeedsBebList /> },
          { path: 'beb/new', element: <PageExpressionOfNeedsBebNew /> },
          { path: 'beb/:id/edit', element: <PageExpressionOfNeedsBebEdit /> },
        ],
      },
    ],
  },
];
