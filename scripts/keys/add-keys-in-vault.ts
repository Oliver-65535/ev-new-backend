const Vault = require('hashi-vault-js');
const fs = require('fs');

const serverPrivateKeyArmored = fs.readFileSync('../../keys/private.key', {
  encoding: 'utf8',
  flag: 'r',
});

const serverPublicKeyArmored = fs.readFileSync('../../keys/public.key', {
  encoding: 'utf8',
  flag: 'r',
});

const pass = fs.readFileSync('../../keys/passphrase.txt', {
  encoding: 'utf8',
  flag: 'r',
});

const vault = new Vault({
  https: true,
  baseUrl: 'https://archon-vault.sfxdx.com/v1',
  rootPath: 'archon',
  timeout: 5000,
  proxy: false,
});

const token = 'hvs.Emx1qWvuE3848Z5Q2k0cw99v';

const main = async () => {
  const Item = {
    name: 'develop',
    data: {
      privateKey: serverPrivateKeyArmored,
      publicKey: serverPublicKeyArmored,
      passphrase: pass,
    },
  };

  const data = await vault.createKVSecret(token, Item.name, Item.data);
  console.log(data);
};

main();
