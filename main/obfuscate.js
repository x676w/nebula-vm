import fs from "fs";
import path from "path";
import compile from "../dist/index.js";
import uglifyjs from "uglify-js";
import typescript from "typescript";
import traverse from "@babel/traverse";
import generate from "@babel/generator";
import { parse } from "@babel/parser";
import { switchStatement } from "@babel/types";
import { objectExpression } from "@babel/types";

const _traverse = typeof traverse === "object" ? traverse.default : traverse;
const _generate = typeof generate === "object" ? generate.default : generate;

const inputPath = path.resolve(path.join("./", "resources", "input.js"));
const outputPath = path.resolve(path.join("./", "resources", "output.js"));
const interpreterPath = path.resolve(path.join("./", "dev", "interpreter.js"));

let start;
let input;
let verbose = false; // FOR DEBUG

const minifyOptions = {
  compress: {
    drop_debugger: false
  },

  mangle: {
    properties: true
  },
};

export const obfuscate = (input) => {
  let obfuscatedCode = typescript.transpileModule(input, {
    compilerOptions: {
      target: typescript.ScriptTarget.ES5
    }
  }).outputText;

  try {
    const { bytecode, opcodes } = compile(obfuscatedCode, verbose);
  
    obfuscatedCode = fs.readFileSync(interpreterPath, "utf8")
      .replace("__BYTECODE__", JSON.stringify(bytecode.getBase64()))
      .replace("__STRINGS_BYTES__", JSON.stringify(bytecode.getStringsBytes()));
  
    for(const usedOpcode of bytecode.usedOpcodes) {
      const opcodeKey = opcodes[usedOpcode];
  
      obfuscatedCode = obfuscatedCode.replaceAll(
        "__" + opcodeKey + "__",
        usedOpcode
      );
    };

    obfuscatedCode = obfuscatedCode.replace(
      "__RETURN__",
      opcodes.RETURN
    );

    const obfuscatedCodeAST = parse(obfuscatedCode);
    _traverse(obfuscatedCodeAST, {
      SwitchStatement: function(path) {
        if(path.node.discriminant.type !== "Identifier") return;
        if(path.node.discriminant.name !== "assignOpcode") return;

        const newCases = path.node.cases
          .filter((_case) => _case.test === null || _case.test.type === "NumericLiteral")
          .sort(() => Math.random() - 0.5);

        path.replaceWith(
          switchStatement(
            path.node.discriminant,
            newCases
          )
        );

        path.skip();
      }
    });
    _traverse(obfuscatedCodeAST, {
      ObjectExpression: function(path) {
        const isOpcodeHandlers = path.node.properties.some(
          (prop) => prop.key.type === "Identifier" && prop.key.name.startsWith("__") && prop.key.name.endsWith("__")
        );

        if(!isOpcodeHandlers) return;

        const newObjectProperties = [];

        for(const property of path.node.properties) {
          if(property.key.type === "Identifier") continue;
          newObjectProperties.push(property);
        };
        
        path.replaceWith(objectExpression(
          newObjectProperties.sort(() => Math.random() - 0.5)
        ));
      }
    });
    obfuscatedCode = _generate(obfuscatedCodeAST).code;

    if(!verbose) {
      obfuscatedCode = uglifyjs.minify(
        obfuscatedCode,
        minifyOptions
      ).code;
    };
    
  } catch(err) {
    console.log("An error occured while obfuscating: " + err);
  };

  return obfuscatedCode;
};

if(import.meta.main) {
  
  fs.readFile(inputPath, (err, data) => {
    if(err) throw err;
  
    start = Date.now();
    input = data.toString();
  
    const obfuscatedCode = obfuscate(input);
  
    if(obfuscatedCode)
      return fs.writeFileSync(outputPath, obfuscatedCode);
  
    console.log(
      "Obfuscated successfully in:",
      ((Date.now() - start) / 1e3).toFixed(2) + "s"
    );
  });

};