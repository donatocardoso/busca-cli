const fs = require('fs');
const readline = require('readline');

jest.mock('readline');

readline.createInterface.mockImplementation((args) => ({
  close: jest.fn().mockImplementation(() => undefined),
  question: jest.fn().mockImplementation((question, cb) => cb('deborah austin')),
}));

fs.writeFileSync(
  './example/data/arquivo01.txt',
  'night catches us 2010 anthony mackie kerry washington wendell pierce tanya hamilton tanya hamilton'
);

fs.writeFileSync(
  './example/data/arquivo02.txt',
  'night market hero 2011 zheng-long lan jia-yan ke tien-lun yeh tan-ching yeh Bravman Jack'
);

fs.writeFileSync(
  './example/data/arquivo03.txt',
  'night of the dribbler 1990 fred travalena gregory calpakis flavia carrozzi jack bravman'
);

fs.writeFileSync(
  './example/data/arquivo04.txt',
  'nightmares 1983 emilio estevez lance henriksen richard masur joseph sargent'
);

fs.writeFileSync(
  './example/data/arquivo05.txt',
  'nightmare in badham county 1976 austin deborah raffin lynne moody chuck connors john llewellyn moxey'
);

fs.writeFileSync(
  './example/data/arquivo06.txt',
  'nerdcore rising 2008 damian hess gaby alter brandon patton negin farsad negin farsad kim gatewood'
);

fs.writeFileSync(
  './example/data/arquivo07.txt',
  'nightmare in chicago 1964 andrew duggan charles mcgraw michael murphy robert altman william p. mcgivern'
);

fs.writeFileSync(
  './example/data/arquivo08.txt',
  'nanking 2007 hugo armstrong rosalind chao Deborah Austin stephen dorff bill guttentag dan sturman dan sturman'
);

fs.writeFileSync(
  './example/data/arquivo09.txt',
  'assassin 1986 robert conrad karen deborah austin jonathan banks sandor stern sandor stern neil t. maffeo'
);
