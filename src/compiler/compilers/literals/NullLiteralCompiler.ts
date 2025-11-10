import type { NullLiteral } from "@babel/types";
import NodeCompiler from "../NodeCompiler.js";
import type Compiler from "../../Compiler.js";
import { OperationCode } from "../../bytecode/OperationCode.js";

export default class NullLiteralCompiler extends NodeCompiler<NullLiteral> {
  constructor(compiler: Compiler) {
    super(compiler);
  };
  
  public override compile(): void {
    this.compiler.bytecode.writeOperationCode(OperationCode.STACK_PUSH_NULL);
  };
};