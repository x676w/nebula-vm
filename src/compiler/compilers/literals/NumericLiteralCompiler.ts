import type { NumericLiteral } from "@babel/types";
import NodeCompiler from "../NodeCompiler.js";
import type Compiler from "../../Compiler.js";
import { OperationCode } from "../../bytecode/OperationCode.js";

export default class NumericLiteralCompiler extends NodeCompiler<NumericLiteral> {
  constructor(compiler: Compiler) {
    super(compiler);
  };
  
  public override compile(node: NumericLiteral): void {
    this.compiler.bytecode.writeOperationCode(OperationCode.STACK_PUSH_DWORD);
    this.compiler.bytecode.writeDword(node.value);
  };
};