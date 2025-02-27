import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';

import { DocumentCreateView } from 'src/sections/r-h/personal/documents/view/document-create-view';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new document personnel | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DocumentCreateView />
    </>
  );
}
