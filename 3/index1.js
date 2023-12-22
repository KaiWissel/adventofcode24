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

  const partNumbers = numbersMap
    .filter((n) =>
      symbolsMap.some(
        (s) =>
          s.line >= n.line - 1 &&
          s.line <= n.line + 1 &&
          s.pos >= n.startPos - 1 &&
          s.pos <= n.endPos + 1
      )
    )
    .map((n) => +n.value);

  console.log(symbolsMap);
  console.log(numbersMap);
  console.log(partNumbers.reduce((acc, cur) => acc + cur, 0));
})();

const symbols = ["*", "#", "+", "$", "/", "@", "&", "=", "%", "-"];

function parseLine(line, lineNumber) {
  const chars = line.split("");
  const numbers = [];
  const syms = [];

  let startPos = 0;
  let value = "";

  for (let index = 0; index < chars.length; index++) {
    const char = chars[index];
    if (isNaN(char)) {
      if (symbols.includes(char)) {
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
