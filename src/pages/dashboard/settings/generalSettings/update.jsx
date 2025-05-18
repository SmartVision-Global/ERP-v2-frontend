import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import GeneralSettingsForm from 'src/sections/settings/general-settings/general-settings-form';

// ----------------------------------------------------------------------

const metadata = { title: `Parameter General | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <GeneralSettingsForm />
    </>
  );
}
