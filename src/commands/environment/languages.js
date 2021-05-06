const env = require('#src/config/env.json');

module.exports = () => {
  /* istanbul ignore next */
  switch (env.LANGUAGE) {
    default:
    case 'en-US':
      return {
        command: 'search-cli',
        name: 'environment',
        usage: '[options] [commands]',
        description: 'Show all environment variables',
        helpOption: {
          flags: '-h,   --help',
          description: 'Exibi ajuda para usar o comando',
        },
        notes: {
          title: 'Notes:',
          text: '  languages       pt-BR,en-US',
        },
        listCommand: {
          name: 'list',
          description: 'Show all environment variables',
          successMessage: (...str) => ['Environment variables:'],
        },
        getCommand: {
          name: 'get',
          argumentsText: '<name>',
          arguments: {
            name: 'Environment variable name',
          },
          description: 'Show a environment variable',
          successMessage: (...str) => [`Environment variable ${str[0]}: ${str[1]}`],
          errorMessage: (...str) => [`Environment variable ${str[0]} not found...`],
        },
        setCommand: {
          name: 'set',
          argumentsText: '<name> <value>',
          arguments: {
            name: 'Environment variable name',
            value: 'Enviornment variable value',
          },
          description: 'Change environment variable value',
          successMessage: (...str) => [`Success to change environment variable ${str[0]}`],
          errorMessage: (...str) => [`Environment variable ${str[0]} not found...`],
          unavailableLanguage: (...str) => [
            `The language ${str[0]} is not available.`,
            '',
            'See: search-cli environment set --help',
          ],
        },
        addHelpText: {
          title: 'Examples:',
          paths: './file01.txt ./file02.txt',
        },
      };

    case 'pt-BR':
      return {
        command: 'busca-cli',
        name: 'ambiente',
        usage: '[opcoes] [comando]',
        description: 'Exibi todas as variáveis de ambiente',
        helpOption: {
          flags: '-a,   --ajuda',
          description: 'Exibi ajuda para usar o comando',
        },
        notes: {
          title: 'Observações:',
          text: '  idiomas        pt-BR,en-US',
        },
        listCommand: {
          name: 'lista',
          description: 'Exibi todas as variáveis de ambiente',
          successMessage: (...str) => ['Variáveis de ambiente:'],
        },
        getCommand: {
          name: 'exibir',
          argumentsText: '<nome>',
          arguments: {
            nome: 'Nome da variável de ambiente',
          },
          description: 'Exibi uma variável de ambiente',
          successMessage: (...str) => [`Variável de ambiente ${str[0]}: ${str[1]}`],
          errorMessage: (...str) => [`Variável de ambiente ${str[0]} não encontrada...`],
        },
        setCommand: {
          name: 'alterar',
          argumentsText: '<nome> <valor>',
          arguments: {
            nome: 'Nome da variável de ambiente',
            valor: 'Valor da variável de ambiente',
          },
          description: 'Altera o valor de uma variável de ambiente',
          successMessage: (...str) => [`Sucesso ao alterar a variável de ambiente ${str[0]}`],
          errorMessage: (...str) => [`Variável de ambiente ${str[0]} não encontrada...`],
          unavailableLanguage: (...str) => [
            `O idioma ${str[0]} não está disponével.`,
            '',
            'Veja: busca-cli ambiente alterar --ajuda',
          ],
        },
        addHelpText: {
          title: 'Exemplos de chamada:',
          paths: './arquivo01.txt ./arquivo02.txt',
        },
      };
  }
};
