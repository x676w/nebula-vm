import type { Node } from "@babel/types";
import type Compiler from "../Compiler.js";

export default abstract class NodeCompiler<T = Node> {
  protected compiler: Compiler;
  
  constructor(compiler: Compiler) {
    this.compiler = compiler;
  };

  public abstract compile(node: T): void;
};