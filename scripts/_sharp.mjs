import { createRequire } from 'node:module';

// sharp is installed globally (via sharp-cli). Resolve it without adding a project dependency.
const require = createRequire(import.meta.url);
const sharp = require('C:/Users/Mtech/AppData/Roaming/npm/node_modules/sharp-cli/node_modules/sharp');

export default sharp;
