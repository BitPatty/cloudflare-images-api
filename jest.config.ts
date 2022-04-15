import type { Config } from '@jest/types';

export default (): Config.InitialOptions => {
  return {
    preset: 'ts-jest',
    testEnvironment: 'node',
    coverageReporters: ['lcov', 'html', 'json'],
    setupFilesAfterEnv: ['./jest.setup.ts'],
    verbose: true,
    testMatch: ['**/*.test.ts'],
    globals: {
      'ts-jest': {
        compiler: 'ttypescript',
        astTransformers: {
          before: ['./test/ts-jest-keys-transformer.js'],
        },
      },
    },
  };
};