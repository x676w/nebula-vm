import type { VariableDeclaration } from "@babel/types";
import NodeCompiler from "../NodeCompiler.js";
import type Compiler from "../../Compiler.js";

export default class VariableDeclarationCompiler extends NodeCompiler<VariableDeclaration> {
  constructor(compiler: Compiler) {
    super(compiler);
  };
  
  public override compile(node: VariableDeclaration): void {
    for(const declarator of node.declarations) {
      this.compiler.compileNode(declarator);
    };
  };
};