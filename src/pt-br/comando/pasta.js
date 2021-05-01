const fs = require('fs');
const path = require('path');
const { Command, Option } = require('commander');

let startTime = new Date().getTime(),
  scanDir = '',
  textos = [],
  files = [],
  regex = null;

/**
 * Cria o comando `pasta`, que realiza uma busca em uma pasta
 * @param {Command} programa
 * @returns Command
 */
module.exports = () => {
  return new Command('pasta')
    .arguments('<pasta> <texto>')
    .description('Busca arquivos no diretório desejado que possuem o texto informado', {
      pasta: 'Diretório em que a busca será realizada',
      texto: 'Texto de busca nos arquivos',
    })
    .addOption(new Option('-d,   --detalhes', 'Retorna detalhes dos arquivos encontrados'))
    .addOption(new Option('-e,   --exato', 'Busca pela sentença exata informada'))
    .addOption(new Option('-s,   --sensivel', 'Diferencia maiúscula de minúscula'))
    .helpOption('-a,   --ajuda', 'Exibi ajuda para usar o comando')
    .addHelpText('afterAll', '\nExemplos de chamada:')
    .addHelpText('afterAll', '   $ busca-cli pasta ./exemplo "walt disney"')
    .addHelpText('afterAll', '   $ busca-cli pasta -eds ./exemplo "walt disney"')
    .addHelpText('afterAll', '   $ busca-cli pasta -e -d -s ./exemplo "walt disney"')
    .action((pasta, texto, options) => {
      if (!pasta)
        return show('É necessário informar os parâmetros <pasta> e <texto>', '', 'Exemplo: search-cli <pasta> <texto>');

      if (!texto) return show('É necessário informar o parâmetro <texto>', '', `Exemplo: search-cli ${pasta} <texto>`);

      scanDir = path.resolve(process.cwd(), pasta);

      if (!fs.existsSync(scanDir))
        return show('Erro ao encontrar o diretório:', '', scanDir, '', 'Informe um diretório existente...');

      textos = texto.split(' ');
      files = fs.readdirSync(scanDir);

      const caseSensitive = options.caseSensitive ? 'g' : 'ig';
      const pattern = options.exact ? `(\\b${texto}\\b)` : `${textos.map((word) => `(\\b${word}\\b)`).join('|')}`;
      regex = new RegExp(pattern, caseSensitive);

      options.withDetails ? detailsSearch(pasta, texto, options) : simpleSearch(pasta, texto, options);
    });
};

function simpleSearch(pasta, texto, options) {
  const matchFiles = [];

  files.forEach((file) => {
    let content = fs.readFileSync(`${scanDir}/${file}`, {
      encoding: 'utf8',
    });

    let totalMatchs = content.match(regex);
    let uniqueMatchs = Array.from(new Set(totalMatchs));

    if (uniqueMatchs && ((options.exact && uniqueMatchs.length) || (textos && uniqueMatchs.length === textos.length))) {
      matchFiles.push(`${scanDir}/${file}`);
    }
  });

  return show(
    `Foram encontradas ${matchFiles.length} ocorrências pelo termo "${texto}"`,
    `Os arquivos que possuem "${texto}" são:`,
    '',
    ...matchFiles,
    '',
    `Total de arquivos encontrados..: ${matchFiles.length}`,
    `Tempo de processamento.........: ${new Date().getTime() - startTime}ms`
  );
}

function detailsSearch(pasta, texto, options) {
  const matchFiles = [];
  const showOptions = [`Opções..........: ${Object.getOwnPropertyNames(options)}`, ''];

  files.forEach(async (file) => {
    const fileName = `${scanDir}/${file}`;

    let content = fs.readFileSync(fileName, {
      encoding: 'utf8',
    });

    let stats = fs.statSync(fileName);

    let totalMatchs = content.match(regex);
    let uniqueMatchs = Array.from(new Set(totalMatchs));

    if (uniqueMatchs && ((options.exact && uniqueMatchs.length) || (textos && uniqueMatchs.length === textos.length))) {
      matchFiles.push({
        matchs: totalMatchs.length,
        quantidadePalavras: content.split(' ').filter((word) => !!word).length,
        quantidadeElementos: content.length,
        tamanhoArquivo: `${stats.size} bytes`,
        caminhoArquivo: fileName,
      });
    }
  });

  const findFiles = matchFiles.length
    ? ['Arquivos encontrados:', '', matchFiles, '', `Total de arquivos encontrados..: ${matchFiles.length}`]
    : ['Nenhum arquivo encontrado!', ''];

  return show(
    'Parâmetros......:',
    `     |_ pasta.: ${pasta}`,
    `     |_ texto....: "${texto}"`,
    '',
    `Diretório.......: ${scanDir}`,
    '',
    ...showOptions,
    ...findFiles,
    `Tempo de processamento.........: ${new Date().getTime() - startTime}ms`
  );
}

function show(...messages) {
  messages.forEach((message) => console.log(message));
}
