const readline = require('readline');

jest.mock('readline');

readline.createInterface.mockImplementation((args) => ({
  close: jest.fn().mockImplementation(() => undefined),
  question: jest.fn().mockImplementation((question, cb) => cb('jack bravman')),
}));

jest.mock(
  'src/config/env.json',
  () => ({
    LANGUAGE: 'en-US',
    REPORT_ERROR: false,
  }),
  { virtual: true }
);
