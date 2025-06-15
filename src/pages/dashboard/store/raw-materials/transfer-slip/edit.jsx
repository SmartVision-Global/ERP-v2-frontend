import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';

import { TransferSlipEditView } from 'src/sections/store/raw-materials/transfer-slip/view/transferSlip-edit-view';

// ----------------------------------------------------------------------

const metadata = { title: `Modifier le bon de transfert | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id } = useParams();

  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <TransferSlipEditView id={id} />
    </>
  );
}
