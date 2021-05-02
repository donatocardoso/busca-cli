const programa = require('../../../src/pt-br/principal');
const { output } = require('../../../src/utils/message');

const arquivo = programa.commands.find((programa) => programa.name() === 'arquivo');

describe('busca-cli arquivo [opcoes] <texto> -c [caminhos...]', () => {
  beforeEach(() => {
    output.length = 0;

    if (arquivo.opts().caminhos) arquivo.opts().caminhos.length = 0;
  });

  // Teste opção arquivo --ajuda
  it('busca-cli arquivo --ajuda', () => {
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

  // Teste arquivo "jack bravman" -c ./example/data/arquivo02.txt ./example/data/arquivo03.txt
  it('busca-cli arquivo "jack bravman" -c ./example/data/arquivo02.txt ./example/data/arquivo03.txt', () => {
    arquivo.parse([
      'node',
      'test',
      'jack bravman',
      '-c',
      './example/data/arquivo02.txt',
      './example/data/arquivo03.txt',
    ]);

    expect(arquivo.args).toEqual(['jack bravman']);

    expect(output).toContain('Foram encontradas 2 ocorrências pelo termo "jack bravman"');
    expect(output).toContain('./example/data/arquivo02.txt');
    expect(output).toContain('./example/data/arquivo03.txt');
  });

  // Teste arquivo --exato "jack bravman" -c ./example/data/arquivo02.txt ./example/data/arquivo03.txt
  it('busca-cli arquivo -e "jack bravman" -c ./example/data/arquivo02.txt ./example/data/arquivo03.txt', () => {
    arquivo.parse([
      'node',
      'test',
      '-e',
      'jack bravman',
      '-c',
      './example/data/arquivo02.txt',
      './example/data/arquivo03.txt',
    ]);

    expect(arquivo.args).toEqual(['jack bravman']);
    expect(arquivo.opts()).toEqual({ caminhos: expect.any(Array), exato: true });

    expect(output).toContain('Foram encontradas 1 ocorrências pelo termo "jack bravman"');
    expect(output).toContain('./example/data/arquivo03.txt');
  });

  // Teste arquivo --exato --sensivel "jack bravman" -c ./example/data/arquivo02.txt ./example/data/arquivo03.txt
  it('busca-cli arquivo -es "jack bravman" -c ./example/data/arquivo02.txt ./example/data/arquivo03.txt', () => {
    arquivo.parse([
      'node',
      'test',
      '-es',
      'jack bravman',
      '-c',
      './example/data/arquivo02.txt',
      './example/data/arquivo03.txt',
    ]);

    expect(arquivo.args).toEqual(['jack bravman']);
    expect(arquivo.opts()).toEqual({ caminhos: expect.any(Array), exato: true, sensivel: true });

    expect(output).toContain('Foram encontradas 1 ocorrências pelo termo "jack bravman"');
    expect(output).toContain('./example/data/arquivo03.txt');
  });

  // Teste arquivo --detalhes --exato --sensivel "jack bravman" -c ./example/data/arquivo02.txt ./example/data/arquivo03.txt
  it('busca-cli arquivo -des "jack bravman" -c ./example/data/arquivo02.txt ./example/data/arquivo03.txt', () => {
    arquivo.parse([
      'node',
      'test',
      '-des',
      'jack bravman',
      '-c',
      './example/data/arquivo02.txt',
      './example/data/arquivo03.txt',
    ]);

    expect(arquivo.args).toEqual(['jack bravman']);
    expect(arquivo.opts()).toEqual({ caminhos: expect.any(Array), detalhes: true, exato: true, sensivel: true });

    expect(output).toContain('Opções..........: caminhos,exato,sensivel,detalhes');
    expect(output).toContain('Total de arquivos encontrados..: 1');
  });
});
