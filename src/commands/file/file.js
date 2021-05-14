const { showMessage } = require('#src/utils/message');
const { Command, Option } = require('commander');
const fs = require('fs');
const path = require('path');
const languages = require('./languages');
const parseOptions = require('./parseOptions');

const lang = languages();

/**
 * Cria o comando `arquivo`, que realiza uma busca em um ou mais arquivos
 * @param {Command} programa
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
    .addOption(new Option(lang.caseSensitiveOption.flags, lang.caseSensitiveOption.description))
    .helpOption(lang.helpOption.flags, lang.helpOption.description)
    .addHelpText('afterAll', ' ')
    .addHelpText('afterAll', lang.addHelpText.title)
    .addHelpText('afterAll', ' ')
    .addHelpText('afterAll', lang.addHelpText.example01)
    .addHelpText('afterAll', lang.addHelpText.example02)
    .addHelpText('afterAll', lang.addHelpText.example03)
    .action(file);
};

/**
 *
 * @param {string} text Senteça que será busca no conteudo dos arquivos para
 * @param {object} options Opções para carregar os arquivos
 * @param {string[]} options.caminhos Caminhos em que a busca será realizada
 * @param {boolean} options.detalhes Deseja uma busca detalhada
 * @param {boolean} options.exact Deseja uma busca pela sentença exata
 * @param {boolean} options.sensivel Deseja uma busca que diferencie maiúscula de minúscula
 */
function file(text, options) {
  const time = new Date().getTime();

  const found = [];
  const notFound = [];
  const optionsProps = Object.getOwnPropertyNames(options).sort();

  options = parseOptions(options);

  const words = text.split(' ');

  const caseSensitive = options.caseSensitive ? 'g' : 'ig';
  const pattern = options.exact ? `(\\b${text}\\b)` : `${words.map((word) => `(\\b${word}\\b)`).join('|')}`;

  const regex = new RegExp(pattern, caseSensitive);

  options.paths.forEach((filePath) => {
    const fullFilePath = path.resolve(process.cwd(), filePath);

    if (!fs.existsSync(fullFilePath)) return notFound.push(fullFilePath);

    if (fs.statSync(fullFilePath).isDirectory()) return notFound.push(fullFilePath);

    const content = fs.readFileSync(fullFilePath, {
      encoding: 'utf8',
    });

    const fileProps = fs.statSync(fullFilePath);

    const matchs = content.match(regex);
    const match = Array.from(new Set(matchs));

    if (match && ((options.exact && match.length) || (words && match.length === words.length))) {
      found.push({
        matchs: matchs.length,
        words: content.split(' ').filter((word) => !!word).length,
        elements: content.length,
        size: `${fileProps.size} bytes`,
        path: fullFilePath,
      });
    }
  });

  showMessage(...lang.messages(time, text, optionsProps, options, found, notFound));

  /* istanbul ignore next */
  if (process.env.NODE_ENV !== 'test') process.exit();
}
