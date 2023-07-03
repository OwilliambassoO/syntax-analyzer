const keyWords = [
  {
    name: "var",
    conditional: false,
    hasDelimiter: false,
  },
  {
    name: "let",
    conditional: false,
    hasDelimiter: false,
  },
  {
    name: "const",
    conditional: false,
    hasDelimiter: false,
  },
  {
    name: "int",
    conditional: false,
    hasDelimiter: false,
  },
  {
    name: "real",
    conditional: false,
    hasDelimiter: false,
  },
  {
    name: "if",
    conditional: true,
    hasDelimiter: true,
  },
  {
    name: "else",
    conditional: false,
    hasDelimiter: true,
  },
  {
    name: "for",
    conditional: true,
    hasDelimiter: true,
  },
  {
    name: "while",
    conditional: true,
    hasDelimiter: true,
  },
  {
    name: "return",
    conditional: false,
    hasDelimiter: false,
  },
];

const operators = ["+", "-", "*", "/", "=", "^"];

const conditionals = [
  "==",
  "!=",
  "===",
  "!==",
  ">",
  "<",
  ">=",
  "<=",
  "&&",
  "||",
];
const delimiter = ["(", ")", "[", "]", "{", "}", ",", ";"];
const boolean = ["true", "false"];
const reservedDeclarations = ["var", "let", "const", "int", "real"];
const endOfDeclaration = ["=", ",", ";"];

module.exports = {
  keyWords,
  operators,
  delimiter,
  boolean,
  conditionals,
  reservedDeclarations,
  endOfDeclaration,
};
