const { showMessage } = require('#src/utils/message');
const { Command, Option } = require('commander');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const languages = require('./languages');
const parseOptions = require('./parseOptions');

const input = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

const lang = languages();

/**
 * Cria o comando `carregar`, que realiza uma busca em um ou mais caminhos
 * @param {Command} programa
 * @returns Command
 */
module.exports = () => {
  return new Command(lang.name)
    .usage(lang.usage)
    .description(lang.description)
    .requiredOption(lang.pathsOption.flags, lang.pathsOption.description)
    .addOption(new Option(lang.detailsOption.flags, lang.detailsOption.description))
    .addOption(new Option(lang.exactOption.flags, lang.exactOption.description))
    .addOption(new Option(lang.recursiveOption.flags, lang.recursiveOption.description))
    .addOption(new Option(lang.caseSensitiveOption.flags, lang.caseSensitiveOption.description))
    .helpOption(lang.helpOption.flags, lang.helpOption.description)
    .addHelpText('afterAll', ' ')
    .addHelpText('afterAll', lang.addHelpText.title)
    .addHelpText('afterAll', ' ')
    .addHelpText('afterAll', lang.addHelpText.example01)
    .addHelpText('afterAll', lang.addHelpText.example02)
    .addHelpText('afterAll', lang.addHelpText.example03)
    .action(load);
};

/**
 * Carregar arquivos em memoria e realiza um filtro comforme text informado
 * @param {object} options Opções para carregar os arquivos
 * @param {string[]} options.paths Caminhos em que a busca será realizada
 * @param {boolean} options.detalhes Deseja uma busca detalhada
 * @param {boolean} options.exact Deseja uma busca pela sentença exata
 * @param {boolean} options.recursivo Deseja uma busca na pasta e sub-pastas
 * @param {boolean} options.caseSensitive Deseja uma busca que diferencie maiúscula de minúscula
 */
function load(options) {
  const timeLoad = new Date().getTime();

  const loads = [];
  const notFound = [];
  const optionsProps = Object.getOwnPropertyNames(options).sort();

  options = parseOptions(options);

  options.paths.forEach(function _search(caminho) {
    const fullPath = path.resolve(process.cwd(), caminho);

    if (!fs.existsSync(fullPath)) return notFound.push(fullPath);

    if (fs.statSync(fullPath).isDirectory()) {
      // Pasta informada via paramentro, ou seja, pasta raiz
      fs.readdirSync(fullPath).forEach((arquivo) => {
        // Verificação para realizar recursividade
        if (fs.statSync(`${fullPath}/${arquivo}`).isDirectory()) {
          if (options.recursive) return _search(`${fullPath}/${arquivo}`);

          return;
        }

        const content = fs.readFileSync(`${fullPath}/${arquivo}`, {
          encoding: 'utf8',
        });

        const fileProps = fs.statSync(`${fullPath}/${arquivo}`);

        loads.push({
          words: content.split(' ').filter((word) => !!word).length,
          elements: content.length,
          size: `${fileProps.size} bytes`,
          path: `${fullPath}/${arquivo}`,
          content,
        });
      });
    } else {
      const content = fs.readFileSync(fullPath, {
        encoding: 'utf8',
      });

      const fileProps = fs.statSync(fullPath);

      loads.push({
        words: content.split(' ').filter((word) => !!word).length,
        elements: content.length,
        size: `${fileProps.size} bytes`,
        path: fullPath,
        content,
      });
    }
  });

  showMessage(...lang.loadMessages(timeLoad, options, optionsProps, notFound, loads));

  input.question(lang.inputQuestion, (text) => {
    const timeFilter = new Date().getTime();

    const words = text.split(' ');

    const caseSensitive = options.caseSensitive ? 'g' : 'ig';
    const pattern = options.exact ? `(\\b${text}\\b)` : `${words.map((word) => `(\\b${word}\\b)`).join('|')}`;

    const regex = new RegExp(pattern, caseSensitive);

    const found = loads.filter((arquivo) => {
      const macths = arquivo.content.match(regex);
      const match = Array.from(new Set(macths));

      delete arquivo.content;

      return match && ((options.exact && match.length) || (words && match.length === words.length));
    });

    showMessage(...lang.filterMessages(timeFilter, text, options, found));

    input.close();

    /* istanbul ignore next */
    if (process.env.NODE_ENV !== 'test') process.exit();
  });
}
