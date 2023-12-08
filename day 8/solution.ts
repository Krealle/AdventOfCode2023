import fs from "fs";

const input: string = fs
  .readFileSync("day 8/input.txt", "utf-8")
  .replace(/\r\n/g, "\n");

const test: string = fs
  .readFileSync("day 8/test.txt", "utf-8")
  .replace(/\r\n/g, "\n");

type MapInfo = {
  location: string;
  left: string;
  right: string;
};

type Location = {
  [location: string]: MapInfo;
};

function readMap(input: string) {
  console.time("Time spent");
  const chunks = input.split("\n");
  const directions = chunks.splice(0, 1)[0].split("");

  const ghostLocations: MapInfo[] = [];

  const map: Location = chunks
    .filter((chunk) => chunk.length)
    .reduce<Record<string, MapInfo>>((acc, chunk) => {
      const [location, directions] = chunk.split("=");
      const [left, right] = directions.replace(/\(|\)/g, "").split(",");

      const trimmedLocation = location.trim();

      acc[trimmedLocation] = {
        location: trimmedLocation,
        left: left.trim(),
        right: right.trim(),
      };

      if (trimmedLocation[trimmedLocation.length - 1] === "A") {
        ghostLocations.push(acc[trimmedLocation]);
      }

      return acc;
    }, {});

  let currentLocation = map["AAA"];
  const finalLocation = map["ZZZ"];

  let stepsTaken = 0;
  let ghostStepsTaken = 0;
  const ghostSteps: number[] = [];

  let camelArrived = false;

  while (ghostSteps.length < ghostLocations.length || !camelArrived) {
    for (const direction of directions) {
      if (ghostLocations.length > 0) {
        ghostStepsTaken++;

        for (let idx = 0; idx < ghostLocations.length; idx++) {
          const curGhostLocation = ghostLocations[idx];
          if (curGhostLocation.location.endsWith("Z")) {
            continue;
          }

          const ghostStep =
            direction === "R" ? curGhostLocation.right : curGhostLocation.left;

          if (ghostStep.endsWith("Z")) {
            ghostSteps.push(ghostStepsTaken);
          }
          ghostLocations[idx] = map[ghostStep];
        }
      }

      if (!camelArrived) {
        const step =
          direction === "R" ? currentLocation.right : currentLocation.left;

        if (currentLocation.location === finalLocation.location) {
          camelArrived = true;
        } else {
          currentLocation = map[step];
          stepsTaken++;
        }
      }
    }
  }

  const lcm = findLCM(ghostSteps);

  console.timeEnd("Time spent");
  return { stepsTaken, lcm };
}

function findLCM(cycleLengths: number[]): number {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

  const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);

  return cycleLengths.reduce((acc, cycleLength) => lcm(acc, cycleLength), 1);
}

const { stepsTaken, lcm } = readMap(input);
console.log("Part 1:", stepsTaken);
console.log("Part 2:", lcm);
