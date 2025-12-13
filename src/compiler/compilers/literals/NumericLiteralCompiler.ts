import type { NumericLiteral } from "@babel/types";
import NodeCompiler from "../NodeCompiler.js";
import type Compiler from "../../Compiler.js";
import { OperationCode } from "../../bytecode/OperationCode.js";
import isFloat from "../../../utils/IsFloat.js";

export default class NumericLiteralCompiler extends NodeCompiler<NumericLiteral> {
  constructor(compiler: Compiler) {
    super(compiler);
  };
  
  public override compile(node: NumericLiteral): void {
    if(isFloat(node.value)) {
      this.compiler.bytecode.writeOperationCode(OperationCode.STACK_PUSH_DOUBLE);
      this.compiler.bytecode.writeDouble(node.value);
    } else {
      this.compiler.bytecode.writeOperationCode(OperationCode.STACK_PUSH_DWORD);
      this.compiler.bytecode.writeDword(node.value);
    };
  };
};