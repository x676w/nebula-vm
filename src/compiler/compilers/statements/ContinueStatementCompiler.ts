import type { ContinueStatement } from "@babel/types";
import NodeCompiler from "../NodeCompiler.js";
import type Compiler from "../../Compiler.js";
import { OperationCode } from "../../bytecode/OperationCode.js";

export default class ContinueStatementCompiler extends NodeCompiler<ContinueStatement> {
  constructor(compiler: Compiler) {
    super(compiler);
  };

  public override compile(_node: ContinueStatement): void {
    const loop = this.compiler.getCurrentLoop();
    if(!loop) throw new Error("'continue' used outside of loop");

    this.compiler.bytecode.writeOperationCode(OperationCode.JUMP);
    this.compiler.bytecode.writeLabelReference(loop.continueLabel);
  };
};
