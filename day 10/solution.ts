import fs from "fs";
import cloneDeep from "lodash/cloneDeep";

const input: string = fs
  .readFileSync("day 10/input.txt", "utf-8")
  .replace(/\r\n/g, "\n");

const test: string = fs
  .readFileSync("day 10/test.txt", "utf-8")
  .replace(/\r\n/g, "\n");

const moves = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

type Direction = {
  x: number;
  y: number;
};

const symbolMap = {
  F: "\u250F",
  J: "\u251B",
  L: "\u2517",
  "7": "\u2513",
  "|": "\u2503",
  "-": "\u2501",
};

type MazePoint = {
  type: string;
  possibleSteps: Direction[];
  stepCount: number;
};

const debug = false;

function pipeMaze(input: string) {
  console.time("Time spent");
  let startingPoint = { x: 0, y: 0 };

  const maze = input.split("\n").reduce<string[][]>((acc, row, yPos) => {
    const steps = row.split("").reduce<string[]>((acc, step, xPos) => {
      if (step === "S") startingPoint = { x: xPos, y: yPos };

      acc.push(step);
      return acc;
    }, []);

    acc.push(steps);
    return acc;
  }, []);

  const properMaze = maze.map((row, yPos) => {
    const newRows = row.map((step, xPos) => {
      const possibleSteps: Direction[] = [];

      if (step === ".") return { type: step, possibleSteps: [], stepCount: 0 };
      const above = maze[yPos - 1] ? maze[yPos - 1][xPos] : undefined;
      const below = maze[yPos + 1] ? maze[yPos + 1][xPos] : undefined;
      const left = maze[yPos] ? maze[yPos][xPos - 1] : undefined;
      const right = maze[yPos] ? maze[yPos][xPos + 1] : undefined;

      if (
        above &&
        (above === "|" || above === "F" || above === "7" || above === "S") &&
        (step === "S" || step === "|" || step === "J" || step === "L")
      ) {
        possibleSteps.push(moves.up);
      }
      if (
        below &&
        (below === "|" || below === "J" || below === "L" || below === "S") &&
        (step === "S" || step === "|" || step === "7" || step === "F")
      ) {
        possibleSteps.push(moves.down);
      }
      if (
        left &&
        (left === "F" || left === "-" || left === "L" || left === "S") &&
        (step === "S" || step === "-" || step === "7" || step === "J")
      ) {
        possibleSteps.push(moves.left);
      }
      if (
        right &&
        (right === "7" || right === "-" || right === "J" || right === "S") &&
        (step === "S" || step === "-" || step === "F" || step === "L")
      ) {
        possibleSteps.push(moves.right);
      }

      const symbol =
        step === "F"
          ? symbolMap.F
          : step === "L"
          ? symbolMap.L
          : step === "-"
          ? symbolMap["-"]
          : step === "J"
          ? symbolMap.J
          : step === "7"
          ? symbolMap["7"]
          : step === "|"
          ? symbolMap["|"]
          : step;

      return { type: symbol, possibleSteps, stepCount: 0 };
    });
    return newRows;
  });

  //console.log(properMaze);

  let maxSteps = 0;
  let stepsTaken = 0;

  let iterations = 0;

  let possibleSteps =
    properMaze[startingPoint.y][startingPoint.x].possibleSteps.length;

  console.log("Possible steps on start:", possibleSteps);

  let curPos = startingPoint;

  let bends: MazePoint[] = [];

  let tempMap = cloneDeep(properMaze);

  let curStep = tempMap[curPos.y][curPos.x];
  let lastPos = curPos;

  let startStep = properMaze[curPos.y][curPos.x];

  let totEncasedTiles = 0;

  while (possibleSteps > 0) {
    debug && console.log("");
    iterations++;

    let direction = curStep.possibleSteps.shift();

    debug && console.log("starting pos:", curPos);

    if (!direction) {
      const backTrack = bends.pop();

      if (!backTrack) {
        console.log("No more possible steps.");
        possibleSteps = 0;
        break;
      }

      debug && console.log("Backtracking to ", backTrack);
      curStep = backTrack;
      if (curStep.type === "S") {
        debug &&
          console.log("Reached S whilst backtracking, properly dead end.");
        stepsTaken = 0;

        lastPos = startingPoint;
        curPos = startingPoint;

        startStep = curStep;
        bends = [];
        tempMap = cloneDeep(properMaze);
        possibleSteps--;
        continue;
      }
      stepsTaken = curStep.stepCount;
      continue;
    }

    debug && console.log("direction", direction);

    if (
      lastPos.x === curPos.x + direction.x &&
      lastPos.y === curPos.y + direction.y
    ) {
      debug && console.log("This step is backwards, go next.");
      debug &&
        console.log(
          "lastpos",
          lastPos,
          "curPos",
          curPos,
          "direction",
          direction
        );
      continue;
    }

    if (curStep.possibleSteps.length > 0) {
      bends.push(curStep);
      debug && console.log("Bending at", curStep);
    }

    lastPos = curPos;
    curPos = { x: curPos.x + direction.x, y: curPos.y + direction.y };

    stepsTaken++;

    tempMap[curPos.y][curPos.x].stepCount = stepsTaken;

    curStep = tempMap[curPos.y][curPos.x];

    debug && console.log("Moved to ", curStep);
    debug && console.log("end pos:", curPos);

    if (curStep.type === "S") {
      debug && console.log("Reached end of loop.");
      if (stepsTaken > maxSteps) maxSteps = stepsTaken;

      lastPos = startingPoint;
      curStep = startStep;
      stepsTaken = 0;

      debug && console.log("True start point", curStep);

      const { visualPath, encasedTiles } = printPath(tempMap);
      totEncasedTiles = encasedTiles;

      debug && console.log(visualPath);

      bends = [];
      tempMap = cloneDeep(properMaze);
      possibleSteps--;
    }
  }

  console.timeEnd("Time spent");

  const longestDistance = Math.floor(maxSteps / 2);

  return { longestDistance, totEncasedTiles };
}

function printPath(maze: MazePoint[][]) {
  let encasedTiles = 0;

  const visualPath: string = maze.reduce<string>((acc, row, yPos) => {
    let inBounds = false;

    const newRow = row.reduce((acc, char, xPos) => {
      if (char.stepCount > 0) {
        const belowField =
          yPos < maze.length - 1 ? maze[yPos + 1][xPos] : undefined;

        if (!belowField) {
          inBounds = false;
          return acc + char.type;
        }

        const difference = char.stepCount - belowField.stepCount;

        if (!inBounds && difference === -1) {
          inBounds = true;
        }

        if (inBounds && difference === 1) {
          inBounds = false;
        }

        return acc + char.type;
      } else {
        if (inBounds) {
          encasedTiles++;
          return (acc += "I");
        }
        return (acc += "O");
      }
    }, "");
    return (acc += newRow + "\n");
  }, "");

  return { visualPath, encasedTiles };
}

const { longestDistance, totEncasedTiles } = pipeMaze(input);

console.log("Part 1:", longestDistance);

console.log("Part 2:", totEncasedTiles);
