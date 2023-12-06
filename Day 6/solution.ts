import fs from "fs";

const input: string = fs
  .readFileSync("day 6/input.txt", "utf-8")
  .replace(/\r\n/g, "\n");

const test: string = fs
  .readFileSync("day 6/test.txt", "utf-8")
  .replace(/\r\n/g, "\n");

function getWinningTimes(input: string, correctKerning: boolean) {
  const startTimestamp = performance.now();
  const splitInput: string[] = input
    .split(/\n|:/)
    .map((input) => input.trim())
    .filter((line) => line.length > 0 && !/[a-zA-Z]/.test(line));

  const newRaces: number[][] = splitInput.map((entry) =>
    entry
      .replace(/\s+/g, correctKerning ? "" : " ")
      .split(" ")
      .map(Number)
  );

  /** Our equation for finding the times is:
   * f(x)=(a-x)*x  - a being the race time
   *
   * If we want to solve for the times that beat the record we do this
   *
   * x=( a+-( sqrt( (a^2) - (4*b+1) ) ) / 2 )
   * b being race record
   */

  let winningTimes: number = 1;

  for (let idx = 0; idx < newRaces[0].length; idx++) {
    const raceTime: number = newRaces[0][idx];
    const raceRecord: number = newRaces[1][idx];
    const limit1: number =
      (raceTime - Math.sqrt(Math.pow(raceTime, 2) - (4 * raceRecord + 1))) / 2;

    const limit2: number =
      (raceTime + Math.sqrt(Math.pow(raceTime, 2) - (4 * raceRecord + 1))) / 2;

    const upperLimit: number = Math.floor(Math.max(limit1, limit2));
    const lowerLimit: number = Math.ceil(Math.min(limit1, limit2));

    const timesWon: number = upperLimit - lowerLimit + 1;

    winningTimes *= timesWon;
  }

  const endTimestamp = performance.now();

  console.log("Time spent:", endTimestamp - startTimestamp);

  return winningTimes;
}

console.log("Part 1:", getWinningTimes(input, false));

console.log("Part 2:", getWinningTimes(input, true));
