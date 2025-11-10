import type { StringLiteral } from "@babel/types"
import NodeCompiler from "../NodeCompiler.js"
import type Compiler from "../../Compiler.js"
import { OperationCode } from "../../bytecode/OperationCode.js";

export default class StringLiteralCompiler extends NodeCompiler<StringLiteral> {
  constructor(compiler: Compiler) {
    super(compiler);
  };

  public override compile(node: StringLiteral): void {
    const index = this.compiler.bytecode.registerString(node.value);
    this.compiler.bytecode.writeOperationCode(OperationCode.STACK_PUSH_STRING);
    this.compiler.bytecode.writeDword(index);
  };
};