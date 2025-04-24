import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetSocialLoan } from 'src/actions/social-loan';

import { SocialLoanEditView } from 'src/sections/r-h/entries/social-loan/view';

// ----------------------------------------------------------------------

const metadata = { title: `Modifier Fonction | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const { socialLoan } = useGetSocialLoan(id);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <SocialLoanEditView socialLoan={socialLoan} />
    </>
  );
}
