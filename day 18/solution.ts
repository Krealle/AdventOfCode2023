import fs from "fs";
("lodash");

const input: string = fs
  .readFileSync("day 18/input.txt", "utf-8")
  .replace(/\r\n/g, "\n");

const test: string = fs
  .readFileSync("day 18/test.txt", "utf-8")
  .replace(/\r\n/g, "\n");

type DigPlan = {
  direction: string;
  amount: number;
  colorCode: string;
};

type Vertices = { x: number; y: number };

function lavaductLagoon(input: string) {
  console.time("Time Spent");
  const digPlan: DigPlan[] = input.split("\n").map((row) => {
    const [direction, amount, colorCode] = row.split(" ");

    return {
      direction: direction,
      amount: parseInt(amount),
      colorCode: colorCode.replace(/[()]/g, ""),
    };
  });

  const vertices: Vertices[] = [{ x: 0, y: 0 }];
  const hexaVertices: Vertices[] = [{ x: 0, y: 0 }];

  digPlan.forEach((plan, idx) => {
    if (idx === digPlan.length) return;
    const hexD = plan.colorCode.slice(-1);
    const hexaDirection =
      hexD === "0" ? "R" : hexD === "1" ? "D" : hexD === "2" ? "L" : "U";
    const hexAmount = parseInt(plan.colorCode.slice(1, -1), 16);

    const originalHexVert = hexaVertices[hexaVertices.length - 1];
    const newHexVert = {
      x: originalHexVert.x,
      y: originalHexVert.y,
    };
    newHexVert.x +=
      hexaDirection === "R"
        ? hexAmount
        : hexaDirection === "L"
        ? -hexAmount
        : 0;
    newHexVert.y +=
      hexaDirection === "D"
        ? hexAmount
        : hexaDirection === "U"
        ? -hexAmount
        : 0;

    hexaVertices.push(newHexVert);

    const originalVert = vertices[vertices.length - 1];
    const newVert = {
      x: originalVert.x,
      y: originalVert.y,
    };
    newVert.x +=
      plan.direction === "R"
        ? plan.amount
        : plan.direction === "L"
        ? -plan.amount
        : 0;
    newVert.y +=
      plan.direction === "D"
        ? plan.amount
        : plan.direction === "U"
        ? -plan.amount
        : 0;

    vertices.push(newVert);
  });

  const part1 = picksTheorem(vertices);
  const part2 = picksTheorem(hexaVertices);

  console.timeEnd("Time Spent");
  return { part1, part2 };
}

function picksTheorem(vertices: Vertices[]): number {
  let a1 = 0;
  let a2 = 0;
  let outerArea = 0;

  for (let i = 0; i < vertices.length - 1; i++) {
    outerArea +=
      Math.abs(vertices[i].y - vertices[i + 1].y) +
      Math.abs(vertices[i].x - vertices[i + 1].x);

    a1 += vertices[i].y * vertices[i + 1].x;
    a2 += vertices[i].x * vertices[i + 1].y;
  }

  const diff = Math.abs(a1 - a2);
  const shoeLaceArea = 0.5 * diff;
  const area = shoeLaceArea + outerArea / 2 + 1;

  return area;
}

const { part1, part2 } = lavaductLagoon(input);

console.log("Part 1:", part1);
console.log("Part 2:", part2);
