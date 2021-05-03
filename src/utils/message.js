let output = [];

module.exports.mostraMensagem = (...mesagens) => {
  for (const mesagem of mesagens) {
    /* istanbul ignore next */
    if (process.env.NODE_ENV === 'test') {
      output.push(mesagem);
    } else {
      /* istanbul ignore next */
      console.log(mesagem);
    }
  }
};

module.exports.output = output;
