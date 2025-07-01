import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetCareerKnowledge } from 'src/actions/knowledge-career';

import { CareerEditView } from 'src/sections/r-h/function/career-path/view';

// ----------------------------------------------------------------------

const metadata = { title: `Modifier Parcour professionnel | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const { careerKnowledge } = useGetCareerKnowledge(id);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CareerEditView career={careerKnowledge} />
    </>
  );
}
