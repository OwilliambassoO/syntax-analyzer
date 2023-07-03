const { lexer } = require("./lexer.js");
const { syntactic } = require("./syntactic.js");
const { c3e } = require("./c3e.js");

const data = `
int cont, num;
real cont2;

num = 0;
while(cont < 10) {
  cont2 = 3.1415 * cont ^ 2;
  if (cont < 5) {
    num = num + cont2;
  }
  else {
    cont = 0 + 1;
  }
  cont = cont + 1;
}`;

const main = () => {
  const lexerAnalysis = lexer(data);

  console.log(
    "\x1b[35mlexical analyzer response: \x1b[0m\n",
    lexerAnalysis,
    "\n"
  );

  syntactic(lexerAnalysis);

  console.log(
    "\x1b[35msyntactic analyzer response: \x1b[0m",
    "\x1b[32mSuccess: Valid Syntax\x1b[0m\n"
  );

  c3e(lexerAnalysis);
};

return main();
