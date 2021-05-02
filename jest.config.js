// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  clearMocks: true,
  collectCoverageFrom: ['src/**/*.js'],
  coverageThreshold: {
    global: {
      statements: 85,
      branches: 85,
      functions: 0,
      lines: 85,
    },
  },
  coverageDirectory: './coverage-temp',
  coverageProvider: 'babel',
  coverageReporters: ['json-summary', 'text', 'lcov'],
  setupFiles: ['./jest.setup.js'],
  testMatch: ['**/__tests__/**/*.test.js'],
  testPathIgnorePatterns: ['\\\\node_modules\\\\'],
  testTimeout: 30000,
  verbose: false,
};
