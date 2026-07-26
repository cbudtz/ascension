/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      from: {},
      to: {
        circular: true,
      },
    },
    {
      name: 'pure-production-does-not-use-node-core',
      severity: 'error',
      from: {
        path: '^src/(?:core|application|content)(?:/|$)',
        pathNot: '[.]test[.]ts$',
      },
      to: {
        dependencyTypes: ['core'],
      },
    },
    {
      name: 'pure-production-does-not-use-external-packages',
      severity: 'error',
      from: {
        path: '^src/(?:core|application|content)(?:/|$)',
        pathNot: '[.]test[.]ts$',
      },
      to: {
        dependencyTypes: [
          'npm',
          'npm-bundled',
          'npm-dev',
          'npm-no-pkg',
          'npm-optional',
          'npm-peer',
          'npm-unknown',
        ],
      },
    },
    {
      name: 'core-is-independent',
      severity: 'error',
      from: {
        path: '^src/core(?:/|$)',
      },
      to: {
        path: '^src/(?:application|content|presentation|infrastructure|bootstrap)(?:/|$)',
      },
    },
    {
      name: 'application-does-not-depend-on-adapters',
      severity: 'error',
      from: {
        path: '^src/application(?:/|$)',
      },
      to: {
        path: '^src/(?:content|presentation|infrastructure|bootstrap)(?:/|$)',
      },
    },
    {
      name: 'content-does-not-depend-on-adapters',
      severity: 'error',
      from: {
        path: '^src/content(?:/|$)',
      },
      to: {
        path: '^src/(?:application|presentation|infrastructure|bootstrap)(?:/|$)',
      },
    },
    {
      name: 'infrastructure-depends-only-on-application-and-core',
      severity: 'error',
      from: {
        path: '^src/infrastructure(?:/|$)',
      },
      to: {
        path: '^src/(?:content|presentation|bootstrap)(?:/|$)',
      },
    },
    {
      name: 'presentation-depends-only-on-application-and-core',
      severity: 'error',
      from: {
        path: '^src/presentation(?:/|$)',
      },
      to: {
        path: '^src/(?:content|infrastructure|bootstrap)(?:/|$)',
      },
    },
  ],
  options: {
    doNotFollow: {
      path: 'node_modules',
    },
    tsConfig: {
      fileName: 'tsconfig.json',
    },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'types', 'default'],
    },
  },
};
