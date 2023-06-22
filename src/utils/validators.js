const {
  keyWords,
  operators,
  delimiter,
  boolean,
  conditionals,
} = require("../consts/types.js");

const isValidId = (data) => {
  return /^[a-zA-Z0-9]+$/.test(data) || /^[a-zA-Z]+$/.test(data);
};

const isValidNumber = (data) => {
  return /^-?\d+(\.\d+)?$/.test(data);
};

const isValidString = (data) => {
  return /^.*['"].*['"].*$/.test(data);
};

const isValidBoolean = (data) => {
  return boolean.includes(data);
};

const isValidKeyWord = (data) => {
  return keyWords.find((keyword) => keyword.name === data);
};

const isValidOperator = (data) => {
  return operators.includes(data);
};

const isValidConditional = (data) => {
  return conditionals.includes(data);
};

const isValidDelimiter = (data) => {
  return delimiter.includes(data);
};

module.exports = {
  isValidId,
  isValidNumber,
  isValidString,
  isValidKeyWord,
  isValidOperator,
  isValidDelimiter,
  isValidBoolean,
  isValidConditional,
};
