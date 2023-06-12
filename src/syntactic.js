const { invalidPrevious } = require("./consts/syntacticErrorsConsts.js");

const syntactic = (data) => {
  let previousToken = null;
  let delimiter = 0;
  let validSyntax = true;

  data.forEach((token) => {
    if (validSyntax === true) {
      if (token.type === "DELIMITER" && token.token !== ",") delimiter++;
      if (token.type === "LITERAL") {
        if (previousToken === "LITERAL" || previousToken === "KEYWORD") {
          validSyntax = false;
          return invalidPrevious(token.token, previousToken);
        }
      }
      if (token.type === "OPERATOR") {
        if (
          previousToken === "KEYWORD" ||
          previousToken === "OPERATOR" ||
          previousToken === "DELIMITER"
        ) {
          validSyntax = false;
          return invalidPrevious(token.token, previousToken);
        }
      }
      if (token.type === "KEYWORD") {
        if (previousToken === "OPERATOR") {
          validSyntax = false;
          return invalidPrevious(token.token, previousToken);
        }
      }
      if (token.type === "ID") {
        if (previousToken === "LITERAL") {
          validSyntax = false;
          return invalidPrevious(token.token, previousToken);
        }
      }
      previousToken = token.type;
    }
  });

  if (delimiter % 2 === 1 && validSyntax === true) {
    return console.log(`Error: invalid number of delimiters (${delimiter})`);
  }
  if (validSyntax === true) {
    return console.log("Success: valid syntax");
  }
};

module.exports = { syntactic };
