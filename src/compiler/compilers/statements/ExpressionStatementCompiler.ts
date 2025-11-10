import type { ExpressionStatement } from "@babel/types";
import NodeCompiler from "../NodeCompiler.js";
import type Compiler from "../../Compiler.js";

export default class ExpressionStatementCompiler extends NodeCompiler<ExpressionStatement> {
  constructor(compiler: Compiler) {
    super(compiler);
  };

  public override compile(node: ExpressionStatement): void {
    return this.compiler.compileNode(node.expression);
  };
};