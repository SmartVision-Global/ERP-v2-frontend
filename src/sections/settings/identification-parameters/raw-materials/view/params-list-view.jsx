import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { useIdentification } from 'src/contexts/IdentificationContext';
import { useGetCategories, useGetReturnPatterns, useGetFamilies } from 'src/actions/settings/identification/raw-materials';

import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ParamsList } from '../params-list';

// ----------------------------------------------------------------------

export function ParamsListView() {
  // const { entities } = useGetIdentificationEntities();
  const { group, nature } = useIdentification();
  const { categories } = useGetCategories(group);
  const { returnPatterns } = useGetReturnPatterns(group, nature);
  const { families } = useGetFamilies(group, true);
  const entities ={ 
    categories: categories || [],
    returnPatterns: returnPatterns || [],
    families: families || [],
  };

  const notFound = !entities;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Liste"
        links={[
          { name: 'Paramètres', href: paths.dashboard.settings.root },
          { name: "Parametrage d'identification", href: paths.dashboard.settings.identification.root },
          { name: 'Liste' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {notFound && <EmptyContent filled sx={{ py: 10 }} />}

      <ParamsList data={entities} />
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------
