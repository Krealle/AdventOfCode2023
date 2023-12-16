import fs from "fs";
import { cloneDeep } from "lodash";

const input: string = fs
  .readFileSync("day 16/input.txt", "utf-8")
  .replace(/\r\n/g, "\n");

const test: string = fs
  .readFileSync("day 16/test.txt", "utf-8")
  .replace(/\r\n/g, "\n");

type Tile = {
  type: string;
  energized: boolean;
};

type Laser = {
  direction: string;
  x: number;
  y: number;
};

function mirrors(input: string) {
  console.time("Time Spent");

  const contraption: Tile[][] = input.split("\n").map((row) =>
    row.split("").map((tile) => {
      return { type: tile, energized: false };
    })
  );

  const colLength = contraption.length;
  const rowLength = contraption[0].length;

  let topMap = contraption;
  let nattyMap = contraption;

  let topEnergized = 0;
  let nattyStartingEnergized = 0;

  const possibleStartingLocations: Laser[] = [];

  contraption.forEach((row, yPos) => {
    row.forEach((_, xPos) => {
      if (yPos === 0) {
        possibleStartingLocations.push({ direction: "S", x: xPos, y: yPos });
      }
      if (yPos === colLength - 1) {
        possibleStartingLocations.push({ direction: "N", x: xPos, y: yPos });
      }
      if (xPos === 0) {
        possibleStartingLocations.push({ direction: "E", x: xPos, y: yPos });
      }
      if (xPos === rowLength - 1) {
        possibleStartingLocations.push({ direction: "W", x: xPos, y: yPos });
      }
    });
  });

  for (const startLocation of possibleStartingLocations) {
    let energizedTiles = 0;
    let tempMap = cloneDeep(contraption);

    const isNatty =
      startLocation.direction === "E" &&
      startLocation.x === 0 &&
      startLocation.y === 0;

    const lasers: Laser[] = [startLocation];
    const previousMoves: { [key: string]: number } = {};

    while (lasers.length) {
      if (tempMap[lasers[0].y][lasers[0].x].type === ".") {
        tempMap[lasers[0].y][lasers[0].x].type =
          lasers[0].direction === "N"
            ? "^"
            : lasers[0].direction === "S"
            ? "V"
            : lasers[0].direction === "W"
            ? "<"
            : ">";
      } else if (
        tempMap[lasers[0].y][lasers[0].x].type === "^" ||
        tempMap[lasers[0].y][lasers[0].x].type === ">" ||
        tempMap[lasers[0].y][lasers[0].x].type === "<" ||
        tempMap[lasers[0].y][lasers[0].x].type === "V"
      ) {
        tempMap[lasers[0].y][lasers[0].x].type = "2";
      }

      if (!tempMap[lasers[0].y][lasers[0].x].energized) {
        tempMap[lasers[0].y][lasers[0].x].energized = true;
        energizedTiles++;
      }

      const potentiallyNewLasers = tileInteraction(
        lasers[0],
        tempMap[lasers[0].y][lasers[0].x]
      );

      lasers[0] = potentiallyNewLasers[0];
      lasers[0] = moveLaser(lasers[0]);

      if (potentiallyNewLasers.length > 1) {
        lasers.push(...potentiallyNewLasers.slice(1));
      }

      const key = lasers[0].direction + "-" + lasers[0].x + "-" + lasers[0].y;
      if (previousMoves[key] === 1) {
        lasers.shift();
        continue;
      }

      if (
        lasers[0].x < 0 ||
        lasers[0].x > rowLength - 1 ||
        lasers[0].y < 0 ||
        lasers[0].y > colLength - 1
      ) {
        lasers.shift();
        continue;
      }

      previousMoves[key] = 1;
    }

    if (isNatty) {
      nattyStartingEnergized = energizedTiles;
      nattyMap = tempMap;
    }
    if (energizedTiles > topEnergized) {
      topEnergized = energizedTiles;
      topMap = tempMap;
    }
  }

  console.log("Natty map");
  topMap.forEach((row) => {
    let rowS = "";
    row.forEach((tile) => {
      rowS += tile.type;
    });
    console.log(rowS);
  });

  console.log("\nTop map");

  topMap.forEach((row) => {
    let rowS = "";
    row.forEach((tile) => {
      rowS += tile.type;
    });
    console.log(rowS);
  });

  console.timeEnd("Time Spent");
  return { nattyStartingEnergized, topEnergized };
}

function moveLaser(laser: Laser): Laser {
  if (laser.direction === "E") {
    laser.x += 1;
  }
  if (laser.direction === "W") {
    laser.x -= 1;
  }
  if (laser.direction === "S") {
    laser.y += 1;
  }
  if (laser.direction === "N") {
    laser.y -= 1;
  }

  return laser;
}

function tileInteraction(laser: Laser, tile: Tile) {
  const potentiallyNewLasers: Laser[] = [laser];

  if (laser.direction === "E") {
    if (tile.type === "|") {
      potentiallyNewLasers.push({
        direction: "N",
        x: laser.x,
        y: laser.y,
      });
      potentiallyNewLasers[0].direction = "S";
    }

    if (tile.type === "\\") {
      potentiallyNewLasers[0].direction = "S";
    }

    if (tile.type === "/") {
      potentiallyNewLasers[0].direction = "N";
    }
  } else if (laser.direction === "W") {
    if (tile.type === "|") {
      potentiallyNewLasers.push({
        direction: "N",
        x: laser.x,
        y: laser.y,
      });
      potentiallyNewLasers[0].direction = "S";
    }

    if (tile.type === "\\") {
      potentiallyNewLasers[0].direction = "N";
    }

    if (tile.type === "/") {
      potentiallyNewLasers[0].direction = "S";
    }
  } else if (laser.direction === "S") {
    if (tile.type === "-") {
      potentiallyNewLasers.push({
        direction: "E",
        x: laser.x,
        y: laser.y,
      });
      potentiallyNewLasers[0].direction = "W";
    }

    if (tile.type === "\\") {
      potentiallyNewLasers[0].direction = "E";
    }

    if (tile.type === "/") {
      potentiallyNewLasers[0].direction = "W";
    }
  } else if (laser.direction === "N") {
    if (tile.type === "-") {
      potentiallyNewLasers.push({
        direction: "E",
        x: laser.x,
        y: laser.y,
      });
      potentiallyNewLasers[0].direction = "W";
    }

    if (tile.type === "\\") {
      potentiallyNewLasers[0].direction = "W";
    }

    if (tile.type === "/") {
      potentiallyNewLasers[0].direction = "E";
    }
  }
  /* console.log("Tile interaction:", tile.type, laser, potentiallyNewLasers); */

  return potentiallyNewLasers;
}

const { nattyStartingEnergized, topEnergized } = mirrors(input);

console.log("Part 1:", nattyStartingEnergized);
console.log("Part 2:", topEnergized);
