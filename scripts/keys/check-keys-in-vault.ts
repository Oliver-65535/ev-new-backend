const Vault = require('hashi-vault-js');

const vault = new Vault({
  https: true,
  baseUrl: 'https://archon-vault.sfxdx.com/v1',
  rootPath: 'archon',
  timeout: 5000,
  proxy: false,
});

const token = 'hvs.Emx1qWvuE3848Z5Q2k0cw99v';
const nameKV = 'develop';
const main = async () => {
  // const status = await vault.healthCheck();
  const { data } = await vault.readKVSecret(token, nameKV);
  console.log(data);
};

main();
