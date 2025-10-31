import type { ExpressionStatement } from "@babel/types";
import NodeCompiler from "../NodeCompiler.js";
import type Compiler from "../../Compiler.js";
import type Register from "../../register/Register.js";

export default class ExpressionStatementCompiler extends NodeCompiler<ExpressionStatement> {
  constructor(compiler: Compiler) {
    super(compiler);
  };

  public override compile(node: ExpressionStatement): Register | void {
    return this.compiler.compileNode(node.expression);
  };
};