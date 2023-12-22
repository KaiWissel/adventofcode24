const { open } = require("node:fs/promises");

(async () => {
  const file = await open("./input.txt");

  let calibrationValue = 0;

  for await (const line of file.readLines()) {
    calibrationValue += calibrationNumberOfLine(line);
  }

  console.log(calibrationValue);
})();

const numbers = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];

function calibrationNumberOfLine(line) {
  const firstWordDigit = numbers.reduce(
    (acc, curValue, curIndex) => {
      const posOfElement = line.indexOf(curValue);
      if (posOfElement > -1 && posOfElement < acc.pos) {
        return { value: curIndex + 1, pos: posOfElement };
      }
      return acc;
    },
    { value: 0, pos: Number.MAX_SAFE_INTEGER }
  );

  const lastWordDigit = numbers.reduce(
    (acc, curValue, curIndex) => {
      const posOfElement = line.lastIndexOf(curValue);
      if (posOfElement > -1 && posOfElement > acc.pos) {
        return { value: curIndex + 1, pos: posOfElement };
      }
      return acc;
    },
    { value: 0, pos: Number.MIN_SAFE_INTEGER }
  );

  const numbersOfLine = line.split("").filter((e) => !isNaN(e));
  const indexFirstNumber = line.indexOf(numbersOfLine[0]);
  const indexLastNumber = line.lastIndexOf(
    numbersOfLine[numbersOfLine.length - 1]
  );

  const firstPart =
    indexFirstNumber < firstWordDigit.pos
      ? numbersOfLine[0]
      : firstWordDigit.value;

  const lastPart =
    indexLastNumber > lastWordDigit.pos
      ? numbersOfLine[numbersOfLine.length - 1]
      : lastWordDigit.value;

  return +(firstPart + "" + lastPart);
}
