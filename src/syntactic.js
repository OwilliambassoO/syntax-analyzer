const { keyWords, operators, conditionals } = require("./consts/types.js");
const {
  isValidNumber,
  isValidBoolean,
  isValidString,
} = require("./utils/validators.js");

const syntactic = (data) => {
  let nextIdx = 0;

  for (const token of data) {
    nextIdx++;

    if (token.type === "KEYWORD") {
      const keyWordProps = keyWords.find(
        (keyWord) => keyWord.name === token.name
      );

      if (keyWordProps.conditional === true) {
        const conditional = [];

        if (data[nextIdx].name !== "(") {
          console.log(
            "\x1b[31m%s\x1b[0m",
            `error in ${token.name}, '(' not found`
          );
          process.exit();
        }

        let currentIdx = nextIdx + 1;

        for (currentIdx; data[currentIdx]?.name !== ")"; currentIdx++) {
          if (
            currentIdx === data.length ||
            (data[currentIdx]?.type === "DELIMITER" &&
              data[currentIdx]?.name !== ")")
          ) {
            console.log(
              "\x1b[31m%s\x1b[0m",
              `error in ${token.name}, ')' not found`
            );
            process.exit();
          }
          conditional.push(data[currentIdx]);
        }

        if (!conditional[0]) {
          console.log(
            "\x1b[31m%s\x1b[0m",
            `error in ${token.name}, you need a conditional`
          );
          process.exit();
        }

        let currentCondIdx = 0;

        for (const currentCond of conditional) {
          if (
            (currentCond.type === "OPERATOR" ||
              currentCond.type === "CONDITIONAL") &&
            (conditional[currentCondIdx - 1] === undefined ||
              conditional[currentCondIdx + 1] === undefined)
          ) {
            if (currentCond.name !== "+" && currentCond.name !== "-") {
              console.log(
                "\x1b[31m%s\x1b[0m",
                `error in ${token.name} conditional, Unexpected token ${currentCond.name}`
              );
              process.exit();
            }
          }
          if (
            (currentCond.name === "+" || currentCond.name === "-") &&
            conditional[currentCondIdx + 1] === undefined
          ) {
            console.log(
              "\x1b[31m%s\x1b[0m",
              `error in ${token.name} conditional, Unexpected token ${currentCond.name}`
            );
            process.exit();
          }
          if (currentCond.type === "KEYWORD") {
            const condProps = keyWords.find(
              (keyWord) => keyWord.name === currentCond.name
            );

            if (
              condProps.conditional === true ||
              condProps.hasDelimiter === true ||
              condProps.name === "return"
            ) {
              console.log(
                "\x1b[31m%s\x1b[0m",
                `error in ${token.name} conditional, Unexpected token ${currentCond.name}`
              );
              process.exit();
            }
          }
          if (currentCond.type === "ID") {
            if (
              conditional[currentCondIdx + 1]?.type === "ID" ||
              conditional[currentCondIdx + 1]?.type === "LITERAL"
            ) {
              console.log(
                "\x1b[31m%s\x1b[0m",
                `error in ${token.name} conditional, Unexpected token ${
                  conditional[currentCondIdx + 1].name
                }`
              );
              process.exit();
            }
            if (conditional[currentCondIdx - 1] === undefined) {
              const hasCondId = [];
              let searchId = currentIdx;

              for (searchId; searchId > 0; searchId--) {
                if (
                  data[searchId].name === currentCond.name &&
                  data[searchId - 1].type === "KEYWORD"
                ) {
                  hasCondId.push(searchId);
                }
              }

              if (!hasCondId[0]) {
                console.log(
                  "\x1b[31m%s\x1b[0m",
                  `error in ${token.name} conditional, ${currentCond.name} is not defined yet`
                );
                process.exit();
              }
            }
            if (conditional[currentCondIdx - 1] !== undefined) {
              if (
                conditional[currentCondIdx - 1].type === "KEYWORD" &&
                (conditional[currentCondIdx + 1].name !== "=" ||
                  conditional[currentCondIdx + 2].type !== "LITERAL")
              ) {
                console.log(
                  "\x1b[31m%s\x1b[0m",
                  `error in ${token.name} conditional, Unexpected token ${
                    conditional[currentCondIdx - 1].name
                  }`
                );
                process.exit();
              }
            }
          }
          if (currentCond.type === "LITERAL") {
            if (
              conditional[currentCondIdx - 1] === undefined &&
              conditional[currentCondIdx + 1] === undefined &&
              (isValidNumber(conditional[currentCondIdx].name) ||
                isValidBoolean(conditional[currentCondIdx].name))
            ) {
              console.log(
                "\x1b[31m%s\x1b[0m",
                `error in ${token.name} conditional, expect a conditional, but received ${conditional[currentCondIdx].name}`
              );
              process.exit();
            }
            if (conditional[currentCondIdx - 1] === undefined) {
              if (
                !["+", "==", "!=", "===", "!=="].includes(
                  conditional[currentCondIdx + 1].name
                ) &&
                (operators.includes(conditional[currentCondIdx + 1].name) ||
                  conditionals.includes(conditional[currentCondIdx + 1].name))
              ) {
                if (
                  !isValidNumber(conditional[currentCondIdx].name) &&
                  !isValidNumber(conditional[currentCondIdx + 2])
                ) {
                  console.log(
                    "\x1b[31m%s\x1b[0m",
                    `error in ${token.name} conditional, Unexpected token ${
                      conditional[currentCondIdx + 1].name
                    }`
                  );
                  process.exit();
                }
              }
            }
            if (
              conditional[currentCondIdx - 1]?.type === "LITERAL" ||
              conditional[currentCondIdx + 1]?.type === "LITERAL"
            ) {
              console.log(
                "\x1b[31m%s\x1b[0m",
                `error in ${token.name} conditional, Unexpected token ${currentCond.name}`
              );
              process.exit();
            }
          }
          currentCondIdx++;
        }
      }
    }
  }

  return console.log("\x1b[32m%s\x1b[0m", "Success: Valid Syntax");
};

module.exports = { syntactic };
