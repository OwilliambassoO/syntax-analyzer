const { lexer } = require("./lexer.js");
const { syntactic } = require("./syntactic.js");

const data = `var
int cont, num
real cont2

num = 0
while(cont < 10) {
cont2 = 3.1415 * contador ^ 2
if (cont < 5) {
   num = num + cont2
}
else {
   cont = 0
}
   cont = cont + 1
}`;

const main = () => {
  const lexerAnalysis = lexer(data);
  console.log(lexerAnalysis);
  syntactic(lexerAnalysis);
};

return main();
