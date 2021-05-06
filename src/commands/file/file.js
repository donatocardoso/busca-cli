let { Command, Option } = require('commander');
let fs = require('fs');
let path = require('path');
let { mostraMensagem } = require('../../utils/message');

/**
 * Cria o comando `arquivo`, que realiza uma busca em um ou mais arquivos
 * @param {Command} programa
 * @returns Command
 */
module.exports = () => {
  return new Command('arquivo')
    .usage('[opcoes] <texto> -c [caminhos...]')
    .arguments('<texto>')
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
    .action(arquivo);
};

/**
 *
 * @param {string} texto Senteça que será busca no conteudo dos arquivos para
 * @param {object} options Opções para carregar os arquivos
 * @param {string[]} options.caminhos Caminhos em que a busca será realizada
 * @param {boolean} options.detalhes Deseja uma busca detalhada
 * @param {boolean} options.exato Deseja uma busca pela sentença exata
 * @param {boolean} options.sensivel Deseja uma busca que diferencie maiúscula de minúscula
 */
function arquivo(texto, options) {
  const tempo = new Date().getTime();

  const encontrados = [];
  const naoEncontrados = [];
  const opcoesProps = Object.getOwnPropertyNames(options).sort();

  const palavras = texto.split(' ');

  const sensivel = options.sensivel ? 'g' : 'ig';
  const pattern = options.exato ? `(\\b${texto}\\b)` : `${palavras.map((word) => `(\\b${word}\\b)`).join('|')}`;

  const regex = new RegExp(pattern, sensivel);

  options.caminhos.forEach((caminho) => {
    const caminhoArquivo = path.resolve(process.cwd(), caminho);

    if (!fs.existsSync(caminhoArquivo)) return naoEncontrados.push(caminhoArquivo);

    if (fs.statSync(caminhoArquivo).isDirectory()) return naoEncontrados.push(caminhoArquivo);

    const conteudo = fs.readFileSync(caminhoArquivo, {
      encoding: 'utf8',
    });

    const propriedades = fs.statSync(caminhoArquivo);

    const encontros = conteudo.match(regex);
    const encontrosUnicos = Array.from(new Set(encontros));

    if (
      encontrosUnicos &&
      ((options.exato && encontrosUnicos.length) || (palavras && encontrosUnicos.length === palavras.length))
    ) {
      encontrados.push({
        encontros: encontros.length,
        palavras: conteudo.split(' ').filter((word) => !!word).length,
        elementos: conteudo.length,
        tamanho: `${propriedades.size} bytes`,
        caminho: caminhoArquivo,
      });
    }
  });

  mostraMensagem(
    'Parâmetro........................:',
    `     |_ texto....................: "${texto}"`,
    '',
    'Caminhos.........................:',
    ...options.caminhos.map((caminho) => `     |__ ........................: ${caminho}`),
    '',
    `Opções...........................: ${opcoesProps}`,
    ...(naoEncontrados.length ? ['', 'Os caminhos a seguir não foram encontrados:', '', ...naoEncontrados, ''] : ['']),
    `Foram encontradas ${encontrados.length} ocorrências pelo termo "${texto}"`,
    ...(encontrados.length
      ? [
          `Os arquivos que possuem "${texto}" são:`,
          '',
          ...(options.detalhes ? encontrados : encontrados.map((arquivo) => arquivo.caminho)),
          '',
        ]
      : ['', 'Nenhum arquivo encontrado!', '']),
    `Tempo de processamento...........: ${new Date().getTime() - tempo}ms`,
    `Foram encontrados................: ${encontrados.length} arquivos!`
  );

  /* istanbul ignore next */
  if (process.env.NODE_ENV !== 'test') process.exit();
}
