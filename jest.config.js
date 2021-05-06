// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  clearMocks: true,
  collectCoverageFrom: ['src/**/*.js'],
  coverageThreshold: {
    global: {
      statements: 90,
      branches: 90,
      functions: 90,
      lines: 90,
    },
  },
  coverageDirectory: './coverage-temp',
  coverageProvider: 'babel',
  coveragePathIgnorePatterns: ['<rootDir>/src/utils'],
  coverageReporters: ['json-summary', 'text', 'lcov'],
  moduleNameMapper: {
    'env.json': '<rootDir>/src/config/env.json',
  },
  setupFiles: ['./jest.setup.js'],
  testMatch: ['**/__tests__/unit/pt-BR/*.test.js', '**/__tests__/unit/en-US/*.test.js'],
  testPathIgnorePatterns: ['\\\\node_modules\\\\'],
  testTimeout: 30000,
  verbose: true,
};
