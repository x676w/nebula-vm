import type { BreakStatement } from "@babel/types";
import NodeCompiler from "../NodeCompiler.js";
import type Compiler from "../../Compiler.js";
import { OperationCode } from "../../bytecode/OperationCode.js";

export default class BreakStatementCompiler extends NodeCompiler<BreakStatement> {
  constructor(compiler: Compiler) {
    super(compiler);
  };

  public override compile(_node: BreakStatement): void {
    const loop = this.compiler.getCurrentLoop();
    if(!loop) throw new Error("'break' used outside of loop");

    this.compiler.bytecode.writeOperationCode(OperationCode.JUMP);
    this.compiler.bytecode.writeLabelReference(loop.breakLabel);
  };
};
