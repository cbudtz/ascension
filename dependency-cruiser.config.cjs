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
    exclude: {
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
