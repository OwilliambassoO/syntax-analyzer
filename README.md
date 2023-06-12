# Objective

Build a Syntax Analyzer for a hypothetical language, exemplified below:

```
 var
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
 }
```

# Rules

The specification of the CFG (Context-Free Grammar) should be created to recognize the following:

- Binary arithmetic expressions: x + y, x - y, x / y, x \* y, x ^ y, etc.
- Arithmetic expressions with balanced parentheses: (x + y), x \* (y+z), (x / (y-z)), etc.
- Relational expressions: (x > y), x <= (y+z), (x <> (y-z)), etc.
- Variable declaration: int x, y | real s | etc.
- Simple assignment statement: a = b, a = expr + 78.
- Loop statement: while (a > b) { statements }.
- Control flow statement: if (a > b) { statements } else { statements }.
- Display appropriate error message when the input sentence does not conform to the grammar.

The input can be received through a device or files. It may or may not have an input and manipulation interface.

# Creator

- William Basso
- Software Developer
- Computer Engineer
- Insta: @williambasso12

# How to use

- You need to install Node.js on your machine.
- There is no need to use the "npm install" command.
- To initialize, you only need to use the following script:

```
npm start
```
