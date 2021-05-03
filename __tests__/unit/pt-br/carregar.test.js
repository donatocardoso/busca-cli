const path = require('path');
const programa = require('../../../src/pt-br/principal');
const { output } = require('../../../src/utils/message');

const carregar = programa.commands.find((programa) => programa.name() === 'carregar');

describe('busca-cli carregar [opcoes] <texto> -c [caminhos...]', () => {
  beforeEach(() => {
    output.length = 0;

    if (carregar.opts().caminhos) delete carregar.opts().caminhos;
    if (carregar.opts().detalhes) delete carregar.opts().detalhes;
    if (carregar.opts().exato) delete carregar.opts().exato;
    if (carregar.opts().recursivo) delete carregar.opts().recursivo;
    if (carregar.opts().sensivel) delete carregar.opts().sensivel;
  });

  it('deve retornar as intruções de uso do comando', () => {
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

  it('deve retornar nenhum arquivo encontrado', () => {
    carregar.parse(['node', 'test', '-c', './example/folder']);

    expect(carregar.opts()).toEqual({ caminhos: expect.any(Array) });

    expect(output).toContain('Opções...........................: caminhos');
    expect(output).toContain('Foram carregados.................: 0 arquivos!');
    expect(output).toContain('Foram encontradas 0 ocorrências pelo termo "jack bravman"');
    expect(output).toContain('Nenhum arquivo encontrado!');
  });

  it('deve retornar todos os arquivos encontrados', () => {
    carregar.parse(['node', 'test', '-c', './example/data']);

    expect(carregar.opts()).toEqual({ caminhos: expect.any(Array) });

    expect(output).toContain('Opções...........................: caminhos');
    expect(output).toContain('Foram carregados.................: 5 arquivos!');
    expect(output).toContain('Foram encontradas 2 ocorrências pelo termo "jack bravman"');
    expect(output).toContain(path.resolve(process.cwd(), './example/data/arquivo02.txt'));
    expect(output).toContain(path.resolve(process.cwd(), './example/data/arquivo03.txt'));
  });

  it('deve retornar um arquivo encontrado: -e', () => {
    carregar.parse(['node', 'test', '-e', '-c', './example/data']);

    expect(carregar.opts()).toEqual({ caminhos: expect.any(Array), exato: true });

    expect(output).toContain('Opções...........................: caminhos,exato');
    expect(output).toContain('Foram carregados.................: 5 arquivos!');
    expect(output).toContain('Foram encontradas 1 ocorrências pelo termo "jack bravman"');
    expect(output).toContain(path.resolve(process.cwd(), './example/data/arquivo03.txt'));
  });

  it('deve retornar um arquivo encontrado: -er', () => {
    carregar.parse(['node', 'test', '-er', '-c', './example/data']);

    expect(carregar.opts()).toEqual({ caminhos: expect.any(Array), exato: true, recursivo: true });

    expect(output).toContain('Opções...........................: caminhos,exato,recursivo');
    expect(output).toContain('Foram carregados.................: 10 arquivos!');
    expect(output).toContain('Foram encontradas 2 ocorrências pelo termo "jack bravman"');
    expect(output).toContain(path.resolve(process.cwd(), './example/data/arquivo03.txt'));
    expect(output).toContain(path.resolve(process.cwd(), './example/data/subfolder/arquivo08.txt'));
  });

  it('deve retornar um arquivo encontrado: -ers', () => {
    carregar.parse(['node', 'test', '-ers', '-c', './example/data']);

    expect(carregar.opts()).toEqual({ caminhos: expect.any(Array), exato: true, recursivo: true, sensivel: true });

    expect(output).toContain('Opções...........................: caminhos,exato,recursivo,sensivel');
    expect(output).toContain('Foram carregados.................: 10 arquivos!');
    expect(output).toContain('Foram encontradas 1 ocorrências pelo termo "jack bravman"');
    expect(output).toContain(path.resolve(process.cwd(), './example/data/subfolder/arquivo08.txt'));
  });

  it('deve retornar todos os arquivos encontrados: -d', () => {
    carregar.parse([
      'node',
      'test',
      '-d',
      'jack bravman',
      '-c',
      './example/data',
      './example/data/subfolder/arquivo08.txt',
    ]);

    expect(carregar.args).toEqual(['jack bravman']);
    expect(carregar.opts()).toEqual({ caminhos: expect.any(Array), detalhes: true });

    expect(output).toContain('Opções...........................: caminhos,detalhes');
    expect(output).toContain('Foram carregados.................: 6 arquivos!');
    expect(output).toContain('Foram encontradas 3 ocorrências pelo termo "jack bravman"');
    expect(output).toContain('Foram encontrados................: 3 arquivos!');
  });
});
