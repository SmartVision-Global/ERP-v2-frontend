import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetStock } from 'src/actions/store-management/stocks';

import { StockEditView } from 'src/sections/store-management/stocks/view';

// ----------------------------------------------------------------------

const metadata = { title: `Modifier Stock | Dashboard - ${CONFIG.appName}` };

export default function Page({ product_type }) {
  const { id = '' } = useParams();

  const { stock } = useGetStock(id);
  

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <StockEditView stock={stock} product_type={product_type} />
    </>
  );
}
