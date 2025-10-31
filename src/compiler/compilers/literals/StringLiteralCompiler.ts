import type { StringLiteral } from "@babel/types"
import NodeCompiler from "../NodeCompiler.js"
import type Compiler from "../../Compiler.js"
import type Register from "../../register/Register.js";
import { OperationCode } from "../../bytecode/OperationCode.js";

export default class StringLiteralCompiler extends NodeCompiler<StringLiteral> {
  constructor(compiler: Compiler) {
    super(compiler);
  };

  public override compile(node: StringLiteral): Register | void {
    const index = this.compiler.bytecode.registerString(node.value);
    const register = this.compiler.registerAllocator.allocateRegister();

    this.compiler.bytecode.writeOperationCode(OperationCode.STACK_PUSH_STRING);
    this.compiler.bytecode.writeDword(index);
    this.compiler.bytecode.writeOperationCode(OperationCode.MOVE_TO_REGISTER);
    this.compiler.bytecode.linkRegister(register);

    return register;
  };
};