const { Command, Option } = require('commander');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { mostraMensagem } = require('../../utils/message');

const input = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

/**
 * Cria o comando `carregar`, que realiza uma busca em um ou mais caminhos
 * @param {Command} programa
 * @returns Command
 */
module.exports = () => {
  return new Command('carregar')
    .usage('[opcoes] -c [caminhos...]')
    .description('Carrega em memória os arquivos do diretório informado', {
      caminho: 'Diretório em que a busca será realizada',
      texto: 'Texto de busca nos arquivos',
    })
    .requiredOption('-c,   --caminhos  [caminhos...]', 'Arquivo(s) em que a verificação será realizada')
    .addOption(new Option('-d,   --detalhes', 'Retorna detalhes dos arquivos encontrados'))
    .addOption(new Option('-e,   --exato', 'Busca pela sentença exata informada'))
    .addOption(new Option('-r,   --recursivo', 'Busca na pasta e sub-pastas do caminho informado'))
    .addOption(new Option('-s,   --sensivel', 'Diferencia maiúscula de minúscula'))
    .helpOption('-a,   --ajuda', 'Exibi ajuda para usar o comando')
    .addHelpText('afterAll', '\nExemplos de chamada:\n')
    .addHelpText('afterAll', '')
    .addHelpText('afterAll', '$ busca-cli carregar -c ./pasta01 ./pasta02 ./arquivo01.txt ./arquivo02.txt')
    .addHelpText('afterAll', '$ busca-cli carregar -ders -c ./pasta01 ./pasta02 ./arquivo01.txt ./arquivo02.txt')
    .addHelpText('afterAll', '$ busca-cli carregar -d -e -r -s -c ./pasta01 ./pasta02 ./arquivo01.txt ./arquivo02.txt')
    .action(carregar);
};

/**
 * Carregar arquivos em memoria e realiza um filtro comforme texto informado
 * @param {object} options Opções para carregar os arquivos
 * @param {string[]} options.caminhos Caminhos em que a busca será realizada
 * @param {boolean} options.detalhes Deseja uma busca detalhada
 * @param {boolean} options.exato Deseja uma busca pela sentença exata
 * @param {boolean} options.recursivo Deseja uma busca na pasta e sub-pastas
 * @param {boolean} options.sensivel Deseja uma busca que diferencie maiúscula de minúscula
 */
function carregar(options) {
  const tempoCarregar = new Date().getTime();

  const carregados = [];
  const naoEncontrados = [];
  const opcoesProps = Object.getOwnPropertyNames(options).sort();

  options.caminhos.forEach(function _busca(caminho) {
    const caminhoCompleto = path.resolve(process.cwd(), caminho);

    if (!fs.existsSync(caminhoCompleto)) return naoEncontrados.push(caminhoCompleto);

    if (fs.statSync(caminhoCompleto).isDirectory()) {
      // Pasta informada via paramentro, ou seja, pasta raiz
      fs.readdirSync(caminhoCompleto).forEach((arquivo) => {
        // Verificação para realizar recursividade
        if (fs.statSync(`${caminhoCompleto}/${arquivo}`).isDirectory()) {
          if (options.recursivo) return _busca(`${caminhoCompleto}/${arquivo}`);

          return;
        }

        const conteudo = fs.readFileSync(`${caminhoCompleto}/${arquivo}`, {
          encoding: 'utf8',
        });

        const propriedades = fs.statSync(`${caminhoCompleto}/${arquivo}`);

        carregados.push({
          palavras: conteudo.split(' ').filter((word) => !!word).length,
          elementos: conteudo.length,
          tamanho: `${propriedades.size} bytes`,
          caminho: `${caminhoCompleto}/${arquivo}`,
          conteudo,
        });
      });
    } else {
      const conteudo = fs.readFileSync(caminhoCompleto, {
        encoding: 'utf8',
      });

      const propriedades = fs.statSync(caminhoCompleto);

      carregados.push({
        palavras: conteudo.split(' ').filter((word) => !!word).length,
        elementos: conteudo.length,
        tamanho: `${propriedades.size} bytes`,
        caminho: caminhoCompleto,
        conteudo,
      });
    }
  });

  mostraMensagem(
    'Caminhos.........................:',
    ...options.caminhos.map((caminho) => `     |__ ........................: ${caminho}`),
    '',
    `Opções...........................: ${opcoesProps}`,
    ...(naoEncontrados.length ? ['', 'Os caminhos a seguir não foram encontrados:', '', ...naoEncontrados, ''] : ['']),
    `Tempo de processamento...........: ${new Date().getTime() - tempoCarregar}ms`,
    `Foram carregados.................: ${carregados.length} arquivos!`
  );

  input.question('\nInforme o texto que deseja buscar: ', (texto) => {
    const tempoFiltrar = new Date().getTime();

    const palavras = texto.split(' ');

    const sensivel = options.sensivel ? 'g' : 'ig';
    const pattern = options.exato ? `(\\b${texto}\\b)` : `${palavras.map((word) => `(\\b${word}\\b)`).join('|')}`;

    const regex = new RegExp(pattern, sensivel);

    const encontrados = carregados.filter((arquivo) => {
      const encontros = arquivo.conteudo.match(regex);
      const encontrosUnicos = Array.from(new Set(encontros));

      delete arquivo.conteudo;

      return (
        encontrosUnicos &&
        ((options.exato && encontrosUnicos.length) || (palavras && encontrosUnicos.length === palavras.length))
      );
    });

    mostraMensagem(
      '',
      `Foram encontradas ${encontrados.length} ocorrências pelo termo "${texto}"`,
      ...(encontrados.length
        ? [
            `Os arquivos que possuem "${texto}" são:`,
            '',
            ...(options.detalhes ? encontrados : encontrados.map((arquivo) => arquivo.caminho)),
            '',
          ]
        : ['', 'Nenhum arquivo encontrado!', '']),
      `Tempo de processamento...........: ${new Date().getTime() - tempoFiltrar}ms`,
      `Foram encontrados................: ${encontrados.length} arquivos!`
    );

    input.close();

    /* istanbul ignore next */
    if (process.env.NODE_ENV !== 'test') process.exit();
  });
}
