import { URL } from 'url';
import app from './services/app.js';

const __dirname = new URL('.', import.meta.url).pathname;
app.init(__dirname);

import { prisma } from '@blablaland/db';
// console.log("site:", )