import fs from "fs";

const input: string = fs
  .readFileSync("day 7/input.txt", "utf-8")
  .replace(/\r\n/g, "\n");

const test: string = fs
  .readFileSync("day 7/test.txt", "utf-8")
  .replace(/\r\n/g, "\n");

type Hand = {
  cards: string;
  bid: number;
  handType: HandType;
};

enum HandType {
  FiveOfAKind = "Five of a kind",
  FourOfAKind = "Four of a kind",
  FullHouse = "Full house",
  ThreeOfAKind = "Three of a kind",
  TwoPair = "Two pair",
  OnePair = "One pair",
  HighCard = "High card",
  Unknown = "Unknown",
}

const cardValue = [
  "A",
  "K",
  "Q",
  "J",
  "T",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
];

function getCardValue(card: string, joker: boolean): number {
  return joker && card === "J"
    ? cardValue.length + 1
    : cardValue.findIndex((cardValue) => cardValue === card);
}

function getHandTypeValue(type: HandType): number {
  return Object.values(HandType).indexOf(type);
}

function getHandType(hand: string, joker: boolean): HandType {
  const letterCount: { [key: string]: number } = {};
  let fourOfAKind = 0;
  let threeOfAKind = 0;
  let twoOfAKind = 0;

  const jokers = joker ? hand.match(/J/g)?.length || 0 : 0;
  if (jokers >= 4 && jokers) return HandType.FiveOfAKind;

  for (const char of hand) {
    letterCount[char] = (letterCount[char] || 0) + 1;

    if (char === "J" && joker) {
      continue;
    }

    const curLetterCount = letterCount[char];

    if (curLetterCount === 5) return HandType.FiveOfAKind;

    if (curLetterCount === 4) {
      fourOfAKind++;
      threeOfAKind--;
    }

    if (curLetterCount === 3) {
      threeOfAKind++;
      twoOfAKind--;
    }

    if (curLetterCount === 2) twoOfAKind++;
  }

  if (
    (fourOfAKind === 1 && jokers === 1) ||
    (threeOfAKind === 1 && jokers === 2) ||
    (twoOfAKind === 1 && jokers === 3)
  ) {
    return HandType.FiveOfAKind;
  }

  if (
    fourOfAKind === 1 ||
    (threeOfAKind === 1 && jokers === 1) ||
    (twoOfAKind === 1 && jokers === 2) ||
    jokers === 3
  ) {
    return HandType.FourOfAKind;
  }

  if (
    (threeOfAKind === 1 && twoOfAKind === 1) ||
    (twoOfAKind === 2 && jokers === 1)
  ) {
    return HandType.FullHouse;
  }

  if (
    (threeOfAKind === 1 && jokers === 0) ||
    (twoOfAKind === 1 && jokers === 1) ||
    jokers === 2
  ) {
    return HandType.ThreeOfAKind;
  }

  if (twoOfAKind === 2) return HandType.TwoPair;

  if (twoOfAKind === 1 || jokers === 1) return HandType.OnePair;

  return HandType.HighCard;
}

function camelCards(input: string, joker: boolean) {
  console.time("Time spent");

  const hands: Hand[] = input.split("\n").map((hand) => {
    const [cards, bid] = hand.split(" ");
    return { cards, bid: parseInt(bid), handType: getHandType(cards, joker) };
  });

  hands.sort((a, b) => {
    const handDifference =
      getHandTypeValue(b.handType) - getHandTypeValue(a.handType);
    if (handDifference !== 0) return handDifference;

    for (let value = 0; value < cardValue.length; value++) {
      const difference =
        getCardValue(b.cards[value], joker) -
        getCardValue(a.cards[value], joker);

      if (difference !== 0) return difference;
    }
    return 0;
  });

  const result = hands.reduce((acc, hand, idx) => {
    return (acc += hand.bid * (idx + 1));
  }, 0);

  console.timeEnd("Time spent");
  return result;
}

console.log("Part 1:", camelCards(input, false));

console.log("Part 2:", camelCards(input, true));
