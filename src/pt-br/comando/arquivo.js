const { Command, Option } = require('commander');
const fs = require('fs');
const path = require('path');
const { message } = require('../../utils/message');

let startTime = new Date().getTime(),
  textos = [],
  regex = null;

/**
 * Cria o comando `arquivo`, que realiza uma busca em um ou mais arquivos
 * @param {Command} programa
 * @returns Command
 */
module.exports = () => {
  return new Command('arquivo')
    .usage('[opcoes] -c [caminhos...]')
    .arguments('   <texto>')
    .description('Verifica se o(s) arquivo(s) possue(em) o texto informado', {
      texto: 'Texto de busca no arquivo',
    })
    .requiredOption('-c,   --caminhos  [caminhos...]', 'Arquivo(s) em que a verificação será realizada')
    .addOption(new Option('-d,   --detalhes', 'Retorna detalhes do(s) arquivo(s)'))
    .addOption(new Option('-e,   --exato', 'Busca pela sentença exata informada'))
    .addOption(new Option('-s,   --sensivel', 'Diferencia maiúscula de minúscula'))
    .helpOption('-a,   --ajuda', 'Exibi ajuda para usar o comando')
    .addHelpText('afterAll', '\nExemplos de chamada:\n')
    .addHelpText('afterAll', '')
    .addHelpText('afterAll', '$ busca-cli arquivo "walt disney" -c ./arquivo01.txt ./arquivo02.txt')
    .addHelpText('afterAll', '$ busca-cli arquivo -des "walt disney" -c ./arquivo01.txt ./arquivo02.txt')
    .addHelpText('afterAll', '$ busca-cli arquivo -d -e -s "walt disney" -c ./arquivo01.txt ./arquivo02.txt')
    .action((texto, options) => {
      if (!texto) {
        return message(
          'É necessário informar o parâmetro <texto>',
          '',
          `Exemplo: busca-cli arquivo <texto> --caminhos [...]`
        );
      }

      if (!options.caminhos.length) {
        return message(
          'É necessário informar a opção --caminhos',
          '',
          `Exemplo: busca-cli arquivo "${texto}" --caminhos [...]`
        );
      }

      textos = texto.split(' ');

      const sensivel = options.sensivel ? 'g' : 'ig';
      const pattern = options.exato ? `(\\b${texto}\\b)` : `${textos.map((word) => `(\\b${word}\\b)`).join('|')}`;

      regex = new RegExp(pattern, sensivel);

      options.detalhes ? buscaDetalhada(texto, options) : buscaSimples(texto, options);
    });
};

function buscaSimples(texto, opcoes) {
  const arquivos = busca(opcoes);

  const encontrados = arquivos.encontrados.length
    ? [
        `Os arquivos que possuem "${texto}" são:`,
        '',
        ...arquivos.encontrados.map((arquivo) => arquivo.caminhoArquivo),
        '',
      ]
    : ['', 'Nenhum arquivo com o texto informado foi encontrado!', ''];

  const naoEncontrados = arquivos.naoEncontrados.length
    ? ['', `Os arquivos a seguir não foram encontrados: `, '', ...arquivos.naoEncontrados, '']
    : [];

  return message(
    `Foram encontradas ${arquivos.encontrados.length} ocorrências pelo termo "${texto}"`,
    ...naoEncontrados,
    ...encontrados,
    `Tempo de processamento.........: ${new Date().getTime() - startTime}ms`
  );
}

function buscaDetalhada(texto, opcoes) {
  const arquivos = busca(opcoes);

  const opcoesProps = Object.getOwnPropertyNames(opcoes);
  const mostraOpcoes = opcoesProps.length ? [`Opções..........: ${opcoesProps}`, ''] : [];

  const encontrados = arquivos.encontrados.length
    ? [
        'Arquivos encontrados:',
        '',
        arquivos.encontrados,
        '',
        `Total de arquivos encontrados..: ${arquivos.encontrados.length}`,
      ]
    : ['Nenhum arquivo encontrado!', ''];

  const naoEncontrados = arquivos.naoEncontrados.length
    ? [`Os arquivos a seguir não foram encontrados: `, '', ...arquivos.naoEncontrados, '']
    : [];

  return message(
    'Parâmetro.......:',
    `     |_ texto....: "${texto}"`,
    '',
    ...mostraOpcoes,
    ...naoEncontrados,
    ...encontrados,
    `Tempo de processamento.........: ${new Date().getTime() - startTime}ms`
  );
}

function busca(opcoes) {
  const encontrados = [];
  const naoEncontrados = [];

  opcoes.caminhos.forEach((caminho) => {
    const caminhoCompleto = path.resolve(process.cwd(), caminho);

    if (!fs.existsSync(caminhoCompleto)) {
      naoEncontrados.push(caminhoCompleto);
      return;
    }

    const conteudo = fs.readFileSync(caminhoCompleto, {
      encoding: 'utf8',
    });

    const propriedades = fs.statSync(caminhoCompleto);

    const encontros = conteudo.match(regex);
    const encontrosUnicos = Array.from(new Set(encontros));

    if (
      encontrosUnicos &&
      ((opcoes.exato && encontrosUnicos.length) || (textos && encontrosUnicos.length === textos.length))
    ) {
      encontrados.push({
        encontros: encontros.length,
        quantidadePalavras: conteudo.split(' ').filter((word) => !!word).length,
        quantidadeElementos: conteudo.length,
        tamanhoArquivo: `${propriedades.size} bytes`,
        caminhoArquivo: caminhoCompleto,
      });
    }
  });

  return { encontrados, naoEncontrados };
}
