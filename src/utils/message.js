let output = [];

module.exports.showMessage = (...messages) => {
  for (const message of messages) {
    if (process.env.NODE_ENV === 'test') {
      output.push(message);
    } else {
      console.log(message);
    }
  }
};

module.exports.mostraMensagem = (...mesagens) => {
  for (const mesagem of mesagens) {
    if (process.env.NODE_ENV === 'test') {
      output.push(mesagem);
    } else {
      console.log(mesagem);
    }
  }
};

module.exports.output = output;
