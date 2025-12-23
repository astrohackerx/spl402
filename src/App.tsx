import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import '@solana/wallet-adapter-react-ui/styles.css';

import Home from './pages/Home';
import Docs from './pages/Docs';
import Proxy from './pages/Proxy';
import Templates from './pages/Templates';
import { Verify } from './pages/Verify';
import { Explorer } from './pages/Explorer';
import { ServerProfile } from './pages/ServerProfile';

export default function App() {
  const endpoint = 'https://api.mainnet-beta.solana.com';
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/docs" element={<Docs />} />
              <Route path="/proxy" element={<Proxy />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/verify" element={<Verify />} />
              <Route path="/explorer" element={<Explorer />} />
              <Route path="/server/:attestationPda" element={<ServerProfile />} />
            </Routes>
          </BrowserRouter>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
