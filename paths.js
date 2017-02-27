const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const nodePaths = (process.env.NODE_PATH || '')
  .split(':')
  .filter(Boolean)
  .map(resolveApp);

module.exports = {
  appBuild: resolveApp('.webpack'),
  appFunctions: resolveApp('src/functions'),
  integrationAuthTests: resolveApp('src/tests/integration/functions/auth'),
  integrationTokenTests: resolveApp('src/tests/integration/functions/token'),
  appPackageJson: resolveApp('package.json'),
  appNodeModules: resolveApp('node_modules'),
  nodePaths: nodePaths
};
