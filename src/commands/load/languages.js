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
        name: 'load',
        usage: '[options] -p [paths...]',
        description: {
          text: 'Checks if the files have the informed text',
        },
        pathsOption: {
          flags: '-p,   --paths           [paths...]',
          description: 'Folders to be scanned',
        },
        detailsOption: {
          flags: '-d,   --details',
          description: 'Returns file details',
        },
        exactOption: {
          flags: '-e,   --exact',
          description: 'Search for the exact informed sentence',
        },
        recursiveOption: {
          flags: '-r,   --recursive',
          description: 'Searches the folder and sub-folders for the given path',
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
          example01: '$ search-cli folder "walt disney" -p ./exemplo/pasta01 ./exemplo/pasta02',
          example02: '$ search-cli folder -dercs "walt disney" -p ./exemplo/pasta01 ./exemplo/pasta02',
          example03: '$ search-cli folder -d -e -r -cs "walt disney" -p ./exemplo/pasta01 ./exemplo/pasta02',
        },
        loadMessages: (timeLoad, options, optionsProps, notFound, loads) => [
          'Paths............................:',
          ...options.paths.map((path) => `     |__ ........................: ${path}`),
          '',
          `Options..........................: ${optionsProps}`,
          ...(notFound.length ? ['', 'The following paths were not found:', '', ...notFound, ''] : ['']),
          `Processing time..................: ${new Date().getTime() - timeLoad}ms`,
          `Were load........................: ${loads.length} files!`,
        ],
        inputQuestion: '\nEnter the text you want to search for:',
        filterMessages: (timeFilter, text, options, found) => [
          '',
          `${found.length} matches were found by the term "${text}"`,
          ...(found.length
            ? [
                `The files that have "${text}" are:`,
                '',
                ...(options.details ? found : found.map((file) => file.path)),
                '',
              ]
            : ['', 'No files found!', '']),
          `Processing time..................: ${new Date().getTime() - timeFilter}ms`,
          `Were found.......................: ${found.length} files!`,
        ],
      };

    case 'pt-BR':
      return {
        name: 'carregar',
        usage: '[opcoes] -c [caminhos...]',
        description: {
          text: 'Verifica se o(s) arquivo(s) possue(em) o texto informado',
        },
        pathsOption: {
          flags: '-c,   --caminhos  [caminhos...]',
          description: 'Pasta(s) em que a verificação será realizada',
        },
        detailsOption: {
          flags: '-d,   --detalhes',
          description: 'Retorna detalhes do(s) arquivo(s)',
        },
        exactOption: {
          flags: '-e,   --exato',
          description: 'Busca pela sentença exata informada',
        },
        recursiveOption: {
          flags: '-r,   --recursivo',
          description: 'Busca na pasta e sub-pastas do caminho informado',
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
          example01: '$ busca-cli pasta "walt disney" -c ./exemplo/pasta01 ./exemplo/pasta02',
          example02: '$ busca-cli pasta -ders "walt disney" -c ./exemplo/pasta01 ./exemplo/pasta02',
          example03: '$ busca-cli pasta -d -e -r -s "walt disney" -c ./exemplo/pasta01 ./exemplo/pasta02',
        },
        loadMessages: (timeLoad, options, optionsProps, notFound, loads) => [
          'Caminhos.........................:',
          ...options.paths.map((path) => `     |__ ........................: ${path}`),
          '',
          `Opções...........................: ${optionsProps}`,
          ...(notFound.length ? ['', 'Os caminhos a seguir não foram encontrados:', '', ...notFound, ''] : ['']),
          `Tempo de processamento...........: ${new Date().getTime() - timeLoad}ms`,
          `Foram carregados.................: ${loads.length} arquivos!`,
        ],
        inputQuestion: '\nInforme o texto que deseja buscar: ',
        filterMessages: (timeFilter, text, options, found) => [
          '',
          `Foram encontradas ${found.length} ocorrências pelo termo "${text}"`,
          ...(found.length
            ? [
                `Os arquivos que possuem "${text}" são:`,
                '',
                ...(options.details ? found : found.map((file) => file.path)),
                '',
              ]
            : ['', 'Nenhum arquivo encontrado!', '']),
          `Tempo de processamento...........: ${new Date().getTime() - timeFilter}ms`,
          `Foram encontrados................: ${found.length} arquivos!`,
        ],
      };
  }
};
