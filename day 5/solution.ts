import fs from "fs";

const input: string = fs
  .readFileSync("day 5/input.txt", "utf-8")
  .replace(/\r\n/g, "\n");

const test: string = fs
  .readFileSync("day 5/test.txt", "utf-8")
  .replace(/\r\n/g, "\n");

function findLocation(input: string, countSeedRanges: boolean) {
  console.time("Time spent");
  const sections = input.split("\n\n");
  const seeds = sections[0].split(":")[1].trim().split(" ").map(Number);

  const maps = sections
    .slice(1)
    .map((chunk) => chunk.split(":")[1].trim().split("\n"))
    .map((chunk) =>
      chunk.map((numbers) => {
        const [destinationRange, sourceRange, rangeLength] = numbers
          .split(" ")
          .map(Number);
        return { destinationRange, sourceRange, rangeLength };
      })
    );

  maps.forEach((map) => map.sort((a, b) => a.sourceRange - b.sourceRange));

  let lowestLocation = Number.MAX_SAFE_INTEGER;

  if (countSeedRanges) {
    for (let idx = 0; idx < seeds.length; idx += 2) {
      const baseSeed = seeds[idx];
      const seedRange = seeds[idx + 1];
      console.log(
        "Running:",
        Math.round((idx + 1) / 2) + "/" + seeds.length / 2
      );

      for (let seedNum = baseSeed; seedNum < baseSeed + seedRange; seedNum++) {
        let currentDestination = seedNum;

        for (const map of maps) {
          let low = 0;
          let high = map.length - 1;

          while (low <= high) {
            const mid = Math.floor((low + high) / 2);

            if (currentDestination < map[mid].sourceRange) {
              high = mid - 1;
            } else {
              low = mid + 1;
            }
          }

          const entryIndex = high;

          if (entryIndex >= 0) {
            const entry = map[entryIndex];
            const difference = entry.destinationRange - entry.sourceRange;

            if (
              currentDestination <= entry.sourceRange + entry.rangeLength &&
              currentDestination >= entry.sourceRange
            ) {
              currentDestination += difference;
            }
          }
        }

        if (currentDestination < lowestLocation) {
          lowestLocation = currentDestination;
        }
      }
    }
  } else {
    for (const seedNum of seeds) {
      let currentMapNumber = seedNum;

      for (const map of maps) {
        for (const entry of map) {
          const upperLimit = entry.sourceRange + entry.rangeLength;
          const lowerLimit = entry.sourceRange;
          const difference = entry.destinationRange - entry.sourceRange;

          if (
            currentMapNumber <= upperLimit &&
            currentMapNumber >= lowerLimit
          ) {
            currentMapNumber += difference;
            break;
          }
        }
      }
      if (currentMapNumber < lowestLocation) {
        lowestLocation = currentMapNumber;
      }
    }
  }

  console.timeEnd("Time spent");

  return lowestLocation;
}

console.log("Part 1:", findLocation(input, false));

console.log("Part 2:", findLocation(input, true));
