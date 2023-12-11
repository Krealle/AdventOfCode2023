import fs from "fs";

const input: string = fs
  .readFileSync("day 11/input.txt", "utf-8")
  .replace(/\r\n/g, "\n");

const test: string = fs
  .readFileSync("day 11/test.txt", "utf-8")
  .replace(/\r\n/g, "\n");

type Galaxy = { x: number; y: number };

function galaxyPaths(input: string, expansionRate: number) {
  console.time("Time Spent");
  const spaceMap = input.split("\n");

  const emptyRows = new Set<number>();
  let emptyColumns = new Set<number>();

  const galaxies: Galaxy[] = [];

  for (let yPos = 0; yPos < spaceMap.length; yPos++) {
    const row = spaceMap[yPos].split("");
    if (emptyColumns.size === 0) {
      emptyColumns = new Set(
        Array.from({ length: row.length }, (_, index) => index)
      );
    }

    let empty = true;
    for (let xPos = 0; xPos < row.length; xPos++) {
      const char = row[xPos];

      if (char === "#") {
        galaxies.push({ x: xPos, y: yPos });
        empty = false;

        emptyColumns.delete(xPos);
      }
    }

    if (empty) {
      emptyRows.add(yPos);
    }
  }

  let totalTravelTime = 0;

  galaxies.forEach((galaxyStart, idx) => {
    totalTravelTime += galaxies.reduce((acc, galaxyEnd, jdx) => {
      if (idx >= jdx) {
        return acc;
      }

      const endYPad = new Set(
        [...emptyRows].filter((value) => value < galaxyEnd.y)
      );
      const endXPad = new Set(
        [...emptyColumns].filter((value) => value < galaxyEnd.x)
      );

      const startYPad = new Set(
        [...emptyRows].filter((value) => value < galaxyStart.y)
      );
      const startXPad = new Set(
        [...emptyColumns].filter((value) => value < galaxyStart.x)
      );

      const xEndPad = endXPad.size * Math.max(expansionRate - 1, 1);
      const yEndPad = endYPad.size * Math.max(expansionRate - 1, 1);
      const xStartPad = startXPad.size * Math.max(expansionRate - 1, 1);
      const yStartPad = startYPad.size * Math.max(expansionRate - 1, 1);

      const endXPos = galaxyEnd.x + xEndPad;
      const endYPos = galaxyEnd.y + yEndPad;
      const startXPos = galaxyStart.x + xStartPad;
      const startYPos = galaxyStart.y + yStartPad;

      const distance =
        Math.abs(startXPos - endXPos) + Math.abs(startYPos - endYPos);

      return acc + distance;
    }, 0);
  });

  console.timeEnd("Time Spent");
  return totalTravelTime;
}

const smallExpansion = galaxyPaths(input, 1);
const largeExpansion = galaxyPaths(input, 1000000);

console.log("Part 1:", smallExpansion);
console.log("Part 2:", largeExpansion);
