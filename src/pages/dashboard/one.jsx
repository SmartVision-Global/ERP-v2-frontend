import { Helmet } from 'react-helmet-async';

import { Box } from '@mui/material';

import { CONFIG } from 'src/global-config';

import { Image } from 'src/components/image';

// ----------------------------------------------------------------------

const metadata = { title: `Page one | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      {/* <BlankView title="Page one" /> */}
      <Box
        sx={{
          height: '700px',
        }}
      >
        <Image src="/logo/logo-svt-2.jpg" sx={{ width: 1, height: 1 }} />
      </Box>
    </>
  );
}
