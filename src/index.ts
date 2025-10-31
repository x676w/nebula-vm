import type Bytecode from "./compiler/bytecode/Bytecode.js";
import Compiler from "./compiler/Compiler.js";

const compile = (input: string, verbose?: boolean): Bytecode => {
  const compiler = new Compiler(input, verbose);
  const bytecode = compiler.compile();
  return bytecode;
};

export default compile;