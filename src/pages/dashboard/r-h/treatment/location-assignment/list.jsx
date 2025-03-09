import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { LocationAssignmentListView } from 'src/sections/r-h/treatment/location-assignment/view';

// ----------------------------------------------------------------------

const metadata = { title: `CE - Mission | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <LocationAssignmentListView />
    </>
  );
}
