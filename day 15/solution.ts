import fs from "fs";

const input: string = fs
  .readFileSync("day 15/input.txt", "utf-8")
  .replace(/\r\n/g, "\n");

const test: string = fs
  .readFileSync("day 15/test.txt", "utf-8")
  .replace(/\r\n/g, "\n");

type Operation = {
  label: string;
  type: string;
  focalLength: number;
};

function hashDecoder(input: string) {
  console.time("Time spent");
  const operations = input.split(",");

  let totSum = 0;

  const boxes = new Map<number, Operation[]>();

  operations.forEach((operation) => {
    let sum = 0;
    let labelSum = 0;

    const splitOperation = operation.split(/([-=])/);
    const label = splitOperation[0];
    const op = splitOperation[1];
    const focalLength = Number(splitOperation[2]);

    for (let i = 0; i < operation.length; i++) {
      const char = operation[i];
      sum += char.charCodeAt(0);
      sum *= 17;
      sum %= 256;

      if (i === label.length - 1) {
        labelSum = sum;
      }
    }

    const box: Operation[] | undefined = boxes.get(labelSum);
    const newOperation: Operation = {
      label: label,
      type: op,
      focalLength: focalLength,
    };

    if (box) {
      const index = box.findIndex((boxOp) => boxOp.label === label);

      if (op === "=") {
        if (index === -1) {
          box.push(newOperation);
        } else {
          box[index] = newOperation;
        }
      } else {
        if (index !== -1) {
          box.splice(index, 1);
        }
      }
    } else {
      if (op === "=") {
        boxes.set(labelSum, [newOperation]);
      }
    }

    totSum += sum;
  });

  let boxSum = 0;

  boxes.forEach((box, boxNumber) => {
    boxSum += box.reduce((acc, operation, slot) => {
      return (acc += (1 + boxNumber) * (1 + slot) * operation.focalLength);
    }, 0);
  });

  console.timeEnd("Time spent");
  return { totSum, boxSum };
}

const { totSum, boxSum } = hashDecoder(input);
console.log("Part 1:", totSum);
console.log("Part 2:", boxSum);
