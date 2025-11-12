import type { IfStatement } from "@babel/types";
import NodeCompiler from "../NodeCompiler.js";
import type Compiler from "../../Compiler.js";

export default class IfStatementCompiler extends NodeCompiler<IfStatement> {
  constructor(compiler: Compiler) {
    super(compiler);
  };

  public override compile(node: IfStatement): void {
    // TODO
    node;
  };
};