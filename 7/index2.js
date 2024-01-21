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

const cards = ["A", "K", "Q", "T", "9", "8", "7", "6", "5", "4", "3", "2", "J"];

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
  // 249138943
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

  const occurrencesOfJoker = countOccurrences(hand, "J");

  if (occurrencesOfJoker >= 4) return types.FIVE_KIND;

  if (hand == "QQQJA") {
    console.log("hello");
  }
  let tempType;

  if (distinctCards.size == 5) tempType = types.HIGH_CARD;
  if (distinctCards.size == 4) tempType = types.ONE_PAIR;

  if (distinctCards.size == 3) {
    const occurrencesFirstCard = countOccurrences(hand, hand[0]);
    const occurrencesSecondCard = countOccurrences(hand, hand[1]);
    const occurrencesThirdCard = countOccurrences(hand, hand[2]);
    if (
      occurrencesFirstCard == 3 ||
      occurrencesSecondCard == 3 ||
      occurrencesThirdCard == 3
    ) {
      tempType = types.THREE_KIND;
    } else {
      tempType = types.TWO_PAIR;
    }
  }

  if (distinctCards.size == 2) {
    const occurrencesFirstCard = countOccurrences(hand, hand[0]);
    if (occurrencesFirstCard == 1 || occurrencesFirstCard == 4) {
      tempType = types.FOUR_KIND;
    } else {
      tempType = types.FULL_HOUSE;
    }
  }

  switch (occurrencesOfJoker) {
    case 1:
      switch (tempType) {
        case types.HIGH_CARD:
          return types.ONE_PAIR;
        case types.ONE_PAIR:
          return types.THREE_KIND;
        case types.TWO_PAIR:
          return types.FULL_HOUSE;
        case types.THREE_KIND:
          return types.FOUR_KIND;
        case types.FULL_HOUSE:
          return types.FOUR_KIND;
        case types.FOUR_KIND:
          return types.FIVE_KIND;
        default:
          throw new Error("J1 " + tempType);
      }
    case 2:
      switch (tempType) {
        // case types.HIGH_CARD: // Can't be; Js are already at least one pair
        case types.ONE_PAIR:
          return types.THREE_KIND;
        case types.TWO_PAIR:
          return types.FOUR_KIND;
        // case types.THREE_KIND: // Can't be; Would already be a Full house with 2 Js
        case types.FULL_HOUSE:
          return types.FIVE_KIND;
        default:
          throw new Error("J2 " + tempType);
      }
    case 3:
      switch (tempType) {
        case types.THREE_KIND:
          return types.FOUR_KIND;
        // if (distinctCards.size == 2) // Can't be; Would already be a Full house
        case types.FULL_HOUSE:
          return types.FIVE_KIND;
        default:
          throw new Error("J3 " + tempType);
      }

    default:
      break;
  }

  return tempType;
}
