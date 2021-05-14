const env = require('#src/config/env.json');

/**
 * Returns the display texts translated according to the LANGUAGE environment variable
 * @returns
 */
module.exports.mainLanguages = () => {
  /* istanbul ignore next */
  switch (env.LANGUAGE) {
    default:
    case 'en-US':
      return {
        header: 'SEARCH CLI',
        name: 'search-cli',
        usage: '[command]',
        helpOption: {
          flags: '-h,   --help',
          description: 'Display help for using the command',
        },
        versionOption: {
          flags: '-v,   --version',
          description: 'Show current version',
        },
      };

    case 'pt-BR':
      return {
        header: 'BUSCA CLI',
        name: 'busca-cli',
        usage: '[comando]',
        helpOption: {
          flags: '-a,   --ajuda',
          description: 'Exibi ajuda para usar o comando',
        },
        versionOption: {
          flags: '-v,   --versao',
          description: 'Exibi a versão atual',
        },
      };
  }
};

/**
 * Returns the display texts translated according to the LANGUAGE environment variable
 * @returns
 */
module.exports.monitoryLanguages = () => {
  /* istanbul ignore next */
  switch (env.LANGUAGE) {
    default:
    case 'en-US':
      return {
        uncaughtException: (err) => [
          'Oops!! An unexpected failure has occurred!',
          '',
          ...(env.REPORT_ERROR
            ? ['A warning has been sent to our developers, rest assured they will fix it as soon as possible.', '']
            : []),
          `What was happened: ${err.message}`,
        ],
      };

    case 'pt-BR':
      return {
        uncaughtException: (err) => [
          'Ops!! Ocorreu uma falha não esperada!',
          '',
          ...(env.REPORT_ERROR
            ? [
                'Um aviso foi enviado para nossos desenvolvedores, fique tranquilo(a) eles vão corrigir o mais rápido possível.',
                '',
              ]
            : []),
          `O que aconteceu foi: ${err.message}`,
        ],
      };
  }
};
