const {
  isValidId,
  isValidNumber,
  isValidString,
  isValidKeyWord,
  isValidOperator,
  isValidDelimiter,
  isValidBoolean,
  isValidConditional,
} = require("./utils/validators.js");

const lexer = (data) => {
  const formattedResponse = data
    .replace(/\n+/g, " ")
    .replace(/([\[\](){}])/g, " $1 ")
    .replace(/([-+*/])/g, " $1 ")
    .replace(/,/g, " , ")
    .replace(/,/g, " , ")
    .replace(/;/g, " ; ")
    .replace(/\s+/g, " ");
  const splittedResponse = formattedResponse.split(" ");
  const finalResponse = [];

  splittedResponse.forEach((token) => {
    if (isValidString(token) || isValidNumber(token) || isValidBoolean(token)) {
      finalResponse.push({ type: "LITERAL", name: token });
    }
    if (isValidKeyWord(token)) {
      finalResponse.push({ type: "KEYWORD", name: token });
    }
    if (
      isValidId(token) &&
      !isValidKeyWord(token) &&
      !isValidBoolean(token) &&
      !isValidNumber(token)
    ) {
      finalResponse.push({ type: "ID", name: token });
    }
    if (isValidOperator(token)) {
      finalResponse.push({ type: "OPERATOR", name: token });
    }
    if (isValidConditional(token)) {
      finalResponse.push({ type: "CONDITIONAL", name: token });
    }
    if (isValidDelimiter(token)) {
      finalResponse.push({ type: "DELIMITER", name: token });
    }
  });

  return finalResponse;
};

module.exports = { lexer };
