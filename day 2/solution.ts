import fs from "fs";

const dataSet: string = fs.readFileSync("day 2/input.txt", "utf-8");

const cubeBag = new Map([
  ["red", 12],
  ["green", 13],
  ["blue", 14],
]);

function possibleCubeGames(games: string): number {
  let result: number = 0;
  const getNumberRegex = /\d+/;

  const gamesArray = games.split("\n");

  for (const game of gamesArray) {
    const gameInfo = game.split(/[:;,]/);

    let gameIsValid = true;

    cubeBag.forEach((max, color) => {
      const colorSets = gameInfo.filter((sets) => sets.includes(color));
      for (const set of colorSets) {
        const maybeCubes = set.match(getNumberRegex);
        const cubes = maybeCubes ? parseInt(maybeCubes[0]) : 0;
        if (cubes > max) {
          gameIsValid = false;
        }
      }
    });

    if (gameIsValid) {
      const gameId = gameInfo[0].match(getNumberRegex);
      if (gameId) {
        result += parseInt(gameId[0]);
      }
    }
  }

  return result;
}

function minimumCubes(games: string): number {
  let result: number = 0;
  const getNumberRegex = /\d+/;

  const gamesArray = games.split("\n");

  for (const game of gamesArray) {
    const gameInfo = game.split(/[:;,]/);
    let minBalls = 0;

    cubeBag.forEach((max, color) => {
      const colorSets = gameInfo.filter((sets) => sets.includes(color));
      let currentMax = 0;
      for (const set of colorSets) {
        const maybeCubes = set.match(getNumberRegex);
        const cubes = maybeCubes ? parseInt(maybeCubes[0]) : 0;
        if (cubes > currentMax) {
          currentMax = cubes;
        }
      }
      if (minBalls === 0) {
        minBalls = currentMax;
      } else {
        minBalls *= currentMax;
      }
    });

    result += minBalls;
  }

  return result;
}

console.log("Part 1:", possibleCubeGames(dataSet));

console.log("Part 2:", minimumCubes(dataSet));
