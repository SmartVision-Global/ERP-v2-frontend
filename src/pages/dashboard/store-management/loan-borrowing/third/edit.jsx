import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetThird } from 'src/actions/store-management/third';

import { ThirdEditView } from 'src/sections/store-management/loan-borrowing/third/view';

// ----------------------------------------------------------------------

const metadata = { title: `Modifier Tier | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const { third } = useGetThird(id);
  

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ThirdEditView third={third} />
    </>
  );
}
