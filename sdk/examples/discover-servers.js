import { queryVerifiedServers } from 'spl402';

async function discoverAllServers() {
  console.log('Querying all verified SPL402 servers...\n');

  try {
    const servers = await queryVerifiedServers('mainnet-beta');

    console.log(`Found ${servers.length} verified servers:\n`);

    servers.forEach((server, index) => {
      console.log(`Server ${index + 1}:`);
      console.log(`  Wallet: ${server.wallet}`);
      console.log(`  Endpoint: ${server.endpoint}`);
      console.log(`  Description: ${server.description}`);
      console.log(`  Contact: ${server.contact}`);
      console.log(`  Attestation PDA: ${server.attestationPda}`);
      console.log('');
    });

    return servers;
  } catch (error) {
    console.error('Failed to query servers:', error.message);
    return [];
  }
}

async function findServerByDescription(keyword) {
  const servers = await queryVerifiedServers('mainnet-beta');

  const matches = servers.filter(s =>
    s.description.toLowerCase().includes(keyword.toLowerCase())
  );

  console.log(`Found ${matches.length} servers matching "${keyword}":`);
  matches.forEach(server => {
    console.log(`  ${server.description} - ${server.endpoint}`);
  });

  return matches;
}

discoverAllServers();
