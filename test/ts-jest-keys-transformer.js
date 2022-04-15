const keysTransformer = require('ts-transformer-keys/transformer').default;

module.exports = {
  name: 'jest-ts-keys-transformer',
  version: 1,
  // For ts-jest 26 use:  (cs) => (ctx) => keysTransformer(cs.tsCompiler.program)(ctx);
  factory: (cs) => (ctx) => keysTransformer(cs.program)(ctx),
};
