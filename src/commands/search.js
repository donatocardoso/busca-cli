const fs = require('fs');
const path = require('path');

let startTime = new Date().getTime(),
  scanDir = '',
  texts = [],
  files = [],
  regex = null;

module.exports = {
  arguments: '[workdir] [text]',
  description: [
    'Busca arquivos no diretorio desejado que possuem o texto informado',
    {
      workdir: 'diretório em que a busca será realizada',
      text: 'texto de busca nos arquivos',
    },
  ],
  action: (workdir, text, options) => {
    if (!workdir)
      return show('É necessário informar os parâmetros <workdir> e <text>', '', 'Exemplo: search-cli <workdir> <text>');

    if (!text) return show('É necessário informar o parâmetro <text>', '', `Exemplo: search-cli ${workdir} <text>`);

    scanDir = path.resolve(process.cwd(), workdir);

    if (!fs.existsSync(scanDir))
      return show('Erro ao encontrar o diretório:', '', scanDir, '', 'Informe um diretório existente...');

    texts = text.split(' ');
    files = fs.readdirSync(scanDir);

    const caseSensitive = options.caseSensitive ? 'g' : 'ig';
    const pattern = options.exact ? `(\\b${text}\\b)` : `${texts.map((word) => `(\\b${word}\\b)`).join('|')}`;
    regex = new RegExp(pattern, caseSensitive);

    options.withDetails ? detailsSearch(workdir, text, options) : simpleSearch(workdir, text, options);
  },
};

function simpleSearch(workdir, text, options) {
  const matchFiles = [];

  files.forEach((file) => {
    let content = fs.readFileSync(`${scanDir}/${file}`, {
      encoding: 'utf8',
    });

    let totalMatchs = content.match(regex);
    let uniqueMatchs = Array.from(new Set(totalMatchs));

    if (uniqueMatchs && ((options.exact && uniqueMatchs.length) || (texts && uniqueMatchs.length === texts.length))) {
      matchFiles.push(`${scanDir}/${file}`);
    }
  });

  return show(
    `Foram encontradas ${matchFiles.length} ocorrências pelo termo "${text}"`,
    `Os arquivos que possuem "${text}" são:`,
    '',
    ...matchFiles,
    '',
    `Total de arquivos encontrados..: ${matchFiles.length}`,
    `Tempo de processamento.........: ${new Date().getTime() - startTime}ms`
  );
}

function detailsSearch(workdir, text, options) {
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

    if (uniqueMatchs && ((options.exact && uniqueMatchs.length) || (texts && uniqueMatchs.length === texts.length))) {
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
    `     |_ workdir.: ${workdir}`,
    `     |_ text....: "${text}"`,
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
