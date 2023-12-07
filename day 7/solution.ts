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

function getCardValue(card: string, hasJoker: boolean): number {
  return hasJoker && card === "J"
    ? cardValue.length + 1
    : cardValue.findIndex((cardValue) => cardValue === card);
}

function getHandTypeValue(type: HandType): number {
  return Object.values(HandType).indexOf(type);
}

function getHandType(hand: string, hasJoker: boolean): HandType {
  const cardCount: { [key: string]: number } = {};

  let jokerCount = 0;

  for (const card of hand) {
    if (card === "J" && hasJoker) {
      jokerCount++;
      continue;
    }
    cardCount[card] = (cardCount[card] || 0) + 1;
  }

  const [firstCard, secondCard] = Object.values(cardCount).sort(
    (a, b) => b - a
  );

  if (firstCard + jokerCount === 5) return HandType.FiveOfAKind;
  if (firstCard + jokerCount === 4) return HandType.FourOfAKind;
  if (firstCard + jokerCount + secondCard === 5) return HandType.FullHouse;
  if (firstCard + jokerCount === 3) return HandType.ThreeOfAKind;
  if (firstCard + secondCard === 4) return HandType.TwoPair;
  if (firstCard + jokerCount === 2) return HandType.OnePair;

  return HandType.HighCard;
}

function camelCards(input: string, hasJoker: boolean) {
  console.time("Time spent");

  const hands: Hand[] = input.split("\n").map((hand) => {
    const [cards, bid] = hand.split(" ");
    return {
      cards,
      bid: parseInt(bid),
      handType: getHandType(cards, hasJoker),
    };
  });

  hands.sort((a, b) => {
    const handDifference =
      getHandTypeValue(b.handType) - getHandTypeValue(a.handType);
    if (handDifference !== 0) return handDifference;

    for (let value = 0; value < cardValue.length; value++) {
      const difference =
        getCardValue(b.cards[value], hasJoker) -
        getCardValue(a.cards[value], hasJoker);

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
