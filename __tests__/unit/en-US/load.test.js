require('./_mock');

const path = require('path');
const program = require('#src/main');
const { output } = require('#src/utils/message');

const load = program.commands.find((program) => program.name() === 'load');

describe('search-cli load [options] -p [paths...]', () => {
  beforeEach(() => {
    output.length = 0;

    if (load.opts().paths) delete load.opts().paths;
    if (load.opts().details) delete load.opts().details;
    if (load.opts().exact) delete load.opts().exact;
    if (load.opts().recursive) delete load.opts().recursive;
    if (load.opts().caseSensitive) delete load.opts().caseSensitive;
  });

  it('should return no files found', () => {
    load.parse(['node', 'test', '-p', './example/folder']);

    expect(load.opts()).toEqual({ paths: expect.any(Array) });

    expect(output).toContain('Options..........................: paths');
    expect(output).toContain('Were load........................: 0 files!');
    expect(output).toContain('0 matches were found by the term "jack bravman"');
    expect(output).toContain('No files found!');
  });

  it('should return all files found', () => {
    load.parse(['node', 'test', '-p', './example/data']);

    expect(load.opts()).toEqual({ paths: expect.any(Array) });

    expect(output).toContain('Options..........................: paths');
    expect(output).toContain('Were load........................: 5 files!');
    expect(output).toContain('2 matches were found by the term "jack bravman"');
    expect(output).toContain(path.resolve(process.cwd(), './example/data/arquivo02.txt'));
    expect(output).toContain(path.resolve(process.cwd(), './example/data/arquivo03.txt'));
  });

  it('should return a file found: -e', () => {
    load.parse(['node', 'test', '-e', '-p', './example/data']);

    expect(load.opts()).toEqual({ paths: expect.any(Array), exact: true });

    expect(output).toContain('Options..........................: exact,paths');
    expect(output).toContain('Were load........................: 5 files!');
    expect(output).toContain('1 matches were found by the term "jack bravman"');
    expect(output).toContain(path.resolve(process.cwd(), './example/data/arquivo03.txt'));
  });

  it('should return a file found: -er', () => {
    load.parse(['node', 'test', '-er', '-p', './example/data']);

    expect(load.opts()).toEqual({ paths: expect.any(Array), exact: true, recursive: true });

    expect(output).toContain('Options..........................: exact,paths,recursive');
    expect(output).toContain('Were load........................: 10 files!');
    expect(output).toContain('2 matches were found by the term "jack bravman"');
    expect(output).toContain(path.resolve(process.cwd(), './example/data/arquivo03.txt'));
    expect(output).toContain(path.resolve(process.cwd(), './example/data/subfolder/arquivo08.txt'));
  });

  it('should return a file found: -ercs', () => {
    load.parse(['node', 'test', '-ercs', '-p', './example/data']);

    expect(load.opts()).toEqual({ paths: expect.any(Array), exact: true, recursive: true, caseSensitive: true });

    expect(output).toContain('Options..........................: caseSensitive,exact,paths,recursive');
    expect(output).toContain('Were load........................: 10 files!');
    expect(output).toContain('1 matches were found by the term "jack bravman"');
    expect(output).toContain(path.resolve(process.cwd(), './example/data/subfolder/arquivo08.txt'));
  });

  it('should return all files found: -d', () => {
    load.parse([
      'node',
      'test',
      '-d',
      'jack bravman',
      '-p',
      './example/data',
      './example/data/subfolder/arquivo08.txt',
    ]);

    expect(load.args).toEqual(['jack bravman']);
    expect(load.opts()).toEqual({ paths: expect.any(Array), details: true });

    expect(output).toContain('Options..........................: details,paths');
    expect(output).toContain('Were load........................: 6 files!');
    expect(output).toContain('3 matches were found by the term "jack bravman"');
    expect(output).toContain('Were found.......................: 3 files!');
  });
});
