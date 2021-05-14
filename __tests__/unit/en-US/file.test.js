require('./_mock');

const path = require('path');
const program = require('#src/main');
const { output } = require('#src/utils/message');

const file = program.commands.find((program) => program.name() === 'file');

describe('search-cli file [options] <text> -p [paths...]', () => {
  beforeEach(() => {
    output.length = 0;

    if (file.opts().paths) delete file.opts().paths;
    if (file.opts().details) delete file.opts().details;
    if (file.opts().exact) delete file.opts().exact;
    if (file.opts().caseSensitive) delete file.opts().caseSensitive;
  });

  it('should return no files found', () => {
    file.parse(['node', 'test', 'robert conrad karen', '-p', './example/data/arquivo.txt', './example/data/subfolder']);

    expect(file.args).toEqual(['robert conrad karen']);

    expect(output).toContain('0 matches were found for the term "robert conrad karen"');
    expect(output).toContain('No files found!');
  });

  it('should return a file found: ./example/data/arquivo00.txt', () => {
    file.parse(['node', 'test', 'robert conrad karen', '-p', './example/data/arquivo00.txt']);

    expect(file.args).toEqual(['robert conrad karen']);

    expect(output).toContain('1 matches were found for the term "robert conrad karen"');
    expect(output).toContain(path.resolve(process.cwd(), './example/data/arquivo00.txt'));
  });

  it('should return a file found: -e ./example/data/arquivo00.txt', () => {
    file.parse([
      'node',
      'test',
      '-e',
      'robert conrad karen',
      '-p',
      './example/data/arquivo00.txt',
      './example/data/subfolder/arquivo05.txt',
    ]);

    expect(file.args).toEqual(['robert conrad karen']);
    expect(file.opts()).toEqual({ paths: expect.any(Array), exact: true });

    expect(output).toContain('1 matches were found for the term "robert conrad karen"');
    expect(output).toContain(path.resolve(process.cwd(), './example/data/arquivo00.txt'));
  });

  it('should return a file found: -cs ./example/data/arquivo00.txt', () => {
    file.parse([
      'node',
      'test',
      '-cs',
      'robert conrad karen',
      '-p',
      './example/data/arquivo00.txt',
      './example/data/subfolder/arquivo05.txt',
    ]);

    expect(file.args).toEqual(['robert conrad karen']);
    expect(file.opts()).toEqual({ paths: expect.any(Array), caseSensitive: true });

    expect(output).toContain('1 matches were found for the term "robert conrad karen"');
    expect(output).toContain(path.resolve(process.cwd(), './example/data/arquivo00.txt'));
  });

  it('should return a file found: -decs ./example/data/arquivo00.txt', () => {
    file.parse([
      'node',
      'test',
      '-decs',
      'robert conrad karen',
      '-p',
      './example/data/arquivo00.txt',
      './example/data/subfolder/arquivo05.txt',
    ]);

    expect(file.args).toEqual(['robert conrad karen']);
    expect(file.opts()).toEqual({ paths: expect.any(Array), details: true, exact: true, caseSensitive: true });

    expect(output).toContain('Options..........................: caseSensitive,details,exact,paths');
    expect(output).toContain('Were found.......................: 1 files!');
  });
});
