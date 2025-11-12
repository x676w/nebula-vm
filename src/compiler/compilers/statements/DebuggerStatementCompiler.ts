import type { DebuggerStatement } from "@babel/types";
import NodeCompiler from "../NodeCompiler.js";
import type Compiler from "../../Compiler.js";
import { OperationCode } from "../../bytecode/OperationCode.js";

export default class DebuggerStatementCompiler extends NodeCompiler<DebuggerStatement> {
  constructor(compiler: Compiler) {
    super(compiler);
  };
  
  public override compile(): void {
    this.compiler.bytecode.writeOperationCode(OperationCode.DEBUGGER);
  };
};