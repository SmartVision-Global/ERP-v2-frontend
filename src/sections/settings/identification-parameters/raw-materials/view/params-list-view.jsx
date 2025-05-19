import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetCategories, useGetReturnPatterns } from 'src/actions/settings/identification/raw-materials';

import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ParamsList } from '../params-list';

// ----------------------------------------------------------------------

export function ParamsListView() {
  // const { entities } = useGetIdentificationEntities();
  const { categories } = useGetCategories(1);
  const { returnPatterns } = useGetReturnPatterns(1, 1);
  const entities ={ 
    categories: categories || [] ,
    returnPatterns: returnPatterns || [],
  };

  console.log('categories params list view raw materials', categories);
  console.log('returnPatterns params list view raw materials', returnPatterns);

  const notFound = !entities;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Liste des matières premières"
        links={[
          { name: 'Paramètres', href: paths.dashboard.settings.root },
          { name: "Parametrage d'identification", href: paths.dashboard.settings.identification.root },
          { name: 'Liste des matières premières' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {notFound && <EmptyContent filled sx={{ py: 10 }} />}

      <ParamsList data={entities} />
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------
