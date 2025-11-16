import { checkAttestationByWallet, checkAttestationByEndpoint } from 'spl402';

async function verifyServerBeforePayment() {
  const apiEndpoint = 'https://api.example.com';
  const serverWallet = 'YourServerWalletAddress';

  console.log('Verifying server attestation...');

  const walletCheck = await checkAttestationByWallet(serverWallet, 'mainnet-beta');

  if (walletCheck.isVerified) {
    console.log('✅ Server wallet is verified on-chain!');
    console.log('API Endpoint:', walletCheck.data?.endpoint);
    console.log('Description:', walletCheck.data?.description);
    console.log('Contact:', walletCheck.data?.contact);
    console.log('Attestation PDA:', walletCheck.attestationPda);
  } else {
    console.log('❌ Server wallet not verified:', walletCheck.error);
  }

  const endpointCheck = await checkAttestationByEndpoint(apiEndpoint, 'mainnet-beta');

  if (endpointCheck.isVerified) {
    console.log('✅ API endpoint is verified on-chain!');
    console.log('Wallet:', endpointCheck.data?.wallet);
    console.log('Description:', endpointCheck.data?.description);
  } else {
    console.log('❌ API endpoint not verified:', endpointCheck.error);
  }
}

verifyServerBeforePayment();
