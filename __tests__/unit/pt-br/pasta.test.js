const programa = require('../../src/pt-br/principal');
const { output } = require('../../src/utils/message');

const pasta = programa.commands.find((programa) => programa.name() === 'pasta');

describe('busca-cli pasta [opcoes] <caminho> <texto>', () => {
  beforeEach(() => {
    output.length = 0;
  });

  // Teste opção pasta --ajuda
  it('busca-cli pasta --ajuda', () => {
    expect(pasta.helpInformation().split('\n')).toEqual([
      'Usage: busca-cli pasta [opcoes] <caminho> <texto>',
      '',
      'Busca arquivos no diretório desejado que possuem o texto informado',
      '',
      'Arguments:',
      '  caminho            Diretório em que a busca será realizada',
      '  texto              Texto de busca nos arquivos',
      '',
      'Options:',
      '  -d,   --detalhes   Retorna detalhes dos arquivos encontrados',
      '  -e,   --exato      Busca pela sentença exata informada',
      '  -r,   --recursivo  Busca na pasta e sub-pastas do caminho informado',
      '  -s,   --sensivel   Diferencia maiúscula de minúscula',
      '  -a,   --ajuda      Exibi ajuda para usar o comando',
      '',
    ]);
  });

  // Teste pasta ./example/data "washington wendell"
  it('busca-cli pasta ./example/data "washington wendell"', () => {
    pasta.parse(['node', 'test', './example/data', 'washington wendell']);

    expect(pasta.args).toEqual(['./example/data', 'washington wendell']);

    expect(output).toContain('Foram encontradas 1 ocorrências pelo termo "washington wendell"');
    expect(output).toContain('./example/data/arquivo01.txt');
  });

  // Teste pasta --exato --recursivo ./example/data "washington wendell"
  it('busca-cli pasta -er ./example/data "washington wendell"', () => {
    pasta.parse(['node', 'test', '-er', './example/data', 'washington wendell']);

    expect(pasta.args).toEqual(['./example/data', 'washington wendell']);
    expect(pasta.opts()).toEqual({ exato: true, recursivo: true });

    expect(output).toContain('Foram encontradas 1 ocorrências pelo termo "washington wendell"');
    expect(output).toContain('./example/data/arquivo01.txt');
  });

  // Teste pasta --exato --recursivo --sensivel ./example/data "WASHINGTON WENDELL"
  it('busca-cli pasta -ers ./example/data "WASHINGTON WENDELL"', () => {
    pasta.parse(['node', 'test', '-ers', './example/data', 'WASHINGTON WENDELL']);

    expect(pasta.args).toEqual(['./example/data', 'WASHINGTON WENDELL']);
    expect(pasta.opts()).toEqual({ exato: true, recursivo: true, sensivel: true });

    expect(output).toContain('Foram encontradas 0 ocorrências pelo termo "WASHINGTON WENDELL"');
    expect(output).toContain('Nenhum arquivo encontrado!');
  });

  // Teste pasta --detalhes --exato --recursivo --sensivel ./example/data "washington wendell"
  it('busca-cli pasta -ders ./example/data "washington wendell"', () => {
    pasta.parse(['node', 'test', '-ders', './example/data', 'washington wendell']);

    expect(pasta.args).toEqual(['./example/data', 'washington wendell']);
    expect(pasta.opts()).toEqual({ detalhes: true, exato: true, recursivo: true, sensivel: true });

    expect(output).toContain('Opções..........: exato,recursivo,sensivel,detalhes');
    expect(output).toContain('Total de arquivos encontrados..: 1');
  });
});
