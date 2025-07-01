import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { LocationAssignmentCreateView } from 'src/sections/r-h/treatment/location-assignment/view';

// ----------------------------------------------------------------------

const metadata = { title: `Ajouter CE - Mission | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <LocationAssignmentCreateView />
    </>
  );
}
