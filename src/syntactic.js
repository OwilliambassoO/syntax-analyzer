const {
  keyWords,
  operators,
  conditionals,
  reservedDeclarations,
  endOfDeclaration,
} = require("./consts/types.js");
const { isValidNumber, isValidBoolean } = require("./utils/validators.js");

const syntactic = (data) => {
  let nextIdx = 0;

  for (const token of data) {
    nextIdx++;

    if (token.type === "KEYWORD") {
      const keyWordProps = keyWords.find(
        (keyWord) => keyWord.name === token.name
      );

      if (keyWordProps.conditional === false) {
        const declarations = [];

        if (
          reservedDeclarations.includes(token.name) &&
          data[nextIdx].type !== "ID"
        ) {
          console.log(
            "\x1b[31m%s\x1b[0m",
            `error in ${token.name}, Unexpected token ${data[nextIdx].name}`
          );
          process.exit();
        }

        if (
          reservedDeclarations.includes(token.name) &&
          !endOfDeclaration.includes(data[nextIdx + 1].name)
        ) {
          console.log(
            "\x1b[31m%s\x1b[0m",
            `error in ${data[nextIdx].name}, Unexpected token ${
              data[nextIdx + 1].name
            }`
          );
          process.exit();
        }

        if (
          reservedDeclarations.includes(token.name) &&
          data[nextIdx + 1].name === ","
        ) {
          let currentIdx = nextIdx + 2;

          if (data[currentIdx]?.type !== "ID") {
            console.log(
              "\x1b[31m%s\x1b[0m",
              `error in ${data[currentIdx].name}, expected token type "ID"`
            );
            process.exit();
          }

          for (currentIdx; data[currentIdx]?.name !== ";"; currentIdx++) {
            if (
              data[currentIdx]?.type === "ID" &&
              !endOfDeclaration.includes(data[currentIdx + 1].name)
            ) {
              console.log(
                "\x1b[31m%s\x1b[0m",
                `error in ${data[currentIdx].name}, Unexpected token ${
                  data[currentIdx + 1].name
                }`
              );
              process.exit();
            }

            if (
              data[currentIdx]?.type === "ID" &&
              !endOfDeclaration.includes(data[currentIdx - 1].name)
            ) {
              console.log(
                "\x1b[31m%s\x1b[0m",
                `error in ${data[currentIdx].name}, Unexpected token ${
                  data[currentIdx - 1].name
                }`
              );
              process.exit();
            }

            declarations.push(data[currentIdx]);
          }

          if (!declarations[0]) {
            console.log(
              "\x1b[31m%s\x1b[0m",
              `error in ${token.name}, you need a declaration`
            );
            process.exit();
          }
        }
      }

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

    if (token.type === "ID") {
      const hasCondId = [];
      let currentIdx = nextIdx - 1;

      if (
        !reservedDeclarations.includes(data[currentIdx - 1].name) &&
        data[currentIdx - 1].name !== ","
      ) {
        currentIdx--;
        for (currentIdx; currentIdx > 0; currentIdx--) {
          if (
            data[currentIdx].name === token.name &&
            data[currentIdx - 1] !== undefined
          ) {
            hasCondId.push(currentIdx);
          }
        }

        if (!hasCondId[0]) {
          console.log(
            "\x1b[31m%s\x1b[0m",
            `error in token ${token.name}, not defined yet`
          );
          process.exit();
        }
      }
    }

    if (token.type === "LITERAL") {
      if (
        data[nextIdx - 2]?.type === "LITERAL" ||
        data[nextIdx]?.type === "LITERAL"
      ) {
        console.log(
          "\x1b[31m%s\x1b[0m",
          `error unexpected token ${token.name}`
        );
        process.exit();
      }
    }

    if (token.type === "OPERATOR") {
      if (token.name !== "+" && token.name !== "-") {
        if (
          data[nextIdx - 2].name === ";" ||
          data[nextIdx - 2].name === "}" ||
          data[nextIdx - 2].name === ")"
        ) {
          console.log(
            "\x1b[31m%s\x1b[0m",
            `error unexpected token ${token.name} before ${data[nextIdx].name}`
          );
          process.exit();
        }
      }
    }
  }
};

module.exports = { syntactic };
