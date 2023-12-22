const { open } = require("node:fs/promises");

(async () => {
  const file = await open("./input.txt");

  const cardPoints = [];

  for await (const line of file.readLines()) {
    const [winNumbers, myNumbers] = parseLine(line);
    const points = matchNumbers(winNumbers, myNumbers);
    cardPoints.push(points);
  }

  console.log(cardPoints.reduce((acc, cur) => acc + cur, 0));
})();

function parseLine(line) {
  let [, winNumbers, myNumbers] = line.match(/Card\s+\d+:(.*)\|(.*)/);

  winNumbers = winNumbers
    .trim()
    .split(" ")
    .filter((e) => !!e);
  myNumbers = myNumbers
    .trim()
    .split(" ")
    .filter((e) => !!e);

  return [winNumbers, myNumbers];
}

function matchNumbers(winNumbers, myNumbers) {
  const numberOfMatches = myNumbers.filter((e) =>
    winNumbers.includes(e)
  ).length;

  const points = numberOfMatches ? 2 ** (numberOfMatches - 1) : 0;
  console.log(points);
  return points;
}
