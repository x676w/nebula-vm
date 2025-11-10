import type { LogicalExpression } from "@babel/types";
import type Compiler from "../../Compiler.js";
import NodeCompiler from "../NodeCompiler.js";

export default class LogicalExpressionCompiler extends NodeCompiler<LogicalExpression> {
  constructor(compiler: Compiler) {
    super(compiler);
  };
  
  public override compile(node: LogicalExpression): void {
    node;
  };
};