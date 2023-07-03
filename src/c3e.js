const {
  keyWords,
  conditionals,
  reservedDeclarations,
  endOfDeclaration,
} = require("./consts/types.js");

const c3e = (data) => {
  const startLoopLength = data.filter((token) => token.name === "{").length;
  let endLoopLength = data.filter((token) => token.name === "}").length;
  const endLoops = [];
  let startLoopNum = 0;
  let nextIdx = 0;

  console.log("\x1b[35m%s\x1b[0m", "c3e response: ");

  for (const token of data) {
    nextIdx++;

    if (token.type === "KEYWORD") {
      const keyWordProps = keyWords.find(
        (keyWord) => keyWord.name === token.name
      );

      if (keyWordProps.conditional === false) {
        if (reservedDeclarations.includes(token.name)) {
          const variables = [];
          let currVariableIdx = nextIdx;

          for (
            currVariableIdx;
            data[currVariableIdx].name !== ";";
            currVariableIdx++
          ) {
            if (
              !endOfDeclaration.includes(data[currVariableIdx].name) &&
              data[currVariableIdx - 1].name !== "="
            ) {
              if (data[currVariableIdx + 1].name === "=") {
                variables.push(
                  `${data[currVariableIdx].name} = ${
                    data[currVariableIdx + 2].name
                  }`
                );
              } else {
                variables.push(data[currVariableIdx].name);
              }
            }
          }

          for (const variable of variables) {
            if (variable.includes("=")) {
              process.stdout.write(variable);
            } else {
              if (
                token.name === "var" ||
                token.name === "let" ||
                token.name === "const"
              ) {
                process.stdout.write(`${variable} = null \n`);
              }
              if (token.name === "int") {
                process.stdout.write(`${variable} = 0 \n`);
              }
              if (token.name === "real") {
                process.stdout.write(`${variable} = 0.0 \n`);
              }
            }
          }
        }
      } else {
        let conditional = "";
        let currConditionalIdx = nextIdx + 1;

        for (
          currConditionalIdx;
          data[currConditionalIdx].name !== ")";
          currConditionalIdx++
        ) {
          if (
            !conditionals.includes(data[currConditionalIdx].name) ||
            data[currConditionalIdx].name === "&&" ||
            data[currConditionalIdx].name === "||"
          ) {
            conditional = conditional + ` ${data[currConditionalIdx].name}`;
          }
          if (data[currConditionalIdx].name === ">") {
            conditional = conditional + " <=";
          }
          if (data[currConditionalIdx].name === "<") {
            conditional = conditional + " >=";
          }
          if (data[currConditionalIdx].name === ">=") {
            conditional = conditional + " <";
          }
          if (data[currConditionalIdx].name === "<=") {
            conditional = conditional + " >";
          }
          if (data[currConditionalIdx].name === "==") {
            conditional = conditional + " !=";
          }
          if (data[currConditionalIdx].name === "!=") {
            conditional = conditional + " ==";
          }
          if (data[currConditionalIdx].name === "===") {
            conditional = conditional + " !==";
          }
          if (data[currConditionalIdx].name === "!==") {
            conditional = conditional + " ===";
          }
        }

        if (startLoopNum < startLoopLength) {
          startLoopNum++;
        }

        if (token.name === "while") {
          process.stdout.write(`(L${startLoopNum}) `);
        }

        process.stdout.write(`if${conditional} goto L${startLoopNum + 1}\n`);

        endLoops.push({
          name: `(L${startLoopNum + 1})`,
          type: token.name,
          loopNum: endLoopLength,
        });

        endLoopLength--;
      }
    }
    if (token.type === "ID") {
      if (
        data[nextIdx].name === "=" &&
        !reservedDeclarations.includes(data[nextIdx - 2].name)
      ) {
        let declaration = token.name;
        let currVariableIdx = nextIdx;

        for (
          currVariableIdx;
          data[currVariableIdx].name !== ";";
          currVariableIdx++
        ) {
          declaration = declaration + ` ${data[currVariableIdx].name}`;
        }

        process.stdout.write(`${declaration}\n`);
      }
    }

    if (token.name === "}") {
      let searchEndLoops = nextIdx - 1;
      let actualEndLoops = 0;

      for (
        searchEndLoops;
        data[searchEndLoops] !== undefined;
        searchEndLoops--
      ) {
        if (data[searchEndLoops].name === "}") {
          actualEndLoops++;
        }
      }
      const actualEndLoopProps = endLoops.find(
        (endLoop) => endLoop.loopNum === actualEndLoops
      );

      if (actualEndLoopProps === undefined && data[nextIdx].name === "else") {
        if (startLoopNum < startLoopLength) {
          startLoopNum++;
        }

        process.stdout.write(`goto L${startLoopNum + 1}\n`);

        endLoops.push({
          name: `(L${startLoopNum + 1})`,
          type: data[nextIdx].name,
          loopNum: endLoopLength,
        });

        endLoopLength--;

        process.stdout.write(`(L${startLoopNum}) `);

        const catchIfOfElse = endLoops.find(
          (endLoop) => endLoop.name === `(L${startLoopNum})`
        );

        catchIfOfElse.name = `(L${startLoopNum + 1})`;
      } else if (actualEndLoopProps.type === "while") {
        const whilePosition =
          data.filter((token) => token.name === "{").length -
          (actualEndLoopProps.loopNum - 1);
        process.stdout.write(`goto L${whilePosition}\n`);
        process.stdout.write(`${actualEndLoopProps.name} `);
      } else {
        process.stdout.write(`${actualEndLoopProps.name} `);
      }
    }
  }
};

module.exports = { c3e };
