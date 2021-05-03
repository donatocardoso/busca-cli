const path = require('path');
const programa = require('../../../src/pt-br/principal');
const { output } = require('../../../src/utils/message');

const pasta = programa.commands.find((programa) => programa.name() === 'pasta');

describe('busca-cli pasta [opcoes] <texto> -c [caminhos...]', () => {
  beforeEach(() => {
    output.length = 0;

    if (pasta.opts().caminhos) delete pasta.opts().caminhos;
    if (pasta.opts().detalhes) delete pasta.opts().detalhes;
    if (pasta.opts().exato) delete pasta.opts().exato;
    if (pasta.opts().recursivo) delete pasta.opts().recursivo;
    if (pasta.opts().sensivel) delete pasta.opts().sensivel;
  });

  it('deve retornar as intruções de uso do comando', () => {
    expect(pasta.helpInformation().split('\n')).toEqual([
      'Usage: busca-cli pasta [opcoes] <texto> -c [caminhos...]',
      '',
      'Busca arquivos no diretório desejado que possuem o texto informado',
      '',
      'Arguments:',
      '  texto                            Texto de busca nos arquivos',
      '',
      'Options:',
      '  -c,   --caminhos  [caminhos...]  Diretório(s) em que a verificação será realizada',
      '  -d,   --detalhes                 Retorna detalhes dos arquivos encontrados',
      '  -e,   --exato                    Busca pela sentença exata informada',
      '  -r,   --recursivo                Busca na pasta e sub-pastas do caminho informado',
      '  -s,   --sensivel                 Diferencia maiúscula de minúscula',
      '  -a,   --ajuda                    Exibi ajuda para usar o comando',
      '',
    ]);
  });

  it('deve retornar nenhum arquivo encontrado', () => {
    pasta.parse([
      'node',
      'test',
      'robert conrad karen',
      '-c',
      './example/data/arquivo00.txt',
      './example/data/nao-existe',
    ]);

    expect(pasta.args).toEqual(['robert conrad karen']);

    expect(output).toContain('Foram encontradas 0 ocorrências pelo termo "robert conrad karen"');
    expect(output).toContain('Nenhum arquivo encontrado!');
  });

  it('deve retornar um arquivo encontrado: ./example/data/arquivo01.txt', () => {
    pasta.parse(['node', 'test', 'anthony mackie kerry', '-c', './example/data']);

    expect(pasta.args).toEqual(['anthony mackie kerry']);

    expect(output).toContain('Foram encontradas 1 ocorrências pelo termo "anthony mackie kerry"');
    expect(output).toContain(path.resolve(process.cwd(), './example/data/arquivo01.txt'));
  });

  it('deve retornar um arquivo encontrado: -e ./example/data/arquivo01.txt', () => {
    pasta.parse(['node', 'test', '-e', 'anthony mackie kerry', '-c', './example/data']);

    expect(pasta.args).toEqual(['anthony mackie kerry']);
    expect(pasta.opts()).toEqual({ caminhos: expect.any(Array), exato: true });

    expect(output).toContain('Foram encontradas 1 ocorrências pelo termo "anthony mackie kerry"');
    expect(output).toContain(path.resolve(process.cwd(), './example/data/arquivo01.txt'));
  });

  it('deve retornar um arquivo encontrado: -er ./example/data/arquivo01.txt', () => {
    pasta.parse(['node', 'test', '-er', 'anthony mackie kerry', '-c', './example/data']);

    expect(pasta.args).toEqual(['anthony mackie kerry']);
    expect(pasta.opts()).toEqual({ caminhos: expect.any(Array), exato: true, recursivo: true });

    expect(output).toContain('Foram encontradas 1 ocorrências pelo termo "anthony mackie kerry"');
    expect(output).toContain(path.resolve(process.cwd(), './example/data/arquivo01.txt'));
  });

  it('deve retornar um arquivo encontrado: -rs ./example/data/arquivo01.txt', () => {
    pasta.parse(['node', 'test', '-rs', 'anthony mackie kerry', '-c', './example/data']);

    expect(pasta.args).toEqual(['anthony mackie kerry']);
    expect(pasta.opts()).toEqual({ caminhos: expect.any(Array), recursivo: true, sensivel: true });

    expect(output).toContain('Foram encontradas 1 ocorrências pelo termo "anthony mackie kerry"');
    expect(output).toContain(path.resolve(process.cwd(), './example/data/arquivo01.txt'));
  });

  it('deve retornar dois arquivos encontrados: -dr ./example/data/arquivo01.txt e ./example/data/arquivo06.txt', () => {
    pasta.parse(['node', 'test', '-dr', 'anthony mackie kerry', '-c', './example/data']);

    expect(pasta.args).toEqual(['anthony mackie kerry']);
    expect(pasta.opts()).toEqual({ caminhos: expect.any(Array), detalhes: true, recursivo: true });

    expect(output).toContain('Opções...........................: caminhos,detalhes,recursivo');
    expect(output).toContain('Foram encontrados................: 2 arquivos!');
  });
});
