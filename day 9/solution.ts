import fs from "fs";

const input: string = fs
  .readFileSync("day 9/input.txt", "utf-8")
  .replace(/\r\n/g, "\n");

const test: string = fs
  .readFileSync("day 9/test.txt", "utf-8")
  .replace(/\r\n/g, "\n");

function oasis(input: string) {
  console.time("Time spent");
  const histories = input
    .split("\n")
    .map((number) => number.split(" ").flatMap(Number));

  let lastNumbers = 0;
  let firstNumbers = 0;

  for (const history of histories) {
    let nextNumberInHistory = history[history.length - 1];
    let firstNumberInHistory = 0;

    const totDifferencesArray: number[][] = [history];
    let iterations = 0;

    while (true) {
      let differenceSum = 0;
      let lastDiff = 0;

      for (
        let idx = 0;
        idx < totDifferencesArray[iterations].length - 1;
        idx++
      ) {
        const difference =
          totDifferencesArray[iterations][idx + 1] -
          totDifferencesArray[iterations][idx];

        differenceSum += difference;
        lastDiff = difference;

        totDifferencesArray[iterations + 1]
          ? totDifferencesArray[iterations + 1].push(difference)
          : (totDifferencesArray[iterations + 1] = [difference]);
      }

      nextNumberInHistory += lastDiff;

      if (differenceSum === 0) {
        for (let jdx = totDifferencesArray.length - 1; jdx > 0; jdx--) {
          firstNumberInHistory =
            totDifferencesArray[jdx - 1][0] - firstNumberInHistory;
        }

        lastNumbers += nextNumberInHistory;
        firstNumbers += firstNumberInHistory;
        break;
      }

      iterations++;
    }
  }

  console.timeEnd("Time spent");
  return { lastNumbers, firstNumbers };
}

const { lastNumbers, firstNumbers } = oasis(input);
console.log("Part 1:", lastNumbers);
console.log("Part 2:", firstNumbers);
