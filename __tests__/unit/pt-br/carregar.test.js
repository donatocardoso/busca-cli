const path = require('path');
const programa = require('../../src/pt-br/principal');
const { output } = require('../../src/utils/message');

const carregar = programa.commands.find((programa) => programa.name() === 'carregar');

describe('busca-cli carregar [opcoes] <texto> -c [caminhos...]', () => {
  beforeEach(() => {
    output.length = 0;

    if (carregar.opts().caminhos) carregar.opts().caminhos.length = 0;
  });

  // Teste opção carregar --ajuda
  it('busca-cli carregar --ajuda', () => {
    expect(carregar.helpInformation().split('\n')).toEqual([
      'Usage: busca-cli carregar [opcoes] -c [caminhos...]',
      '',
      'Carrega em memória os arquivos do diretório informado',
      '',
      'Options:',
      '  -c,   --caminhos  [caminhos...]  Arquivo(s) em que a verificação será realizada',
      '  -d,   --detalhes                 Retorna detalhes dos arquivos encontrados',
      '  -e,   --exato                    Busca pela sentença exata informada',
      '  -r,   --recursivo                Busca na pasta e sub-pastas do caminho informado',
      '  -s,   --sensivel                 Diferencia maiúscula de minúscula',
      '  -a,   --ajuda                    Exibi ajuda para usar o comando',
      '',
    ]);
  });

  // Teste carregar -c ./example/data
  it('busca-cli carregar -c ./example/data', () => {
    carregar.parse(['node', 'test', '-c', './example/data']);

    expect(output).toContain('Foram encontradas 3 ocorrências pelo termo "deborah austin"');
    expect(output).toContain(path.resolve(process.cwd(), './example/data/arquivo05.txt'));
    expect(output).toContain(path.resolve(process.cwd(), './example/data/arquivo08.txt'));
    expect(output).toContain(path.resolve(process.cwd(), './example/data/arquivo09.txt'));
  });

  // Teste carregar --exato --recursivo -c ./example/data
  it('busca-cli carregar -er -c ./example/data', () => {
    carregar.parse(['node', 'test', '-er', 'jack bravman', '-c', './example/data']);

    expect(carregar.opts()).toEqual({ caminhos: expect.any(Array), exato: true, recursivo: true });

    expect(output).toContain('Foram encontradas 2 ocorrências pelo termo "deborah austin"');
    expect(output).toContain(path.resolve(process.cwd(), './example/data/arquivo08.txt'));
    expect(output).toContain(path.resolve(process.cwd(), './example/data/arquivo09.txt'));
  });

  // Teste carregar --exato --recursivo --sensivel -c ./example/data
  it('busca-cli carregar -ers -c ./example/data', () => {
    carregar.parse(['node', 'test', '-ers', 'jack bravman', '-c', './example/data']);

    expect(carregar.args).toEqual(['jack bravman']);
    expect(carregar.opts()).toEqual({ caminhos: expect.any(Array), exato: true, recursivo: true, sensivel: true });

    expect(output).toContain('Foram encontradas 1 ocorrências pelo termo "deborah austin"');
    expect(output).toContain(path.resolve(process.cwd(), './example/data/arquivo09.txt'));
  });

  // Teste carregar --detalhes --exato --recursivo --sensivel -c ./example/data
  it('busca-cli carregar -ders -c ./example/data', () => {
    carregar.parse(['node', 'test', '-ders', 'jack bravman', '-c', './example/data']);

    expect(carregar.args).toEqual(['jack bravman']);
    expect(carregar.opts()).toEqual({
      caminhos: expect.any(Array),
      detalhes: true,
      exato: true,
      recursivo: true,
      sensivel: true,
    });

    expect(output).toContain('Opções...........................: caminhos,exato,recursivo,sensivel,detalhes');
    expect(output).toContain('Foram encontrados................: 1 arquivos!');
  });
});
