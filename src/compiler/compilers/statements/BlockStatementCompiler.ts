import type { BlockStatement } from "@babel/types";
import NodeCompiler from "../NodeCompiler.js";
import type Compiler from "../../Compiler.js";

export default class BlockStatementCompiler extends NodeCompiler<BlockStatement> {
  constructor(compiler: Compiler) {
    super(compiler);
  };
  
  public override compile(node: BlockStatement): void {
    this.compiler.scopeManager.enterNewScope();
    
    for(const statement of node.body) {
      this.compiler.compileNode(statement);
    };

    this.compiler.scopeManager.exitScope();
  };
};