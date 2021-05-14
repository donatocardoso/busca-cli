require('./_mock');

const path = require('path');
const program = require('#src/main');
const { output } = require('#src/utils/message');

const folder = program.commands.find((program) => program.name() === 'folder');

describe('search-cli folder [options] <text> -p [paths...]', () => {
  beforeEach(() => {
    output.length = 0;

    if (folder.opts().paths) delete folder.opts().paths;
    if (folder.opts().details) delete folder.opts().details;
    if (folder.opts().exact) delete folder.opts().exact;
    if (folder.opts().recursive) delete folder.opts().recursive;
    if (folder.opts().caseSensitive) delete folder.opts().caseSensitive;
  });

  it('should return no files found', () => {
    folder.parse([
      'node',
      'test',
      'anthony mackie kerry',
      '-p',
      './example/data/arquivo00.txt',
      './example/data/nao-existe',
    ]);

    expect(folder.args).toEqual(['anthony mackie kerry']);

    expect(output).toContain('0 matches were found for the term "anthony mackie kerry"');
    expect(output).toContain('No files found!');
  });

  it('should return a file found: ./example/data/arquivo01.txt', () => {
    folder.parse(['node', 'test', 'anthony mackie kerry', '-p', './example/data']);

    expect(folder.args).toEqual(['anthony mackie kerry']);

    expect(output).toContain('1 matches were found for the term "anthony mackie kerry"');
    expect(output).toContain(path.resolve(process.cwd(), './example/data/arquivo01.txt'));
  });

  it('should return a file found: -e ./example/data/arquivo01.txt', () => {
    folder.parse(['node', 'test', '-e', 'anthony mackie kerry', '-p', './example/data']);

    expect(folder.args).toEqual(['anthony mackie kerry']);
    expect(folder.opts()).toEqual({ paths: expect.any(Array), exact: true });

    expect(output).toContain('1 matches were found for the term "anthony mackie kerry"');
    expect(output).toContain(path.resolve(process.cwd(), './example/data/arquivo01.txt'));
  });

  it('should return a file found: -er ./example/data/arquivo01.txt', () => {
    folder.parse(['node', 'test', '-er', 'anthony mackie kerry', '-p', './example/data']);

    expect(folder.args).toEqual(['anthony mackie kerry']);
    expect(folder.opts()).toEqual({ paths: expect.any(Array), exact: true, recursive: true });

    expect(output).toContain('1 matches were found for the term "anthony mackie kerry"');
    expect(output).toContain(path.resolve(process.cwd(), './example/data/arquivo01.txt'));
  });

  it('should return a file found: -rcs ./example/data/arquivo01.txt', () => {
    folder.parse(['node', 'test', '-rcs', 'anthony mackie kerry', '-p', './example/data']);

    expect(folder.args).toEqual(['anthony mackie kerry']);
    expect(folder.opts()).toEqual({ paths: expect.any(Array), recursive: true, caseSensitive: true });

    expect(output).toContain('1 matches were found for the term "anthony mackie kerry"');
    expect(output).toContain(path.resolve(process.cwd(), './example/data/arquivo01.txt'));
  });

  it('should return two files found: -dr ./example/data/arquivo01.txt and ./example/data/arquivo06.txt', () => {
    folder.parse(['node', 'test', '-dr', 'anthony mackie kerry', '-p', './example/data']);

    expect(folder.args).toEqual(['anthony mackie kerry']);
    expect(folder.opts()).toEqual({ paths: expect.any(Array), details: true, recursive: true });

    expect(output).toContain('Options..........................: details,paths,recursive');
    expect(output).toContain('Were found.......................: 2 files!');
  });
});
