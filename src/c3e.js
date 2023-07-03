const {
  keyWords,
  conditionals,
  reservedDeclarations,
  endOfDeclaration,
} = require("./consts/types.js");

const c3e = (data) => {
  const startLoopLength = data.filter((token) => token.name === "{").length;
  let startLoopNum = 0;
  let nextIdx = 0;

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
              console.log(variable);
            } else {
              if (
                token.name === "var" ||
                token.name === "let" ||
                token.name === "const"
              ) {
                console.log(`${variable} = null`);
              }
              if (token.name === "int") {
                console.log(`${variable} = 0`);
              }
              if (token.name === "real") {
                console.log(`${variable} = 0.0`);
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

        console.log(
          `(L${startLoopNum}) if${conditional} goto L${startLoopNum + 1}`
        );
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

        console.log(declaration);
      }
    }
  }
};

module.exports = { c3e };
