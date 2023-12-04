import fs from "fs";

const schematic: string = fs
  .readFileSync("day 3/input.txt", "utf-8")
  .replace(/\r\n/g, "\n");

type CoordinatesMap = Map<number, number[]>;

type Coordinates = { x: number; y: number };

function findPartNumbers(schematic: string): number {
  let result = 0;

  const schematicLines = schematic.split("\n");

  const symbolCoordinates = findSymbolCoordinates(schematicLines, false);

  schematicLines.forEach((line, y) => {
    let numberString: string = "";
    let hasAdjacentSymbol = false;

    line.split("").forEach((symbol, x) => {
      if (!hasAdjacentSymbol && !isNaN(parseFloat(symbol))) {
        hasAdjacentSymbol = findAdjacentSymbols(x, y, symbolCoordinates);
      }

      if (!isNaN(parseFloat(symbol))) {
        numberString += symbol;
      }

      if (isNaN(parseFloat(symbol)) || x === line.length - 1) {
        if (hasAdjacentSymbol) {
          result += parseInt(numberString);
        }

        numberString = "";
        hasAdjacentSymbol = false;
      }
    });
  });

  return result;
}

function findGearRatios(schematic: string): number {
  let result = 0;

  const gearMap = new Map<string, number>();

  const schematicLines = schematic.split("\n");

  const symbolCoordinates = findSymbolCoordinates(schematicLines, true);

  schematicLines.forEach((line, y) => {
    let numberString: string = "";
    let gearCoords: Coordinates = { x: -1, y: -1 };

    line.split("").forEach((symbol, x) => {
      if (gearCoords.x === -1 && !isNaN(parseFloat(symbol))) {
        gearCoords = findAdjacentGears(x, y, symbolCoordinates);
      }

      if (!isNaN(parseFloat(symbol))) {
        numberString += symbol;
      }

      if (isNaN(parseFloat(symbol)) || x === line.length - 1) {
        if (gearCoords.x !== -1) {
          const key = `${gearCoords.x}-${gearCoords.y}`;
          const currentEntry = gearMap.get(key);
          if (currentEntry) {
            result += currentEntry * parseInt(numberString);
            gearMap.delete(key);
          } else {
            gearMap.set(key, parseInt(numberString));
          }
        }

        numberString = "";
        gearCoords = { x: -1, y: -1 };
      }
    });
  });

  return result;
}

function findAdjacentSymbols(
  x: number,
  y: number,
  symbolCoordinates: CoordinatesMap
): boolean {
  let hasAdjacentSymbol = false;

  for (
    let xCoord = x > 0 ? x - 1 : 0;
    xCoord < x + 2 && !hasAdjacentSymbol;
    xCoord++
  ) {
    const yAxisSymbols = symbolCoordinates.get(xCoord);

    if (!yAxisSymbols) {
      continue;
    }

    for (const symbolYCoord of yAxisSymbols) {
      if (
        symbolYCoord === y ||
        symbolYCoord === y + 1 ||
        symbolYCoord === y - 1
      ) {
        hasAdjacentSymbol = true;
        break;
      }
    }
  }

  return hasAdjacentSymbol;
}

function findAdjacentGears(
  x: number,
  y: number,
  symbolCoordinates: CoordinatesMap
): Coordinates {
  for (let xCoord = x > 0 ? x - 1 : 0; xCoord < x + 2; xCoord++) {
    const yAxisSymbols = symbolCoordinates.get(xCoord);

    if (!yAxisSymbols) {
      continue;
    }

    for (const symbolYCoord of yAxisSymbols) {
      if (
        symbolYCoord === y ||
        symbolYCoord === y + 1 ||
        symbolYCoord === y - 1
      ) {
        return { x: xCoord, y: symbolYCoord };
      }
    }
  }

  return { x: -1, y: -1 };
}

function findSymbolCoordinates(
  schematic: string[],
  onlyGears: boolean
): CoordinatesMap {
  const symbolCoordinates: CoordinatesMap = new Map();

  schematic.forEach((line, y) => {
    line.split("").forEach((symbol, x) => {
      if (
        ((symbol !== "." && !onlyGears) || symbol === "*") &&
        isNaN(parseFloat(symbol))
      ) {
        const currentEntry = symbolCoordinates.get(x);
        if (currentEntry) {
          currentEntry.push(y);
        } else {
          symbolCoordinates.set(x, [y]);
        }
      }
    });
  });

  return symbolCoordinates;
}

console.log("Part 1:", findPartNumbers(schematic));

console.log("Part 2:", findGearRatios(schematic));
