const { open } = require("node:fs/promises");

async function main() {
  const file = await open("./input.txt");

  for await (const line of file.readLines()) {
    parseLine(line);
  }

  console.log(possibleGames);
  console.log(possibleGames.reduce((acc, cur) => +acc + +cur, 0));
}

const maxRed = 12;
const maxGreen = 13;
const maxBlue = 14;

const gameOffset = "Game ".length;

const possibleGames = [];

function parseLine(line) {
  const lineWithOutPrefix = line.substring(gameOffset);
  const gameId = lineWithOutPrefix.substring(0, lineWithOutPrefix.indexOf(":"));
  const sets = lineWithOutPrefix
    .substring(gameId.toString().length + 2)
    .split("; ");

  console.log(sets);

  for (let index = 0; index < sets.length; index++) {
    const set = sets[index];
    const red = set.match(/(\d+) red/);
    if (red && red[1] > maxRed) {
      return;
    }
    const green = set.match(/(\d+) green/);
    if (green && green[1] > maxGreen) {
      return;
    }
    const blue = set.match(/(\d+) blue/);
    if (blue && blue[1] > maxBlue) {
      return;
    }
  }
  possibleGames.push(gameId);
}

main();
