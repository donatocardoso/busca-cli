const fs = require('fs');
const path = require('path');
const { Command, Option } = require('commander');
const { message } = require('../../utils/message');

let startTime = new Date().getTime(),
  diretorio = '',
  textos = [],
  regex = null;

/**
 * Cria o comando `pasta`, que realiza uma busca em uma pasta
 * @param {Command} programa
 * @returns Command
 */
module.exports = () => {
  return new Command('pasta')
    .arguments('<caminho> <texto>')
    .description('Busca arquivos no diretório desejado que possuem o texto informado', {
      caminho: 'Diretório em que a busca será realizada',
      texto: 'Texto de busca nos arquivos',
    })
    .addOption(new Option('-d,   --detalhes', 'Retorna detalhes dos arquivos encontrados'))
    .addOption(new Option('-e,   --exato', 'Busca pela sentença exata informada'))
    .addOption(new Option('-r,   --recursivo', 'Busca na pasta e sub-pastas do caminho informado'))
    .addOption(new Option('-s,   --sensivel', 'Diferencia maiúscula de minúscula'))
    .helpOption('-a,   --ajuda', 'Exibi ajuda para usar o comando')
    .addHelpText('afterAll', '\nExemplos de chamada:')
    .addHelpText('afterAll', '   $ busca-cli pasta ./exemplo "walt disney"')
    .addHelpText('afterAll', '   $ busca-cli pasta -eds ./exemplo "walt disney"')
    .addHelpText('afterAll', '   $ busca-cli pasta -e -d -s ./exemplo "walt disney"')
    .action((caminho, texto, options) => {
      if (!caminho) {
        return message(
          'É necessário informar os parâmetros <caminho> e <texto>',
          '',
          'Exemplo: busca-cli pasta <caminho> <texto>'
        );
      }

      if (!texto) {
        return message('É necessário informar o parâmetro <texto>', '', `Exemplo: busca-cli pasta ${caminho} <texto>`);
      }

      diretorio = path.resolve(process.cwd(), caminho);

      if (!fs.existsSync(diretorio)) {
        return message(
          'Erro ao encontrar o diretório:',
          '',
          diretorio,
          '',
          'Por favor informe um diretório existente...'
        );
      }

      textos = texto.split(' ');

      const sensivel = options.sensivel ? 'g' : 'ig';
      const pattern = options.exato ? `(\\b${texto}\\b)` : `${textos.map((word) => `(\\b${word}\\b)`).join('|')}`;

      regex = new RegExp(pattern, sensivel);

      options.detalhes ? buscaDetalhada(caminho, texto, options) : buscaSimples(caminho, texto, options);
    });
};

function buscaSimples(caminho, texto, opcoes) {
  const arquivosEncontrados = busca(caminho, texto, opcoes).map((arquivo) => arquivo.caminhoArquivo);

  const mostraArquivos = arquivosEncontrados.length ? arquivosEncontrados : ['Nenhum arquivo encontrado!', ''];

  return message(
    `Foram encontradas ${arquivosEncontrados.length} ocorrências pelo termo "${texto}"`,
    `Os arquivos que possuem "${texto}" são:`,
    '',
    ...mostraArquivos,
    '',
    `Tempo de processamento.........: ${new Date().getTime() - startTime}ms`
  );
}

function buscaDetalhada(caminho, texto, opcoes) {
  const arquivosEncontrados = busca(caminho, texto, opcoes);

  const opcoesProps = Object.getOwnPropertyNames(opcoes);
  const mostraOpcoes = opcoesProps.length ? [`Opções..........: ${opcoesProps}`, ''] : [];

  const mostraArquivos = arquivosEncontrados.length
    ? [
        'Arquivos encontrados:',
        '',
        arquivosEncontrados,
        '',
        `Total de arquivos encontrados..: ${arquivosEncontrados.length}`,
      ]
    : ['Nenhum arquivo encontrado!', ''];

  return message(
    'Parâmetros.......:',
    `     |_ caminho..: ${caminho}`,
    `     |_ texto....: "${texto}"`,
    '',
    `Diretório........: ${diretorio}`,
    '',
    ...mostraOpcoes,
    ...mostraArquivos,
    `Tempo de processamento.........: ${new Date().getTime() - startTime}ms`
  );
}

function busca(caminho, texto, opcoes) {
  const arquivosEncontrados = [];

  if (!fs.existsSync(caminho)) {
    return message('Erro ao encontrar o diretório:', '', caminho, '', 'Por favor informe um diretório existente...');
  }

  fs.readdirSync(caminho).forEach((arquivo) => {
    const caminhoArquivo = `${caminho}/${arquivo}`;

    if (fs.statSync(caminhoArquivo).isDirectory()) {
      if (opcoes.recursivo) {
        arquivosEncontrados.push(...busca(caminhoArquivo, texto, opcoes));
        return;
      }

      return;
    }

    // if (!fs.statSync(caminhoArquivo).isFile())

    let conteudo = fs.readFileSync(caminhoArquivo, {
      encoding: 'utf8',
    });

    let propriedades = fs.statSync(caminhoArquivo);

    let encontros = conteudo.match(regex);
    let encontrosUnicos = Array.from(new Set(encontros));

    if (
      encontrosUnicos &&
      ((opcoes.exato && encontrosUnicos.length) || (textos && encontrosUnicos.length === textos.length))
    ) {
      arquivosEncontrados.push({
        encontros: encontros.length,
        quantidadePalavras: conteudo.split(' ').filter((word) => !!word).length,
        quantidadeElementos: conteudo.length,
        tamanhoArquivo: `${propriedades.size} bytes`,
        caminhoArquivo: caminhoArquivo,
      });
    }
  });

  return arquivosEncontrados;
}
