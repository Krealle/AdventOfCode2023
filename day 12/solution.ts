import fs from "fs";

const input: string = fs
  .readFileSync("day 12/input.txt", "utf-8")
  .replace(/\r\n/g, "\n");

const test: string = fs
  .readFileSync("day 12/test.txt", "utf-8")
  .replace(/\r\n/g, "\n");

type Record = {
  springs: string[];
  conditions: number[];
};

function damageGears(input: string) {
  console.time("Time spent");

  const map = input.split("\n");

  const records: Record[] = map.map((record) => {
    const [r1, r2] = record.split(" ");

    const conditions = r2.split(",").map(Number);
    const springs = r1.split("");

    return { springs, conditions };
  });

  let tot = 0;
  let unFoldedTot = 0;

  const iterations = records.length;
  let curIteration = 1;
  for (const record of records) {
    console.time("Iteration");

    const arr = findArrangements(record.springs, record.conditions);

    const unFoldedSprings = Array(5)
      .fill([...record.springs, "?"])
      .flat()
      .slice(0, -1);

    const unFoldedConditions = Array(5)
      .fill([...record.conditions])
      .flat();

    const arr2 = findArrangements(unFoldedSprings, unFoldedConditions);
    console.log("Iteration:", curIteration + "/" + iterations, arr2);
    unFoldedTot += arr2;
    curIteration++;

    tot += arr;
    console.timeEnd("Iteration");
  }

  console.timeEnd("Time spent");
  return { tot, unFoldedTot };
}

function generateKey(springs: string[], conditions: number[]): string {
  return springs.join("") + "-" + conditions.join("");
}

const CACHE: Map<string, number> = new Map();
function findArrangements(springs: string[], conditions: number[]): number {
  if (!springs.length) {
    return conditions.length ? 0 : 1;
  }

  if (!conditions.length) {
    return springs.includes("#") ? 0 : 1;
  }

  if (conditions[0] + conditions.length - 1 > springs.length) return 0;

  const key = generateKey(springs, conditions);

  if (CACHE.has(key)) {
    return CACHE.get(key)!;
  }

  let result = 0;

  const ch = springs[0];
  if (ch === "?" || ch === ".") {
    result += findArrangements(springs.slice(1), conditions);
  }

  const c1 = conditions[0];
  if (ch === "#" || ch === "?") {
    if (
      conditions[0] <= springs.length &&
      !springs.slice(0, c1).includes(".") &&
      (c1 === springs.length || springs[c1] !== "#")
    ) {
      result += findArrangements(springs.slice(c1 + 1), conditions.slice(1));
    }
  }

  CACHE.set(key, result);

  return result;
}

const { tot, unFoldedTot } = damageGears(input);

console.log("Part 1:", tot);

console.log("Part 2:", unFoldedTot);
