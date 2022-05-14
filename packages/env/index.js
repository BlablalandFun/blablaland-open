const fs = require('fs');
const dotenv = require('dotenv');

const envPath = '../../.env';
if (fs.existsSync(envPath)) {
  console.log('Using .env file to supply config environment variables (root of project)');
  dotenv.config({ path: '../../.env' });
} else {
  dotenv.config();
}
