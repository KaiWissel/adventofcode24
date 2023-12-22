const { open } = require("node:fs/promises");

async function main() {
  const file = await open("./input.txt");

  for await (const line of file.readLines()) {
    parseLine(line);
  }

  console.log(powerOfGames);
  console.log(powerOfGames.reduce((acc, cur) => +acc + +cur, 0));
}

const gameOffset = "Game ".length;

const powerOfGames = [];

function parseLine(line) {
  const lineWithOutPrefix = line.substring(gameOffset);
  const gameId = lineWithOutPrefix.substring(0, lineWithOutPrefix.indexOf(":"));
  const sets = lineWithOutPrefix
    .substring(gameId.toString().length + 2)
    .split("; ");

  console.log(sets);

  let minRed = 0;
  let minGreen = 0;
  let minBlue = 0;

  for (let index = 0; index < sets.length; index++) {
    const set = sets[index];
    const red = set.match(/(\d+) red/);
    if (red && +red[1] > minRed) {
      minRed = red[1];
    }
    const green = set.match(/(\d+) green/);
    if (green && +green[1] > minGreen) {
      minGreen = green[1];
    }
    const blue = set.match(/(\d+) blue/);
    if (blue && +blue[1] > minBlue) {
      minBlue = blue[1];
    }
  }
  console.log(minRed, minBlue, minGreen);
  powerOfGames.push(minRed * minBlue * minGreen);
}

main();
