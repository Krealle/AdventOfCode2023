import fs from "fs";
import { cloneDeep } from "lodash";

const input: string = fs
  .readFileSync("day 19/input.txt", "utf-8")
  .replace(/\r\n/g, "\n");

const test: string = fs
  .readFileSync("day 19/test.txt", "utf-8")
  .replace(/\r\n/g, "\n");

type Workflow = {
  name: string;
  rules: Rule[];
  fallback: string;
};

type Rule = {
  input: "x" | "m" | "a" | "s";
  condition: string;
  targetValue: number;
  route: string;
};

type Part = {
  ratings: {
    part: string;
    value: number;
  }[];
};

type Permutations = {
  x: {
    start: number;
    end: number;
  };
  m: {
    start: number;
    end: number;
  };
  a: {
    start: number;
    end: number;
  };
  s: {
    start: number;
    end: number;
  };
};

function aplenty(input: string) {
  const [ws, par] = input.split("\n\n");

  const workflows: Workflow[] = ws.split("\n").map((curFlow) => {
    const [name, flow] = curFlow.replace(/[{}]/g, " ").trimEnd().split(" ");
    const newFlow = flow.split(",");
    const fallback = newFlow.splice(-1);

    const rules: Rule[] = newFlow.map((e) => {
      const condition = e[1];
      const [input, targetValue, route] = e.split(/[<>:]/g);
      return {
        input: input as "x" | "m" | "a" | "s",
        condition: condition,
        targetValue: parseInt(targetValue),
        route: route,
      };
    });
    return {
      name,
      rules,
      fallback: fallback[0],
    };
  });

  const parts: Part[] = par.split("\n").map((curPart) => {
    const ratings = curPart
      .replace(/[{}]/g, "")
      .split(",")
      .map((e) => {
        const [part, value] = e.split("=");
        return {
          part,
          value: parseInt(value),
        };
      });
    return { ratings };
  });

  let part1 = 0;
  parts.forEach((part) => {
    const accepted = verifyFlow(part, workflows, "in");
    if (!accepted) return;

    part1 += part.ratings.reduce((acc, part) => {
      acc += part.value;
      return acc;
    }, 0);
  });

  const permutations: Permutations = {
    x: {
      start: 1,
      end: 4000,
    },
    m: {
      start: 1,
      end: 4000,
    },
    a: {
      start: 1,
      end: 4000,
    },
    s: {
      start: 1,
      end: 4000,
    },
  };

  const part2 = findCombinations(permutations, workflows, "in");

  return { part1, part2 };
}

function verifyFlow(
  part: Part,
  workflows: Workflow[],
  curRule: string
): boolean {
  const curWorkflow = workflows.find((wf) => wf.name === curRule)!;
  const ratings = part.ratings;

  for (let idx = 0; idx < curWorkflow.rules.length; idx++) {
    const rule = curWorkflow.rules[idx];
    const par = ratings.find((p) => p.part === rule.input)!;

    let route =
      (rule.condition === ">" && par.value > rule.targetValue) ||
      (rule.condition === "<" && par.value < rule.targetValue)
        ? rule.route
        : undefined;

    if (!route && idx === curWorkflow.rules.length - 1)
      route = curWorkflow.fallback;
    if (route === "A") return true;
    if (route === "R") return false;
    if (!route && idx < curWorkflow.rules.length - 1) continue;

    return verifyFlow(part, workflows, route ?? curWorkflow.fallback);
  }

  console.error("hmm");
  return false;
}

function findCombinations(
  permutations: Permutations,
  workflows: Workflow[],
  curRoute: string
): number {
  const curWorkflow = workflows.find((wf) => wf.name === curRoute)!;
  let possiblePermutations = 0;

  for (let i = 0; i < curWorkflow.rules.length; i++) {
    const rule = curWorkflow.rules[i];

    const isGreater = rule.condition === ">" ? true : false;
    const newPermutations = cloneDeep(permutations);
    const newRoute = rule.route;
    if (isGreater) {
      newPermutations[rule.input].start = rule.targetValue + 1;
      permutations[rule.input].end = rule.targetValue;
    } else {
      newPermutations[rule.input].end = rule.targetValue - 1;
      permutations[rule.input].start = rule.targetValue;
    }

    if (newRoute === "A") {
      const value =
        (newPermutations.a.end - newPermutations.a.start + 1) *
        (newPermutations.x.end - newPermutations.x.start + 1) *
        (newPermutations.s.end - newPermutations.s.start + 1) *
        (newPermutations.m.end - newPermutations.m.start + 1);
      possiblePermutations += value;
    } else if (newRoute !== "R") {
      possiblePermutations += findCombinations(
        newPermutations,
        workflows,
        newRoute
      );
    }
  }

  if (curWorkflow.fallback === "A") {
    const value =
      (permutations.a.end - permutations.a.start + 1) *
      (permutations.x.end - permutations.x.start + 1) *
      (permutations.s.end - permutations.s.start + 1) *
      (permutations.m.end - permutations.m.start + 1);
    possiblePermutations += value;
  } else if (curWorkflow.fallback !== "R") {
    possiblePermutations += findCombinations(
      permutations,
      workflows,
      curWorkflow.fallback
    );
  }

  return possiblePermutations;
}

const { part1, part2 } = aplenty(input);

console.log("Part 1:", part1);
console.log("Part 2:", part2);
