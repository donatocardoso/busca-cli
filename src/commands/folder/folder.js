const { showMessage } = require('#src/utils/message');
const { Command, Option } = require('commander');
const fs = require('fs');
const path = require('path');
const languages = require('./languages');
const parseOptions = require('./parseOptions');

const lang = languages();

/**
 * Cria o comando `pasta`, que realiza uma busca em uma pasta
 * @param {Command} program
 * @returns Command
 */
module.exports = () => {
  return new Command(lang.name)
    .usage(lang.usage)
    .arguments(lang.arguments)
    .description(lang.description.text, lang.description.arguments)
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
    .action(folder);
};

/**
 *
 * @param {string} text Feel like it will be searched in the contents of the files to
 * @param {object} options Options for uploading files
 * @param {string[]} options.paths Paths in which the search will be carried out
 * @param {boolean} options.details You want a detailed search
 * @param {boolean} options.exact Want a search for the exact sentence
 * @param {boolean} options.recursive Want a search in the folder and sub-folders
 * @param {boolean} options.sensivel Want a search that is case sensitive
 */
function folder(text, options) {
  const time = new Date().getTime();

  const found = [];
  const notFound = [];
  const optionsProps = Object.getOwnPropertyNames(options).sort();

  options = parseOptions(options);

  const words = text.split(' ');

  const caseSensitive = options.caseSensitive ? 'g' : 'ig';
  const pattern = options.exact ? `(\\b${text}\\b)` : `${words.map((word) => `(\\b${word}\\b)`).join('|')}`;

  const regex = new RegExp(pattern, caseSensitive);

  options.paths.forEach(function _search(caminho) {
    const folderPath = path.resolve(process.cwd(), caminho);

    if (!fs.existsSync(folderPath)) return notFound.push(folderPath);

    if (!fs.statSync(folderPath).isDirectory()) return notFound.push(folderPath);

    fs.readdirSync(folderPath).forEach((arquivo) => {
      const filePath = `${folderPath}/${arquivo}`;

      if (fs.statSync(filePath).isDirectory()) {
        if (options.recursive) return _search(filePath, options);

        return;
      }

      const conteudo = fs.readFileSync(filePath, {
        encoding: 'utf8',
      });

      const fileProps = fs.statSync(filePath);

      const matchs = conteudo.match(regex);
      const match = Array.from(new Set(matchs));

      if (match && ((options.exact && match.length) || (words && match.length === words.length))) {
        found.push({
          matchs: matchs.length,
          words: conteudo.split(' ').filter((word) => !!word).length,
          elements: conteudo.length,
          size: `${fileProps.size} bytes`,
          path: filePath,
        });
      }
    });
  });

  showMessage(...lang.messages(time, text, optionsProps, options, found, notFound));

  /* istanbul ignore next */
  if (process.env.NODE_ENV !== 'test') process.exit();
}
