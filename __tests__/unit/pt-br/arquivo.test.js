const path = require('path');
const programa = require('../../../src/pt-br/principal');
const { output } = require('../../../src/utils/message');

const arquivo = programa.commands.find((programa) => programa.name() === 'arquivo');

describe('busca-cli arquivo [opcoes] <texto> -c [caminhos...]', () => {
  beforeEach(() => {
    output.length = 0;

    if (arquivo.opts().caminhos) delete arquivo.opts().caminhos;
    if (arquivo.opts().detalhes) delete arquivo.opts().detalhes;
    if (arquivo.opts().exato) delete arquivo.opts().exato;
    if (arquivo.opts().sensivel) delete arquivo.opts().sensivel;
  });

  it('deve retornar as intruções de uso do comando', () => {
    expect(arquivo.helpInformation().split('\n')).toEqual([
      'Usage: busca-cli arquivo [opcoes] <texto> -c [caminhos...]',
      '',
      'Verifica se o(s) arquivo(s) possue(em) o texto informado',
      '',
      'Arguments:',
      '  texto                            Texto de busca no arquivo',
      '',
      'Options:',
      '  -c,   --caminhos  [caminhos...]  Arquivo(s) em que a verificação será realizada',
      '  -d,   --detalhes                 Retorna detalhes do(s) arquivo(s)',
      '  -e,   --exato                    Busca pela sentença exata informada',
      '  -s,   --sensivel                 Diferencia maiúscula de minúscula',
      '  -a,   --ajuda                    Exibi ajuda para usar o comando',
      '',
    ]);
  });

  it('deve retornar nenhum arquivo encontrado', () => {
    arquivo.parse([
      'node',
      'test',
      'robert conrad karen',
      '-c',
      './example/data/arquivo.txt',
      './example/data/subfolder',
    ]);

    expect(arquivo.args).toEqual(['robert conrad karen']);

    expect(output).toContain('Foram encontradas 0 ocorrências pelo termo "robert conrad karen"');
    expect(output).toContain('Nenhum arquivo encontrado!');
  });

  it('deve retornar um arquivo encontrado: ./example/data/arquivo00.txt', () => {
    arquivo.parse(['node', 'test', 'robert conrad karen', '-c', './example/data/arquivo00.txt']);

    expect(arquivo.args).toEqual(['robert conrad karen']);

    expect(output).toContain('Foram encontradas 1 ocorrências pelo termo "robert conrad karen"');
    expect(output).toContain(path.resolve(process.cwd(), './example/data/arquivo00.txt'));
  });

  it('deve retornar um arquivo encontrados: -e ./example/data/arquivo00.txt', () => {
    arquivo.parse([
      'node',
      'test',
      '-e',
      'robert conrad karen',
      '-c',
      './example/data/arquivo00.txt',
      './example/data/subfolder/arquivo05.txt',
    ]);

    expect(arquivo.args).toEqual(['robert conrad karen']);
    expect(arquivo.opts()).toEqual({ caminhos: expect.any(Array), exato: true });

    expect(output).toContain('Foram encontradas 1 ocorrências pelo termo "robert conrad karen"');
    expect(output).toContain(path.resolve(process.cwd(), './example/data/arquivo00.txt'));
  });

  it('deve retornar um arquivo encontrados: -s ./example/data/arquivo00.txt', () => {
    arquivo.parse([
      'node',
      'test',
      '-s',
      'robert conrad karen',
      '-c',
      './example/data/arquivo00.txt',
      './example/data/subfolder/arquivo05.txt',
    ]);

    expect(arquivo.args).toEqual(['robert conrad karen']);
    expect(arquivo.opts()).toEqual({ caminhos: expect.any(Array), sensivel: true });

    expect(output).toContain('Foram encontradas 1 ocorrências pelo termo "robert conrad karen"');
    expect(output).toContain(path.resolve(process.cwd(), './example/data/arquivo00.txt'));
  });

  it('deve retornar um arquivo encontrados: -des ./example/data/arquivo00.txt', () => {
    arquivo.parse([
      'node',
      'test',
      '-des',
      'robert conrad karen',
      '-c',
      './example/data/arquivo00.txt',
      './example/data/subfolder/arquivo05.txt',
    ]);

    expect(arquivo.args).toEqual(['robert conrad karen']);
    expect(arquivo.opts()).toEqual({ caminhos: expect.any(Array), detalhes: true, exato: true, sensivel: true });

    expect(output).toContain('Opções...........................: caminhos,detalhes,exato,sensivel');
    expect(output).toContain('Foram encontrados................: 1 arquivos!');
  });
});
