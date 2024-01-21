const { open } = require("node:fs/promises");
const { countOccurrences } = require("../util");

const types = {
  FIVE_KIND: 0,
  FOUR_KIND: 1,
  FULL_HOUSE: 2,
  THREE_KIND: 3,
  TWO_PAIR: 4,
  ONE_PAIR: 5,
  HIGH_CARD: 6,
};

const cards = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];

let sets = [];

(async () => {
  const file = await open("./input.txt");

  for await (const line of file.readLines()) {
    const [hand, bid] = parseLine(line);
    sets.push({ hand, bid });
  }

  sets.forEach((s) => (s.type = addType(s)));
  sets.sort(sortByTypeAndRank);

  const result = sets.reduce(
    (acc, cur, index) => acc + cur.bid * (index + 1),
    0
  );

  sets.forEach((s) => console.log(s));
  console.log(result);
  // 250232501
})();

function parseLine(line) {
  return line.split(" ");
}

function sortByTypeAndRank(a, b) {
  const diff = b.type - a.type;
  if (diff != 0) return diff;

  for (let index = 0; index < 5; index++) {
    const aCard = cards.indexOf(a.hand[index]);
    const bCard = cards.indexOf(b.hand[index]);

    if (aCard != bCard) return bCard - aCard;
  }

  throw new Error("foo");
}

function addType(set) {
  const hand = set.hand;
  const distinctCards = new Set(hand.split(""));

  console.log(hand, distinctCards.size);

  if (distinctCards.size == 5) return types.HIGH_CARD;
  if (distinctCards.size == 4) return types.ONE_PAIR;

  if (distinctCards.size == 3) {
    const occurrencesFirstCard = countOccurrences(hand, hand[0]);
    const occurrencesSecondCard = countOccurrences(hand, hand[1]);
    const occurrencesThirdCard = countOccurrences(hand, hand[2]);
    if (
      occurrencesFirstCard == 3 ||
      occurrencesSecondCard == 3 ||
      occurrencesThirdCard == 3
    )
      return types.THREE_KIND;
    return types.TWO_PAIR;
  }

  if (distinctCards.size == 2) {
    const occurrencesFirstCard = countOccurrences(hand, hand[0]);
    if (occurrencesFirstCard == 1 || occurrencesFirstCard == 4)
      return types.FOUR_KIND;
    return types.FULL_HOUSE;
  }

  return types.FIVE_KIND;
}
