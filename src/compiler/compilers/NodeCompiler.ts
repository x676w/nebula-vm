import type { Node } from "@babel/types";
import type Compiler from "../Compiler.js";
import type Register from "../register/Register.js";

export default abstract class NodeCompiler<T = Node> {
  protected compiler: Compiler;
  
  constructor(compiler: Compiler) {
    this.compiler = compiler;
  };

  public abstract compile(node: T): Register | void;
};