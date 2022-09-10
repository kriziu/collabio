import '../common/styles/global.css';
import { MotionConfig } from 'framer-motion';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ToastContainer } from 'react-toastify';
import { RecoilRoot } from 'recoil';

import { DEFAULT_EASE } from '@/common/constants/easings';
import { ModalManager } from '@/modules/modal';

import 'react-toastify/dist/ReactToastify.min.css';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>Collabio | Online Whiteboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <RecoilRoot>
        <ToastContainer />
        <MotionConfig transition={{ ease: DEFAULT_EASE }}>
          <ModalManager />
          <Component {...pageProps} />
        </MotionConfig>
      </RecoilRoot>
    </>
  );
};

export default App;
