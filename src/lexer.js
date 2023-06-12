const {
  isValidId,
  isValidNumber,
  isValidString,
  isValidKeyWord,
  isValidOperator,
  isValidDelimiter,
  isValidBoolean,
} = require("./utils/lexerValidations.js");

const lexer = (data) => {
  const formattedResponse = data
    .replace(/\n+/g, " ")
    .replace(/([\[\](){}])/g, " $1 ")
    .replace(/([-+*/])/g, " $1 ")
    .replace(/,/g, " , ")
    .replace(/,/g, " , ")
    .replace(/\s+/g, " ");
  const splittedResponse = formattedResponse.split(" ");
  const finalResponse = [];

  splittedResponse.forEach((token) => {
    if (isValidString(token) || isValidNumber(token) || isValidBoolean(token)) {
      finalResponse.push({ type: "LITERAL", token });
    }
    if (isValidKeyWord(token)) {
      finalResponse.push({ type: "KEYWORD", token });
    }
    if (
      isValidId(token) &&
      !isValidKeyWord(token) &&
      !isValidBoolean(token) &&
      !isValidNumber(token)
    ) {
      finalResponse.push({ type: "ID", token });
    }
    if (isValidOperator(token)) {
      finalResponse.push({ type: "OPERATOR", token });
    }
    if (isValidDelimiter(token)) {
      finalResponse.push({ type: "DELIMITER", token });
    }
  });

  return finalResponse;
};

module.exports = { lexer };
