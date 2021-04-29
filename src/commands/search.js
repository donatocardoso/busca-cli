const fs = require('fs');
const path = require('path');

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
    const startTime = new Date().getTime();

    if (!workdir)
      return show('É necessário informar os parâmetros <workdir> e <text>', '', 'Exemplo: search-cli <workdir> <text>');

    if (!text) return show('É necessário informar o parâmetro <text>', '', `Exemplo: search-cli ${workdir} <text>`);

    const scanDir = path.resolve(process.cwd(), workdir);

    if (!fs.existsSync(scanDir))
      return show('Erro ao encontrar o diretório:', '', scanDir, '', 'Informe um diretório existente...');

    const matchFiles = [];
    const texts = text.split(' ');
    const files = fs.readdirSync(scanDir);

    const regex = options.exact ? `(\\b${text}\\b)` : `${texts.map((word) => `(\\b${word}\\b)`).join('|')}`;

    files.forEach(async (file) => {
      var fileContent = fs.readFileSync(`${scanDir}/${file}`, {
        encoding: 'utf8',
      });

      var totalMatchs = fileContent.match(new RegExp(regex, options.caseSensitive ? 'g' : 'ig'));
      var uniqueMatchs = Array.from(new Set(totalMatchs));

      if (uniqueMatchs && ((options.exact && uniqueMatchs.length) || (texts && uniqueMatchs.length === texts.length))) {
        matchFiles.push({
          matchs: totalMatchs.length,
          file: `${scanDir}/${file}`,
        });
      }
    });

    return show(
      `Parametros...: ${workdir} "${text}"`,
      `Diretório....: ${scanDir}`,
      '',
      'Arquivos encontrados:',
      '',
      //matchFiles,
      '',
      `Total de arquivos encontrados..: ${matchFiles.length}`,
      `Tempo de processamento.........: ${new Date().getTime() - startTime}ms`
    );
  },
};

function show(...messages) {
  messages.forEach((message) => console.log(message));
}
