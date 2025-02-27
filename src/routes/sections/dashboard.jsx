import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';

import { CONFIG } from 'src/global-config';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';

import { usePathname } from '../hooks';

// ----------------------------------------------------------------------

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
const PageRhDocumentPersonelNew = lazy(
  () => import('src/pages/dashboard/r-h/personal/documents/new')
);

const PageRhFonctionTaskList = lazy(
  () => import('src/pages/dashboard/r-h/fonction/task-resp/list')
);
const PageRhFonctionTaskNew = lazy(() => import('src/pages/dashboard/r-h/fonction/task-resp/new'));

const PageRhFonctionCareerPathList = lazy(
  () => import('src/pages/dashboard/r-h/fonction/career-path/list')
);
const PageRhFonctionCareerPathNew = lazy(
  () => import('src/pages/dashboard/r-h/fonction/career-path/new')
);

const PageRhFonctionFonctionsList = lazy(
  () => import('src/pages/dashboard/r-h/fonction/fonctions/list')
);
const PageRhFonctionFonctionsNew = lazy(
  () => import('src/pages/dashboard/r-h/fonction/fonctions/new')
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

const PageRhSettingsJobProgramsList = lazy(
  () => import('src/pages/dashboard/r-h/rh-settings/programmes-travail/list')
);
const PageRhSettingsJobProgramsNew = lazy(
  () => import('src/pages/dashboard/r-h/rh-settings/programmes-travail/new')
);

const PageRhSettingsDeductionsCompensationList = lazy(
  () => import('src/pages/dashboard/r-h/rh-settings/retenue-indemnite/list')
);
const PageRhSettingsDeductionsCompensationNew = lazy(
  () => import('src/pages/dashboard/r-h/rh-settings/retenue-indemnite/new')
);

const PageRhSettingsSalaryGridList = lazy(
  () => import('src/pages/dashboard/r-h/rh-settings/grille-salaire/list')
);
const PageRhSettingsSalaryGridNew = lazy(
  () => import('src/pages/dashboard/r-h/rh-settings/grille-salaire/new')
);

const PageRhSettingsCnasRateList = lazy(
  () => import('src/pages/dashboard/r-h/rh-settings/taux-cnas/list')
);
const PageRhSettingsCnasRateNew = lazy(
  () => import('src/pages/dashboard/r-h/rh-settings/taux-cnas/new')
);

const PageRhSettingsAgenciesList = lazy(
  () => import('src/pages/dashboard/r-h/rh-settings/agences/list')
);
const PageRhSettingsAgenciesNew = lazy(
  () => import('src/pages/dashboard/r-h/rh-settings/agences/new')
);

// ----------------------------------------------------------------------

const PageRhDemandeSortieAgenciesNew = lazy(
  () => import('src/pages/dashboard/r-h/demandes/sortie/list')
);
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
const PageRhEntriesSocialLoan = lazy(
  () => import('src/pages/dashboard/r-h/entries/social-loan/list')
);
const PageRhEntriesSocialLoanNew = lazy(
  () => import('src/pages/dashboard/r-h/entries/social-loan/new')
);

const PageRhEntriesLeaveAbsence = lazy(
  () => import('src/pages/dashboard/r-h/entries/leave-absence/list')
);
const PageRhEntriesLeaveAbsenceNew = lazy(
  () => import('src/pages/dashboard/r-h/entries/leave-absence/new')
);
const PageRhEntriesPermanence = lazy(
  () => import('src/pages/dashboard/r-h/entries/permanence/list')
);
const PageRhEntriesPermanenceNew = lazy(
  () => import('src/pages/dashboard/r-h/entries/permanence/new')
);

const PageRhEntriesOvertime = lazy(() => import('src/pages/dashboard/r-h/entries/overtime/list'));
const PageRhEntriesOvertimeNew = lazy(() => import('src/pages/dashboard/r-h/entries/overtime/new'));

const PageRhEntriesRecovery = lazy(() => import('src/pages/dashboard/r-h/entries/recovery/list'));
const PageRhEntriesRecoveryNew = lazy(() => import('src/pages/dashboard/r-h/entries/recovery/new'));

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
            ],
          },
          {
            path: 'fonction',

            children: [
              { path: 'task-responsabilities', element: <PageRhFonctionTaskList />, index: true },
              { path: 'task-responsabilities/new', element: <PageRhFonctionTaskNew /> },

              { path: 'career-path', element: <PageRhFonctionCareerPathList /> },
              { path: 'career-path/new', element: <PageRhFonctionCareerPathNew /> },

              { path: 'fonctions', element: <PageRhFonctionFonctionsList /> },
              { path: 'fonctions/new', element: <PageRhFonctionFonctionsNew /> },

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

              { path: 'work-programs', element: <PageRhSettingsJobProgramsList /> },
              { path: 'work-programs/new', element: <PageRhSettingsJobProgramsNew /> },

              {
                path: 'deductions-compensation',
                element: <PageRhSettingsDeductionsCompensationList />,
              },
              {
                path: 'deductions-compensation/new',
                element: <PageRhSettingsDeductionsCompensationNew />,
              },

              { path: 'salary-grid', element: <PageRhSettingsSalaryGridList /> },
              { path: 'salary-grid/new', element: <PageRhSettingsSalaryGridNew /> },

              { path: 'cnas-rate', element: <PageRhSettingsCnasRateList /> },
              { path: 'cnas-rate/new', element: <PageRhSettingsCnasRateNew /> },

              { path: 'agencies', element: <PageRhSettingsAgenciesList /> },
              { path: 'agencies/new', element: <PageRhSettingsAgenciesNew /> },
            ],
          },
          {
            path: 'demandes',
            children: [
              { path: 'sortie', element: <PageRhDemandeSortieAgenciesNew /> },
              { path: 'conge', element: <PageRhDemandeSortieAgenciesNew /> },
              { path: 'recuperation', element: <PageRhDemandeSortieAgenciesNew /> },
              { path: 'pret', element: <PageRhDemandeSortieAgenciesNew /> },
              { path: 'aide', element: <PageRhDemandeAideAgenciesNew /> },
            ],
          },
          {
            path: 'entries',
            children: [
              { path: 'social-loan', element: <PageRhEntriesSocialLoan /> },
              { path: 'social-loan/new', element: <PageRhEntriesSocialLoanNew /> },

              { path: 'leave-absence', element: <PageRhEntriesLeaveAbsence /> },
              { path: 'leave-absence/new', element: <PageRhEntriesLeaveAbsenceNew /> },

              { path: 'permanence', element: <PageRhEntriesPermanence /> },
              { path: 'permanence/new', element: <PageRhEntriesPermanenceNew /> },

              { path: 'overtime', element: <PageRhEntriesOvertime /> },
              { path: 'overtime/new', element: <PageRhEntriesOvertimeNew /> },

              { path: 'recovery', element: <PageRhEntriesRecovery /> },
              { path: 'recovery/new', element: <PageRhEntriesRecoveryNew /> },
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
