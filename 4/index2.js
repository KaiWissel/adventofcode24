const { open } = require("node:fs/promises");

(async () => {
  const file = await open("./input.txt");

  const cards = [];

  let cardCounter = 1;

  for await (const line of file.readLines()) {
    const [winNumbers, myNumbers] = parseLine(line);
    const numberOfMatches = matchNumbers(winNumbers, myNumbers);

    const copiesWon = Array.from(
      { length: cardCounter + numberOfMatches - cardCounter },
      (_, index) => cardCounter + 1 + index
    );
    console.log("Current card:", cardCounter);

    // Add original
    let amountOfCurrentCard = cards[cardCounter - 1];
    if (amountOfCurrentCard) {
      cards[cardCounter - 1]++;
    } else {
      cards[cardCounter - 1] = 1;
    }
    amountOfCurrentCard = cards[cardCounter - 1];

    console.log("Copies of cards won:", copiesWon, amountOfCurrentCard);

    // Add so many copies of the won cards as we have copies of the current card
    copiesWon.forEach((e) => {
      const card = cards[e - 1];
      if (card) return (cards[e - 1] += amountOfCurrentCard);
      cards[e - 1] = amountOfCurrentCard;
    });

    for (let index = 0; index < cards.length; index++) {
      const element = cards[index];
      console.log(index + 1, element);
    }

    cardCounter++;
  }

  console.log(cards.reduce((acc, cur) => acc + cur, 0));
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

  return numberOfMatches;
}
