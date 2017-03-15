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
  testsBuild: resolveApp('.tests'),
  integrationAuthTests: resolveApp('src/tests/integration/functions/auth'),
  integrationTokenTests: resolveApp('src/tests/integration/functions/token'),
  integrationResourceTests: resolveApp('src/tests/integration/functions/resource'),
  integrationUserTests: resolveApp('src/tests/integration/functions/user'),
  unitAccessTokenRepositoryTest: resolveApp('src/tests/unit/repositories/AccessTokenRepository'),
  unitAuthValidationServiceTest: resolveApp('src/tests/unit/domain/auth/AuthValidationService'),
  unitResourceValidationServiceTest: resolveApp('src/tests/unit/domain/resource/ResourceValidationService'),
  unitTokenValidationServiceTest: resolveApp('src/tests/unit/domain/token/TokenValidationService'),
  unitUserValidationServiceTest: resolveApp("src/tests/unit/domain/user/UserValidationService"),
  appPackageJson: resolveApp('package.json'),
  appNodeModules: resolveApp('node_modules'),
  nodePaths: nodePaths
};
