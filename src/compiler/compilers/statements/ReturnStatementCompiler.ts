import type { ReturnStatement } from "@babel/types";
import NodeCompiler from "../NodeCompiler.js";
import type Compiler from "../../Compiler.js";
import { OperationCode } from "../../bytecode/OperationCode.js";

export default class ReturnStatementCompiler extends NodeCompiler<ReturnStatement> {
  constructor(compiler: Compiler) {
    super(compiler);
  };

  public override compile(node: ReturnStatement): void {
    if(node.argument) {
      this.compiler.compileNode(node.argument);
    };

    this.compiler.bytecode.writeOperationCode(OperationCode.RETURN);
    this.compiler.bytecode.writeInstruction(node.argument ? 1 : 0);
  };
};