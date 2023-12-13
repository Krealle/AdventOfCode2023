import fs from "fs";

const input: string = fs
  .readFileSync("day 13/input.txt", "utf-8")
  .replace(/\r\n/g, "\n");

const test: string = fs
  .readFileSync("day 13/test.txt", "utf-8")
  .replace(/\r\n/g, "\n");

function findMirror(input: string) {
  console.time("Time spent");
  const patterns = input.split("\n\n").map((pattern) => pattern.split("\n"));

  /* console.log(patterns); */

  let totVertical: number = 0;
  let totHorizontal: number = 0;

  let totVerticalSmudge: number = 0;
  let totHorizontalSmudge: number = 0;

  patterns.forEach((pattern, iteration) => {
    /* console.log("iteration", iteration); */

    const rows = pattern.length;
    const cols = pattern[0].length;
    const rotatedArr: string[] = Array.from({ length: cols }, () => "");
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        rotatedArr[j] += pattern[i][cols - j - 1];
      }
    }
    const rotatedPattern = rotatedArr.reverse();

    const { smudgeFoundAt: horizontalSmudge, mirrorFoundAt: horizontalMirror } =
      findMirrorInPattern(pattern);

    const { smudgeFoundAt: verticalSmudge, mirrorFoundAt: verticalMirror } =
      findMirrorInPattern(rotatedPattern);

    totHorizontal += horizontalMirror * 100;
    totHorizontalSmudge +=
      horizontalSmudge > 0 ? horizontalSmudge * 100 : horizontalMirror * 100;

    totVertical += verticalMirror;
    totVerticalSmudge += verticalSmudge > 0 ? verticalSmudge : verticalMirror;

    if (horizontalSmudge + verticalSmudge === 0) {
      console.log(
        "Missing all smudges at:",
        iteration,
        ":",
        "HS:",
        horizontalSmudge,
        "VS:",
        verticalSmudge,
        "HM:",
        horizontalMirror,
        "VM:",
        verticalMirror
      );
      console.log(pattern);
      console.log(rotatedPattern);
    }
    if (horizontalSmudge > 0 && verticalSmudge > 0) {
      console.log(
        "Found 2 smudges",
        iteration,
        ":",
        "HS:",
        horizontalSmudge,
        "VS:",
        verticalSmudge,
        "HM:",
        horizontalMirror,
        "VM:",
        verticalMirror
      );
      console.log(pattern);
      console.log(rotatedPattern);
    }
  });

  const tot = totVertical + totHorizontal;
  const totSmudge = totVerticalSmudge + totHorizontalSmudge;

  console.timeEnd("Time spent");

  return { tot, totSmudge };
}

function findMirrorInPattern(pattern: string[]) {
  let lastRow = "";
  const foundMirrors: number[] = [];
  let smudgeFoundAt: number = 0;
  let realSmudge: number = 0;
  const debug = false;
  if (pattern[0] === "##.##..##..#...#." && debug) console.log(pattern);

  pattern.forEach((row, idx) => {
    if (lastRow === row) {
      foundMirrors.push(idx);
      if (pattern[0] === "##.##..##..#...#." && debug) {
        console.log("Found mirror", idx, "amount", foundMirrors.length);
        console.log(lastRow);
        console.log(row);
      }
    }

    if (findSmudge(lastRow, row)) {
      smudgeFoundAt = idx;
      if (pattern[0] === "##.##..##..#...#." && debug) {
        console.log("Found smudge", idx);
        console.log(lastRow);
        console.log(row);
      }
      for (let x = 0; x < pattern.length; x++) {
        const upperRow = pattern[idx - 2 - x];
        const lowerRow = pattern[idx + 1 + x];
        if (!upperRow || !lowerRow) {
          if (pattern[0] === "##.##..##..#...#." && debug) console.log("Break");
          realSmudge = idx;
          break;
        }
        if (upperRow !== lowerRow) {
          if (pattern[0] === "##.##..##..#...#." && debug) console.log("nope");
          smudgeFoundAt = 0;
          break;
        }
      }
    }

    if (foundMirrors.length) {
      for (let j = 0; j < foundMirrors.length; j++) {
        const stepsToBacktrack = (idx - foundMirrors[j]) * 2 + 1;
        if (pattern[0] === "##.##..##..#...#." && debug)
          console.log("Confirming mirror", idx);
        if (
          row !== pattern[idx - stepsToBacktrack] &&
          idx - stepsToBacktrack >= 0
        ) {
          if (
            findSmudge(pattern[idx - stepsToBacktrack], row) &&
            realSmudge === 0
          ) {
            smudgeFoundAt = foundMirrors[j];

            if (pattern[0] === "##.##..##..#...#." && debug)
              console.log("Potential smudge", j);
            for (let x = idx + 1; x < pattern.length; x++) {
              const stepsToBacktrackInner = (x - smudgeFoundAt) * 2 + 1;
              if (pattern[0] === "##.##..##..#...#." && debug)
                console.log("confirming smudge", j);
              if (
                pattern[x] !== pattern[x - stepsToBacktrackInner] &&
                x - stepsToBacktrackInner >= 0
              ) {
                if (pattern[0] === "##.##..##..#...#." && debug)
                  console.log("hmm");
                smudgeFoundAt = 0;
              }
              if (x - stepsToBacktrackInner < 0) {
                if (pattern[0] === "##.##..##..#...#." && debug)
                  console.log("this shit is prolly correct");
                realSmudge = smudgeFoundAt;
                break;
              }
            }
          }

          foundMirrors.splice(j, 1);
        }
      }
    }

    lastRow = row;
  });

  const mirrorFoundAt = foundMirrors[0] || 0;

  return {
    mirrorFoundAt,
    smudgeFoundAt: realSmudge > 0 ? realSmudge : smudgeFoundAt,
  };
}

function findSmudge(s1: string, s2: string) {
  let difference = 0;
  for (let i = 0; i < s1.length; i++) {
    if (s1[i] !== s2[i]) {
      difference++;
    }
  }

  return difference === 1 ? true : false;
}

const { tot, totSmudge } = findMirror(input);

console.log("Part 1:", tot);
console.log("Part 2:", totSmudge);
