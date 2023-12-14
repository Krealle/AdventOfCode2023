import fs from "fs";

const input: string = fs
  .readFileSync("day 14/input.txt", "utf-8")
  .replace(/\r\n/g, "\n");

const test: string = fs
  .readFileSync("day 14/test.txt", "utf-8")
  .replace(/\r\n/g, "\n");

function moveRocks(input: string) {
  console.time("Time spent");
  let formation = input.split("\n").map((a) => a.split(""));

  let totLoad = 0;

  const cycles = 1000;
  let iterations = 0;

  while (iterations < cycles) {
    formation = cycleNorth(formation);
    if (iterations === 0) {
      totLoad = getLoad(formation);
    }

    formation = cycleWest(formation);
    formation = cycleSouth(formation);
    formation = cycleEast(formation);

    console.log(getLoad(formation));

    iterations++;

    if (iterations % 100000 === 0) {
      console.log(iterations);
    }
  }

  const cycledTotLoad = getLoad(formation);

  console.timeEnd("Time spent");
  return { totLoad, cycledTotLoad };
}

function getLoad(formation: string[][]) {
  let totLoad = 0;
  const formationLength = formation.length;
  const rowLength = formation[0].length;

  for (let yPos = 0; yPos < formationLength; yPos++) {
    const row = formation[yPos];
    let rocks = 0;

    for (let xPos = 0; xPos < rowLength; xPos++) {
      const curTile = row[xPos];
      if (curTile !== "O") {
        continue;
      }
      rocks++;
    }
    totLoad += rocks * (formationLength - yPos);
  }

  return totLoad;
}

function cycleNorth(formation: string[][]) {
  for (let yPos = 0; yPos < formation.length; yPos++) {
    const row = formation[yPos];

    for (let xPos = 0; xPos < row.length; xPos++) {
      const curTile = row[xPos];
      if (curTile !== "O") {
        continue;
      }

      let adjacentYPos = yPos - 1;

      while (true) {
        if (adjacentYPos < 0 || adjacentYPos > formation.length - 1) {
          break;
        }

        const adjacentTile = formation[adjacentYPos][xPos];

        if (adjacentTile !== ".") {
          break;
        }

        formation[adjacentYPos][xPos] = "O";
        formation[adjacentYPos + 1][xPos] = ".";

        adjacentYPos--;
      }
    }
  }

  return formation;
}

function cycleSouth(formation: string[][]) {
  for (let yPos = formation.length - 1; yPos >= 0; yPos--) {
    const row = formation[yPos];

    for (let xPos = 0; xPos < row.length; xPos++) {
      const curTile = row[xPos];
      if (curTile !== "O") {
        continue;
      }

      let adjacentYPos = yPos + 1;

      while (true) {
        if (adjacentYPos > formation.length - 1) {
          break;
        }

        const adjacentTile = formation[adjacentYPos][xPos];

        if (adjacentTile !== ".") {
          break;
        }

        formation[adjacentYPos][xPos] = "O";
        formation[adjacentYPos - 1][xPos] = ".";

        adjacentYPos++;
      }
    }
  }

  return formation;
}

function cycleWest(formation: string[][]) {
  for (let yPos = 0; yPos < formation.length; yPos++) {
    const row = formation[yPos];

    for (let xPos = 0; xPos < row.length; xPos++) {
      const curTile = row[xPos];
      if (curTile !== "O") {
        continue;
      }

      let adjacentXPos = xPos - 1;

      while (true) {
        if (adjacentXPos < 0) {
          break;
        }

        const adjacentTile = formation[yPos][adjacentXPos];

        if (adjacentTile !== ".") {
          break;
        }

        formation[yPos][adjacentXPos] = "O";
        formation[yPos][adjacentXPos + 1] = ".";

        adjacentXPos--;
      }
    }
  }

  return formation;
}

function cycleEast(formation: string[][]) {
  for (let yPos = 0; yPos < formation.length; yPos++) {
    const row = formation[yPos];

    for (let xPos = row.length - 1; xPos >= 0; xPos--) {
      const curTile = row[xPos];
      if (curTile !== "O") {
        continue;
      }

      let adjacentXPos = xPos + 1;

      while (true) {
        if (adjacentXPos > row.length - 1) {
          break;
        }

        const adjacentTile = formation[yPos][adjacentXPos];

        if (adjacentTile !== ".") {
          break;
        }

        formation[yPos][adjacentXPos] = "O";
        formation[yPos][adjacentXPos - 1] = ".";

        adjacentXPos++;
      }
    }
  }

  return formation;
}

const { totLoad, cycledTotLoad } = moveRocks(input);

console.log("Part 1:", totLoad);
console.log("Part 2:", cycledTotLoad);
