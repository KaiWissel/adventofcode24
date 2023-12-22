const { open } = require("node:fs/promises");

(async () => {
  const file = await open("./input.txt");

  let calibrationValue = 0;

  for await (const line of file.readLines()) {
    calibrationValue += calibrationNumberOfLine(line);
  }

  console.log(calibrationValue);
})();

function calibrationNumberOfLine(line) {
  const numbersOfLine = line.split("").filter((e) => !isNaN(e));

  return +(numbersOfLine[0] + "" + numbersOfLine[numbersOfLine.length - 1]);
}
