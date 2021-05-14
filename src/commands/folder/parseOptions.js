const env = require('#src/config/env.json');

module.exports = (options) => {
  /* istanbul ignore next */
  switch (env.LANGUAGE) {
    default:
    case 'en-US':
      return options;

    case 'pt-BR':
      return {
        paths: options.caminhos,
        details: options.detalhes,
        exact: options.exato,
        recursive: options.recursivo,
        caseSensitive: options.sensivel,
      };
  }
};
