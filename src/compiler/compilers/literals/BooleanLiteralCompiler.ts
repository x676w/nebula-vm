import type { BooleanLiteral } from "@babel/types";
import NodeCompiler from "../NodeCompiler.js";
import type Register from "../../register/Register.js";
import type Compiler from "../../Compiler.js";
import { OperationCode } from "../../bytecode/OperationCode.js";

export default class BooleanLiteralCompiler extends NodeCompiler<BooleanLiteral> {
  constructor(compiler: Compiler) {
    super(compiler);
  };
  
  public override compile(node: BooleanLiteral): Register | void {
    const register = this.compiler.registerAllocator.allocateRegister();

    this.compiler.bytecode.writeOperationCode(OperationCode.STACK_PUSH_BOOLEAN);
    this.compiler.bytecode.writeInstruction(node.value ? 1 : 0);
    this.compiler.bytecode.writeOperationCode(OperationCode.MOVE_TO_REGISTER);
    this.compiler.bytecode.linkRegister(register);

    return register;
  };
};