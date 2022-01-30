import { URL } from "url";
import app from "./services/app.js";

import path from 'path';

let __dirname = new URL(".", import.meta.url).pathname;
if (process.platform === "win32") {
  __dirname = path.parse(import.meta.url)['dir'];
}
app.init(__dirname);
