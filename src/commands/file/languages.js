const env = require('#src/config/env.json');

/**
 * Returns the display texts translated according to the LANGUAGE environment variable
 * @returns
 */
module.exports = () => {
  /* istanbul ignore next */
  switch (env.LANGUAGE) {
    default:
    case 'en-US':
      return {
        name: 'file',
        usage: '[options] <text> -p [paths...]',
        arguments: '<text>',
        description: {
          text: 'Checks if the files have the informed text',
          arguments: {
            text: 'Search text in file',
          },
        },
        pathsOption: {
          flags: '-p,   --paths           [paths...]',
          description: 'Files to be scanned',
        },
        detailsOption: {
          flags: '-d,   --details',
          description: 'Returns file details',
        },
        exactOption: {
          flags: '-e,   --exact',
          description: 'Search for the exact informed sentence',
        },
        caseSensitiveOption: {
          flags: '-cs,  --case-sensitive',
          description: 'Case sensitive',
        },
        helpOption: {
          flags: '-h,   --help',
          description: 'Display help for using the command',
        },
        addHelpText: {
          title: 'Examples:',
          example01: '$ search-cli file "walt disney" -c ./file01.txt ./file02.txt',
          example02: '$ search-cli file -des "walt disney" -c ./file01.txt ./file02.txt',
          example03: '$ search-cli file -d -e -cs "walt disney" -c ./file01.txt ./file02.txt',
        },
        messages: (time, text, optionsProps, options, found, notFound) => [
          'Parameters.......................:',
          `     |_ text.....................: "${text}"`,
          '',
          'Paths............................:',
          ...options.paths.map((path) => `     |__ ........................: ${path}`),
          '',
          `Options..........................: ${optionsProps}`,
          ...(notFound.length ? ['', 'The following paths were not found:', '', ...notFound, ''] : ['']),
          `${found.length} matches were found for the term "${text}"`,
          ...(found.length
            ? [
                `The files that have "${text}" are:`,
                '',
                ...(options.details ? found : found.map((file) => file.path)),
                '',
              ]
            : ['', 'No files found!', '']),
          `Processing time..................: ${new Date().getTime() - time}ms`,
          `Were found.......................: ${found.length} files!`,
        ],
      };

    case 'pt-BR':
      return {
        name: 'arquivo',
        usage: '[opcoes] <texto> -c [caminhos...]',
        arguments: '<texto>',
        description: {
          text: 'Verifica se o(s) arquivo(s) possue(em) o texto informado',
          arguments: {
            texto: 'Texto de busca no arquivo',
          },
        },
        pathsOption: {
          flags: '-c,   --caminhos  [caminhos...]',
          description: 'Arquivo(s) em que a verificação será realizada',
        },
        detailsOption: {
          flags: '-d,   --detalhes',
          description: 'Retorna detalhes do(s) arquivo(s)',
        },
        exactOption: {
          flags: '-e,   --exato',
          description: 'Busca pela sentença exata informada',
        },
        caseSensitiveOption: {
          flags: '-s,   --sensivel',
          description: 'Diferencia maiúscula de minúscula',
        },
        helpOption: {
          flags: '-a,   --ajuda',
          description: 'Exibi ajuda para usar o comando',
        },
        addHelpText: {
          title: 'Exemplos de chamada:',
          example01: '$ busca-cli arquivo "walt disney" -c ./arquivo01.txt ./arquivo02.txt',
          example02: '$ busca-cli arquivo -des "walt disney" -c ./arquivo01.txt ./arquivo02.txt',
          example03: '$ busca-cli arquivo -d -e -s "walt disney" -c ./arquivo01.txt ./arquivo02.txt',
        },
        messages: (time, text, optionsProps, options, found, notFound) => [
          'Parâmetro........................:',
          `     |_ texto....................: "${text}"`,
          '',
          'Caminhos.........................:',
          ...options.paths.map((path) => `     |__ ........................: ${path}`),
          '',
          `Opções...........................: ${optionsProps}`,
          ...(notFound.length ? ['', 'Os caminhos a seguir não foram encontrados:', '', ...notFound, ''] : ['']),
          `Foram encontradas ${found.length} ocorrências pelo termo "${text}"`,
          ...(found.length
            ? [
                `Os arquivos que possuem "${text}" são:`,
                '',
                ...(options.details
                  ? found.map((file) => ({
                      encontros: file.matchs,
                      palavras: file.words,
                      elementos: file.elements,
                      tamanho: file.size,
                      caminho: file.path,
                    }))
                  : found.map((file) => file.path)),
                '',
              ]
            : ['', 'Nenhum arquivo encontrado!', '']),
          `Tempo de processamento...........: ${new Date().getTime() - time}ms`,
          `Foram encontrados................: ${found.length} arquivos!`,
        ],
      };
  }
};
