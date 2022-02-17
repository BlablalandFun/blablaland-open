import path from "path";
import semver from "semver";
import { URL } from "url";

if (semver.lt(process.versions.node, "16.14.0")) {
  throw new Error("Please use Node.js 16.14.0 or higher");
}

let __dirname = new URL(".", import.meta.url).pathname;
if (process.platform === "win32") {
  __dirname = path.parse(import.meta.url)["dir"];
}

import("./services/app.js").then((app) => {
  app.default.init(path.resolve(__dirname, ".."));
});
