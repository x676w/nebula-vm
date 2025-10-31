import type { NullLiteral } from "@babel/types";
import NodeCompiler from "../NodeCompiler.js";
import type Register from "../../register/Register.js";
import type Compiler from "../../Compiler.js";
import { OperationCode } from "../../bytecode/OperationCode.js";

export default class NullLiteralCompiler extends NodeCompiler<NullLiteral> {
  constructor(compiler: Compiler) {
    super(compiler);
  };
  
  public override compile(): Register | void {
    const register = this.compiler.registerAllocator.allocateRegister();

    this.compiler.bytecode.writeOperationCode(OperationCode.STACK_PUSH_NULL);
    this.compiler.bytecode.writeOperationCode(OperationCode.MOVE_TO_REGISTER);
    this.compiler.bytecode.linkRegister(register);

    return register;
  };
};