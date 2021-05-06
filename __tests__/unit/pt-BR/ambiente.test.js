require('./_mock');

const program = require('#src/main');
const { output } = require('#src/utils/message');

const ambiente = program.commands.find((command) => command.name() === 'ambiente');

describe('busca-cli ambiente [opcoes] [comando]', () => {
  beforeEach(() => {
    output.length = 0;

    if (ambiente.opts().nome) delete ambiente.opts().nome;
    if (ambiente.opts().valor) delete ambiente.opts().valor;
  });

  it('deve retornar todas as variáveis de ambiente', () => {
    ambiente.parse(['node', 'test']);

    expect(output).toContain('Variáveis de ambiente:');
    expect(output[2]).toMatch(/^LANGUAGE=/);
    expect(output[3]).toMatch(/^REPORT_ERROR=/);
  });

  it('deve retornar todas as variáveis de ambiente', () => {
    ambiente.parse(['node', 'test', 'lista']);

    expect(output).toContain('Variáveis de ambiente:');
    expect(output[2]).toMatch(/^LANGUAGE=/);
    expect(output[3]).toMatch(/^REPORT_ERROR=/);
  });

  it('deve retornar erro de variável de ambiente não encontrada', () => {
    ambiente.parse(['node', 'test', 'exibir', 'LANGUAGES']);

    expect(ambiente.args).toEqual(['exibir', 'LANGUAGES']);

    expect(output[0]).toMatch('Variável de ambiente LANGUAGES não encontrada...');
  });

  it('deve retornar a variável de ambiente LANGUAGE', () => {
    ambiente.parse(['node', 'test', 'exibir', 'LANGUAGE']);

    expect(ambiente.args).toEqual(['exibir', 'LANGUAGE']);

    expect(output[0]).toMatch('Variável de ambiente LANGUAGE: pt-BR');
  });

  it('deve retornar erro de variável de ambiente não encontrada', () => {
    ambiente.parse(['node', 'test', 'alterar', 'LANGUAGES', 'pt-BR']);

    expect(ambiente.args).toEqual(['alterar', 'LANGUAGES', 'pt-BR']);

    expect(output[0]).toMatch('Variável de ambiente LANGUAGES não encontrada...');
  });

  it('deve retornar erro de idioma indisponivel', () => {
    ambiente.parse(['node', 'test', 'alterar', 'LANGUAGE', 'pt-PT']);

    expect(ambiente.args).toEqual(['alterar', 'LANGUAGE', 'pt-PT']);

    expect(output[0]).toMatch('O idioma pt-PT não está disponével.');
  });

  it('deve retornar sucesso na alteração de idioma', () => {
    ambiente.parse(['node', 'test', 'alterar', 'LANGUAGE', 'pt-BR']);

    expect(ambiente.args).toEqual(['alterar', 'LANGUAGE', 'pt-BR']);

    expect(output[0]).toMatch('Sucesso ao alterar a variável de ambiente LANGUAGE');
  });
});
