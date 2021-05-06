require('./_mock');

const program = require('#src/main');
const { output } = require('#src/utils/message');

const environment = program.commands.find((command) => command.name() === 'environment');

describe('search-cli environment [options] [commands]', () => {
  beforeEach(() => {
    output.length = 0;

    if (environment.opts().name) delete environment.opts().name;
    if (environment.opts().value) delete environment.opts().value;
  });

  it('should return all environment variables', () => {
    environment.parse(['node', 'test']);

    expect(output).toContain('Environment variables:');
    expect(output[2]).toMatch(/^LANGUAGE=/);
    expect(output[3]).toMatch(/^REPORT_ERROR=/);
  });

  it('should return all environment variables', () => {
    environment.parse(['node', 'test', 'list']);

    expect(output).toContain('Environment variables:');
    expect(output[2]).toMatch(/^LANGUAGE=/);
    expect(output[3]).toMatch(/^REPORT_ERROR=/);
  });

  it('should return environment variable not found error', () => {
    environment.parse(['node', 'test', 'get', 'LANGUAGES']);

    expect(environment.args).toEqual(['get', 'LANGUAGES']);

    expect(output[0]).toMatch('Environment variable LANGUAGES not found...');
  });

  it('should return the LANGUAGE environment variable', () => {
    environment.parse(['node', 'test', 'get', 'LANGUAGE']);

    expect(environment.args).toEqual(['get', 'LANGUAGE']);

    expect(output[0]).toMatch('Environment variable LANGUAGE: en-US');
  });

  it('should return environment variable not found error', () => {
    environment.parse(['node', 'test', 'set', 'LANGUAGES', 'en-US']);

    expect(environment.args).toEqual(['set', 'LANGUAGES', 'en-US']);

    expect(output[0]).toMatch('Environment variable LANGUAGES not found...');
  });

  it('should return unavailable language error', () => {
    environment.parse(['node', 'test', 'set', 'LANGUAGE', 'en-GB']);

    expect(environment.args).toEqual(['set', 'LANGUAGE', 'en-GB']);

    expect(output[0]).toMatch('The language en-GB is not available.');
  });

  it('should return success in the language change', () => {
    environment.parse(['node', 'test', 'set', 'LANGUAGE', 'en-US']);

    expect(environment.args).toEqual(['set', 'LANGUAGE', 'en-US']);

    expect(output[0]).toMatch('Success to change environment variable LANGUAGE');
  });
});
