import fs from "fs";

const input: string = fs
  .readFileSync("day 5/input.txt", "utf-8")
  .replace(/\r\n/g, "\n");

const test: string = fs
  .readFileSync("day 5/test.txt", "utf-8")
  .replace(/\r\n/g, "\n");

type SeedMaps = {
  map: SeedMap[];
};

type SeedMap = {
  upperLimit: number;
  lowerLimit: number;
  difference: number;
};

function findLocation(input: string, countSeedRanges: boolean) {
  const maps = input
    .split(/\n(?!\d)|:/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !/[a-zA-Z]/.test(line));

  /** grab our seed numbers from the array */
  const seedNumbers: number[] = maps.splice(0, 1)[0].split(" ").map(Number);

  let lowestNumber: number = Number.MAX_SAFE_INTEGER;

  const seedMaps: SeedMaps[] = generateSeedMaps(maps);

  if (countSeedRanges) {
    for (let idx = 0; idx < seedNumbers.length; idx += 2) {
      console.log("Checking for ", idx, "Amount is:", seedNumbers[idx + 1]);

      const startTimestamp = performance.now();

      for (
        let seedNum = seedNumbers[idx];
        seedNum < seedNumbers[idx] + seedNumbers[idx + 1];
        seedNum++
      ) {
        const searchValue = getLowestLocation(seedMaps, seedNum);
        if (searchValue === -1) {
          console.log(seedNum);
          return;
        }
        if (searchValue < lowestNumber && searchValue !== -1) {
          lowestNumber = searchValue;
        }
      }

      const endTimestamp = performance.now();

      console.log(
        "Finished for ",
        idx,
        "Time spent:",
        endTimestamp - startTimestamp,
        "Lowest Number is:",
        lowestNumber
      );
    }

    return lowestNumber;
  } else {
    const startTimestamp = performance.now();
    for (const seedNumber of seedNumbers) {
      const searchValue = getLowestLocation(seedMaps, seedNumber);

      if (lowestNumber === 0 || searchValue < lowestNumber) {
        lowestNumber = searchValue;
      }
    }
    const endTimestamp = performance.now();
    console.log(
      "Time spent:",
      endTimestamp - startTimestamp,
      "Lowest Number is:",
      lowestNumber
    );
  }

  return lowestNumber;
}

function generateSeedMaps(maps: string[]): SeedMaps[] {
  const seedMaps: SeedMaps[] = [];

  for (const map of maps) {
    const mapInfo = map.split("\n");
    const seedMap: SeedMap[] = [];
    for (const entry of mapInfo) {
      const entryInfo = entry.split(" ").map(Number);

      seedMap.push({
        upperLimit: entryInfo[1] + entryInfo[2],
        lowerLimit: entryInfo[1],
        difference: entryInfo[0] - entryInfo[1],
      });
    }
    seedMaps.push({ map: seedMap });
  }

  return seedMaps;
}

function getLowestLocation(maps: SeedMaps[], seedNumber: number): number {
  let foundValue = false;
  for (const map of maps) {
    for (const entry of map.map) {
      if (seedNumber <= entry.upperLimit && seedNumber >= entry.lowerLimit) {
        seedNumber += entry.difference;
        foundValue = true;
        break;
      }
    }
  }

  return foundValue ? seedNumber : -1;
}

console.log("Part 1:", findLocation(input, false));

console.log("Part 2:", findLocation(input, true));
