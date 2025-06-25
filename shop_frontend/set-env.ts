const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(__dirname, '../.env');

dotenv.config({path: envPath});

const envDir = path.resolve(__dirname, 'src/environments');
const targetPath = path.resolve(envDir, 'environment.ts');

if (!fs.existsSync(envDir)) {
  fs.mkdirSync(envDir, {recursive: true});
}

const environmentFileContent = `
export const environment = {
  production: false,
  AES_KEY: '${process.env["AES_KEY"]}',
  AES_IV: '${process.env["AES_IV"]}',
  apiUrl: '${process.env["API_URL"]}'
};
`;

fs.writeFileSync(targetPath, environmentFileContent);
console.log(`✅ Environment variables written to ${targetPath}`);
