const openpgp = require('openpgp');
const fs = require('fs');

// get new instance of the client
var vault = require('node-vault')(options);

const curve = 'ed25519'; // ECC curve name, defaults to curve25519
const userIDs = [{ name: 'server_key', email: 'server@archon.com' }]; // you can pass multiple user IDs
const passphrase = 'archonserverprivatekeypassword'; // protects the private key

async function generateKeys() {
  const { privateKey, publicKey, revocationCertificate } =
    await openpgp.generateKey({
      type: 'ecc', // Type of the key, defaults to ECC
      curve,
      userIDs,
      passphrase,
      format: 'armored', // output key format, defaults to 'armored' (other options: 'binary' or 'object')
    });

  console.log(privateKey); // '-----BEGIN PGP PRIVATE KEY BLOCK ... '
  console.log(publicKey); // '-----BEGIN PGP PUBLIC KEY BLOCK ... '
  console.log(revocationCertificate); // '-----BEGIN PGP PUBLIC KEY BLOCK ... '

  fs.writeFileSync('./keys/private.key', privateKey);
  fs.writeFileSync('./keys/public.key', publicKey);
  fs.writeFileSync('./keys/revocation.crt', revocationCertificate);
  fs.writeFileSync('./keys/passphrase.txt', passphrase);

}

generateKeys();
