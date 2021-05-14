const Sentry = require('@sentry/node');
const { showMessage } = require('./message');
const env = require('#src/config/env.json');
const { monitoryLanguages } = require('#src/utils/languages');

const lang = monitoryLanguages();

process.on('uncaughtException', (err) => {
  showMessage(...lang.uncaughtException(err));

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
