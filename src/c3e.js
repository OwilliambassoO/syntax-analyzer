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

  console.log("\x1b[35m%s\x1b[0m", "c3e response: \n");

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
    if (token.type === "ID" || token.type === "LITERAL") {
      if (
        data[nextIdx].name === "=" &&
        !reservedDeclarations.includes(data[nextIdx - 2].name)
      ) {
        const declarations = [];
        let currVariableIdx = nextIdx;

        for (
          currVariableIdx;
          data[currVariableIdx].name !== ";";
          currVariableIdx++
        ) {
          if (
            data[currVariableIdx].name !== "=" &&
            (currVariableIdx !== nextIdx || currVariableIdx !== nextIdx + 1)
          ) {
            declarations.push(data[currVariableIdx]);
          }
        }

        let currGroupIdx = 0;
        let currGroupPosition = 0;
        const numOfGroups = [];

        for (currGroupIdx; currGroupIdx < declarations.length; currGroupIdx++) {
          if (currGroupPosition <= 2) {
            currGroupPosition++;
          }
          if (
            currGroupPosition === 3 ||
            declarations[currGroupIdx + 1] === undefined ||
            (declarations[currGroupIdx + 2] === undefined &&
              currGroupPosition > 2)
          ) {
            numOfGroups.push(currGroupPosition);
            currGroupPosition = 0;
          }
        }

        let currGroupNumIdx = 0;
        const groupWithTemporary = [];

        for (
          currGroupNumIdx;
          currGroupNumIdx < numOfGroups.length;
          currGroupNumIdx++
        ) {
          let currGroupLog = "";
          let currGroupNum = 0;
          let currGroupNumStart = (currGroupNumIdx + 1) * 3 - 3;

          for (
            currGroupNum;
            currGroupNum < numOfGroups[currGroupNumIdx];
            currGroupNum++
          ) {
            if (
              currGroupNum === numOfGroups[currGroupNumIdx] - 1 &&
              numOfGroups[currGroupNumIdx + 1] === undefined
            ) {
              if (numOfGroups.length === 1) {
                if (numOfGroups[currGroupNumIdx] === 1) {
                  console.log(
                    `${token.name} = ${declarations[currGroupNumStart].name}`
                  );
                } else {
                  console.log(
                    `${token.name} =${currGroupLog} ${declarations[currGroupNumStart].name}`
                  );
                }
              } else {
                // AQUI QUE FAZ A MAGIA ACONTECER
                if (declarations[currGroupNumStart + 1] === undefined) {
                  groupWithTemporary.push(
                    `t${currGroupNumIdx} = ${
                      declarations[currGroupNumStart - 2].name
                    }${currGroupLog} ${declarations[currGroupNumStart].name}`
                  );
                  groupWithTemporary.reverse().forEach((line) => {
                    console.log(line);
                  });
                }
              }
            } else {
              if (currGroupNum < 2) {
                currGroupLog =
                  currGroupLog + ` ${declarations[currGroupNumStart].name}`;
              } else {
                groupWithTemporary.push(
                  `${token.name} =${currGroupLog} t${currGroupNumIdx + 1}`
                );
              }
            }
            if ([1] !== undefined) currGroupNumStart++;
          }
        }

        // process.stdout.write(`${declaration}\n`);
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
  console.log("\n");
};

module.exports = { c3e };
