import { orderBy } from 'es-toolkit';
import { useSetState } from 'minimal-shared/hooks';

import { paths } from 'src/routes/paths';

import { _RhSettingsIdent } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetIdentificationEntities } from 'src/actions/identification';

import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { JobList } from '../params-list';

// ----------------------------------------------------------------------

export function ParamsListView() {
  const { entities, entitiesLoading } = useGetIdentificationEntities();
  console.log('en', entities);

  const filters = useSetState({
    roles: [],
    locations: [],
    benefits: [],
    experience: 'all',
    employmentTypes: [],
  });
  const { state: currentFilters } = filters;

  const dataFiltered = applyFilter({
    inputData: _RhSettingsIdent,
    filters: currentFilters,
  });

  const canReset =
    currentFilters.roles.length > 0 ||
    currentFilters.locations.length > 0 ||
    currentFilters.benefits.length > 0 ||
    currentFilters.employmentTypes.length > 0 ||
    currentFilters.experience !== 'all';

  const notFound = !dataFiltered.length && canReset;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="List"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: "Parametrage d'identification", href: paths.dashboard.rh.rhSettings.root },
          { name: 'List' },
        ]}
        // action={
        //   <Button
        //     component={RouterLink}
        //     href={paths.dashboard.job.new}
        //     variant="contained"
        //     startIcon={<Iconify icon="mingcute:add-line" />}
        //   >
        //     New job
        //   </Button>
        // }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {notFound && <EmptyContent filled sx={{ py: 10 }} />}

      <JobList data={entities} />
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, filters, sortBy }) {
  const { employmentTypes, experience, roles, locations, benefits } = filters;

  // Sort by
  if (sortBy === 'latest') {
    inputData = orderBy(inputData, ['createdAt'], ['desc']);
  }

  if (sortBy === 'oldest') {
    inputData = orderBy(inputData, ['createdAt'], ['asc']);
  }

  if (sortBy === 'popular') {
    inputData = orderBy(inputData, ['totalViews'], ['desc']);
  }

  // Filters
  if (employmentTypes.length) {
    inputData = inputData.filter((job) =>
      job.employmentTypes.some((item) => employmentTypes.includes(item))
    );
  }

  if (experience !== 'all') {
    inputData = inputData.filter((job) => job.experience === experience);
  }

  if (roles.length) {
    inputData = inputData.filter((job) => roles.includes(job.role));
  }

  if (locations.length) {
    inputData = inputData.filter((job) => job.locations.some((item) => locations.includes(item)));
  }

  if (benefits.length) {
    inputData = inputData.filter((job) => job.benefits.some((item) => benefits.includes(item)));
  }

  return inputData;
}
