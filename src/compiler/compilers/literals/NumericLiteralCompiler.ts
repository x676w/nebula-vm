import type { NumericLiteral } from "@babel/types";
import NodeCompiler from "../NodeCompiler.js";
import type Register from "../../register/Register.js";
import type Compiler from "../../Compiler.js";
import { OperationCode } from "../../bytecode/OperationCode.js";

export default class NumericLiteralCompiler extends NodeCompiler<NumericLiteral> {
  constructor(compiler: Compiler) {
    super(compiler);
  };
  
  public override compile(node: NumericLiteral): Register | void {
    const register = this.compiler.registerAllocator.allocateRegister();

    this.compiler.bytecode.writeOperationCode(OperationCode.STACK_PUSH_DWORD);
    this.compiler.bytecode.writeDword(node.value);
    this.compiler.bytecode.writeOperationCode(OperationCode.MOVE_TO_REGISTER);
    this.compiler.bytecode.linkRegister(register);

    return register;
  };
};