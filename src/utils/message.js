let output = [];

module.exports.showMessage = (...messages) => {
  for (const message of messages) {
    /* istanbul ignore next */
    if (process.env.NODE_ENV === 'test') {
      output.push(message);
    } else {
      /* istanbul ignore next */
      console.log(message);
    }
  }
};

module.exports.output = output;
