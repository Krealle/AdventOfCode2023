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

  let tot = 0;
  let totSmudge = 0;

  for (const pattern of patterns) {
    const res = findMirrorInPattern(pattern);
    tot += res.mirrorLocation * 100;
    totSmudge += res.smudgeLocation * 100;

    const rotatedPattern = turnArray(pattern);
    const res2 = findMirrorInPattern(rotatedPattern);

    tot += res2.mirrorLocation;
    totSmudge += res2.smudgeLocation;
  }

  console.timeEnd("Time spent");
  return { tot, totSmudge };
}

function turnArray(arr: string[]) {
  const rows = arr.length;
  const cols = arr[0].length;
  const rotatedArr: string[] = Array.from({ length: cols }, () => "");
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      rotatedArr[j] += arr[i][cols - j - 1];
    }
  }
  return rotatedArr.reverse();
}

function findMirrorInPattern(pattern: string[]) {
  let smudgeLocation = 0;
  let mirrorLocation = 0;

  for (let r = 1; r < pattern.length; r++) {
    let above = pattern.slice(0, r).reverse();
    let below = pattern.slice(r);
    let diff = 0;

    above = above.slice(0, below.length);
    below = below.slice(0, above.length);

    if (smudgeLocation === 0) {
      for (let i = 0; i < above.length; i++) {
        diff += findSmudge(above[i], below[i]);
      }

      if (diff === 1) {
        smudgeLocation = r;
      }
    }

    if (smudgeLocation > 0 && mirrorLocation > 0) break;
    if (mirrorLocation > 0) {
      continue;
    }

    if (above.every((value, index) => value === below[index])) {
      mirrorLocation = r;
    }
  }

  return { mirrorLocation, smudgeLocation };
}

function findSmudge(s1: string, s2: string) {
  let difference = 0;
  for (let i = 0; i < s1.length; i++) {
    if (s1[i] !== s2[i]) {
      difference++;
    }
  }

  return difference;
}

const { tot, totSmudge } = findMirror(input);

console.log("Part 1:", tot);
console.log("Part 2:", totSmudge);
