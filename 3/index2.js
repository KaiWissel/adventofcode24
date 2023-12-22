const { open } = require("node:fs/promises");

(async () => {
  const file = await open("./input.txt");

  let lineCounter = 0;
  const numbersMap = [];
  const symbolsMap = [];

  for await (const line of file.readLines()) {
    const [nums, syms] = parseLine(line, lineCounter);
    if (nums.length) {
      numbersMap.push(...nums);
    }
    if (syms.length) {
      symbolsMap.push(...syms);
    }
    lineCounter++;
  }

  const gearNumbers = symbolsMap
    .map((s) => {
      const numbersAdjacent = numbersMap.filter(
        (n) =>
          s.line >= n.line - 1 &&
          s.line <= n.line + 1 &&
          s.pos >= n.startPos - 1 &&
          s.pos <= n.endPos + 1
      );
      if (numbersAdjacent.length == 2) {
        return numbersAdjacent;
      }
    })
    .filter((e) => !!e)
    .map((e) => [e[0].value, e[1].value]);

  console.log(symbolsMap);
  console.log(numbersMap);
  console.log(gearNumbers);
  console.log(gearNumbers.reduce((acc, cur) => acc + +cur[0] * +cur[1], 0));
})();

function parseLine(line, lineNumber) {
  const chars = line.split("");
  const numbers = [];
  const syms = [];

  let startPos = 0;
  let value = "";

  for (let index = 0; index < chars.length; index++) {
    const char = chars[index];
    if (isNaN(char)) {
      if (char == "*") {
        syms.push({
          line: lineNumber,
          pos: index,
        });
      }

      if (value?.length) {
        numbers.push({
          line: lineNumber,
          startPos,
          endPos: index - 1,
          value,
        });

        value = "";
      }

      continue;
    }

    if (!value?.length) {
      startPos = index;
    }

    value += char;
  }

  if (value?.length) {
    numbers.push({
      line: lineNumber,
      startPos,
      endPos: chars.length - 1,
      value,
    });
  }

  return [numbers, syms];
}
