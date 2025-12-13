import Compiler from "./compiler/Compiler.js";

const compile = (input: string, verbose?: boolean) => {
  const compiler = new Compiler(input, verbose);
  return compiler.compile();
};

export default compile;