import fs from "fs";

const lines: string = fs.readFileSync("day 1/input.txt", "utf-8");

const AcceptedNumbers = new Map([
  ["one", "1"],
  ["two", "2"],
  ["three", "3"],
  ["four", "4"],
  ["five", "5"],
  ["six", "6"],
  ["seven", "7"],
  ["eight", "8"],
  ["nine", "9"],
]);

const maxStringNumberLength = 5;

function findSum(lines: string, getStringNumber: boolean): number {
  let result = 0;

  const lineArray = lines.split("\n");

  for (const line of lineArray) {
    if (line.length === 0) {
      continue;
    }

    let firstNumber: string = "";
    let secondNumber: string = "";
    let numberString: string = "";

    for (let idx = 0; idx < line.length; idx++) {
      const char = line[idx];
      numberString = char;

      const maybeNumber = parseFloat(char);

      if (isNaN(maybeNumber) && getStringNumber) {
        for (let jdx = idx + 1; jdx < line.length; jdx++) {
          const innerChar = line[jdx];
          const innerMaybeNumber = parseFloat(innerChar);

          if (!isNaN(innerMaybeNumber)) {
            numberString = "";
            break;
          }

          numberString += innerChar;

          if (numberString.length > maxStringNumberLength) {
            numberString = "";
            break;
          }

          if (AcceptedNumbers.has(numberString)) {
            break;
          }
        }
      }

      const maybeStringNumber = AcceptedNumbers.get(numberString);

      if (!isNaN(maybeNumber) || maybeStringNumber) {
        if (firstNumber.length === 0) {
          firstNumber = maybeStringNumber ? maybeStringNumber : char;
        } else {
          secondNumber = maybeStringNumber ? maybeStringNumber : char;
        }
        numberString = "";
      }
    }

    if (secondNumber.length === 0) {
      secondNumber = firstNumber;
    }
    const newNumber = Number(firstNumber + secondNumber);

    result += newNumber;
  }

  return result;
}

console.log("Part 1:", findSum(lines, false));

console.log("Part 2:", findSum(lines, true));
