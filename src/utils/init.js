const fs = require('fs');
const path = require('path');

module.exports = async () => {
  const folder = path.resolve(__dirname, '../config');
  const env = path.resolve(__dirname, '../config/env.json');

  if (!fs.existsSync(folder)) fs.mkdirSync(folder);

  if (!fs.existsSync(env)) {
    fs.writeFileSync(
      env,
      JSON.stringify({
        LANGUAGE: 'pt-BR',
        REPORT_ERROR: false,
      })
    );
  }
};
