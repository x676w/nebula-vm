import type { BooleanLiteral } from "@babel/types";
import NodeCompiler from "../NodeCompiler.js";
import type Compiler from "../../Compiler.js";
import { OperationCode } from "../../bytecode/OperationCode.js";

export default class BooleanLiteralCompiler extends NodeCompiler<BooleanLiteral> {
  constructor(compiler: Compiler) {
    super(compiler);
  };
  
  public override compile(node: BooleanLiteral): void {
    this.compiler.bytecode.writeOperationCode(OperationCode.STACK_PUSH_BOOLEAN);
    this.compiler.bytecode.writeInstruction(node.value ? 1 : 0);
  };
};