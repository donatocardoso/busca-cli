const fs = require('fs');
const readline = require('readline');

jest.mock('readline');

readline.createInterface.mockImplementation((args) => ({
  close: jest.fn().mockImplementation(() => undefined),
  question: jest.fn().mockImplementation((question, cb) => cb('jack bravman')),
}));

if (!fs.existsSync('./example/data')) fs.mkdirSync('./example/data');

fs.writeFileSync(
  './example/data/arquivo00.txt',
  'assassin 1986 robert conrad karen deborah austin jonathan banks sandor stern sandor stern neil t. maffeo'
);

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
  'night of the dribbler 1990 fred travalena gregory calpakis flavia carrozzi Jack Bravman'
);

fs.writeFileSync(
  './example/data/arquivo04.txt',
  'nightmares 1983 emilio estevez lance henriksen richard masur joseph sargent'
);

if (!fs.existsSync('./example/data/subfolder')) fs.mkdirSync('./example/data/subfolder');

fs.writeFileSync(
  './example/data/subfolder/arquivo05.txt',
  'assassin 1986 Karen Robert Conrad deborah austin jonathan banks sandor stern sandor stern neil t. maffeo'
);

fs.writeFileSync(
  './example/data/subfolder/arquivo06.txt',
  'night catches us 2010 Kerry Anthony Mackie washington wendell pierce tanya hamilton tanya hamilton'
);

fs.writeFileSync(
  './example/data/subfolder/arquivo07.txt',
  'night market hero 2011 zheng-long lan jia-yan ke tien-lun yeh tan-ching yeh Bravman Jack'
);

fs.writeFileSync(
  './example/data/subfolder/arquivo08.txt',
  'night of the dribbler 1990 fred travalena gregory calpakis flavia carrozzi jack bravman'
);

fs.writeFileSync(
  './example/data/subfolder/arquivo09.txt',
  'nightmares 1983 emilio estevez lance henriksen richard masur joseph sargent'
);
