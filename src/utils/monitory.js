const Sentry = require('@sentry/node');
const { mostraMensagem } = require('./message');
const env = require('#src/config/env.json');

process.on('uncaughtException', (err) => {
  mostraMensagem(
    'Ops!! Ocorreu uma falha não esperada!',
    '',
    ...(env.REPORT_ERROR
      ? [
          'Um aviso foi enviado para nossos desenvolvedores, fique tranquilo(a) eles vão corrigir o mais rápido possível.',
          '',
        ]
      : []),
    `O que aconteceu foi: ${err.message}`
  );

  if (env.REPORT_ERROR) {
    Sentry.init({
      dsn: 'https://8e3b9869e8c74b93bddaf17a5b378592@o613678.ingest.sentry.io/5749414',

      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: 1.0,
    });

    const transaction = Sentry.startTransaction({
      op: 'monitory',
      name: 'uncaughtException',
    });

    Sentry.configureScope((scope) => {
      scope.setLevel('error');
      scope.setTag('mechanism', 'generic');

      scope.setContext('parameters', {
        date: new Date(),
        argv: process.argv,
      });
    });

    Sentry.captureException(err, {});

    transaction.finish();

    Sentry.close().then(() => process.exit(1));
  }
});
