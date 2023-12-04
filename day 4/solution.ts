import fs from "fs";

const scratchCards: string = fs.readFileSync("day 4/input.txt", "utf-8");

function generateScratchCardSets(scratchCards: string): Set<number>[][] {
  const sortedScratchCards = scratchCards.split("\n").map((card) => {
    const sides = card.split(":")[1].split("|");
    const set1 = new Set(
      sides[0].trim().replace(/\s+/g, " ").split(" ").map(Number)
    );
    const set2 = new Set(
      sides[1].trim().replace(/\s+/g, " ").split(" ").map(Number)
    );

    return [set1, set2];
  });

  return sortedScratchCards;
}

function getWinningPoints(scratchCards: string): number {
  let result = 0;

  const sortedScratchCards = generateScratchCardSets(scratchCards);

  sortedScratchCards.forEach((card) => {
    let cardPoints = 0;
    let amountOfPoints = 0;
    for (const number of card[0]) {
      if (card[1].has(number)) {
        amountOfPoints++;

        cardPoints = cardPoints === 0 ? 1 : cardPoints * 2;
      }
    }
    result += cardPoints;
  });

  return result;
}

function getTotalCards(scratchCards: string): number {
  let totalCards = 0;

  const sortedScratchCards = generateScratchCardSets(scratchCards);

  const cardsToFabricate = new Map<number, number>();

  sortedScratchCards.forEach((card, idx) => {
    const currentCardAmount = 1 + (cardsToFabricate.get(idx) ?? 0);
    let winningNumbers = 0;

    for (const number of card[0]) {
      if (card[1].has(number)) {
        winningNumbers++;
      }
    }

    totalCards += currentCardAmount;

    for (
      let cardIndex = idx + 1;
      cardIndex < idx + winningNumbers + 1;
      cardIndex++
    ) {
      const currentAmountToFabricate = cardsToFabricate.get(cardIndex);
      if (currentAmountToFabricate) {
        cardsToFabricate.set(
          cardIndex,
          currentAmountToFabricate + currentCardAmount
        );
      } else {
        cardsToFabricate.set(cardIndex, currentCardAmount);
      }
    }
  });

  return totalCards;
}

console.log("Part 1:", getWinningPoints(scratchCards));

console.log("Part 2:", getTotalCards(scratchCards));
