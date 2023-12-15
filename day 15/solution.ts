import fs from "fs";

const input: string = fs
  .readFileSync("day 15/input.txt", "utf-8")
  .replace(/\r\n/g, "\n");

const test: string = fs
  .readFileSync("day 15/test.txt", "utf-8")
  .replace(/\r\n/g, "\n");

function hashDecoder(input: string) {
  console.time("Time spent");
  const steps = input.split(",");

  let totSum: number = 0;

  const boxes = new Map<number, string[]>();

  steps.forEach((operation) => {
    let sum = 0;
    let labelSum = 0;

    const label = operation.split(/([-=])/);

    for (let i = 0; i < operation.length; i++) {
      const char = operation[i];
      sum += char.charCodeAt(0);
      sum *= 17;
      sum %= 256;

      if (i > label[0].length - 1) {
        continue;
      }
      const labelChar = label[0][i];
      labelSum += labelChar.charCodeAt(0);
      labelSum *= 17;
      labelSum %= 256;
    }

    const box = boxes.get(labelSum);
    if (box) {
      const index = box.findIndex((op) => op.slice(0, -1) === label[0]);

      if (label[1] === "=") {
        if (index === -1) {
          box.push(label[0] + label[2]);
        } else {
          box[index] = label[0] + label[2];
        }
      } else {
        if (index !== -1) {
          box.splice(index, 1);
        }
      }
    } else {
      if (label[1] === "=") {
        boxes.set(labelSum, [label[0] + label[2]]);
      }
    }

    totSum += sum;
  });

  let boxSum = 0;

  boxes.forEach((box, boxNumber) => {
    boxSum += box.reduce((acc, operation, slot) => {
      const focalLength = Number(operation[operation.length - 1]);

      return (acc += (1 + boxNumber) * (1 + slot) * focalLength);
    }, 0);
  });

  console.timeEnd("Time spent");
  return { totSum, boxSum };
}

const { totSum, boxSum } = hashDecoder(input);
console.log("Part 1:", totSum);
console.log("Part 2:", boxSum);
