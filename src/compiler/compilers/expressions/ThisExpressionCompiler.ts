import type { ThisExpression } from "@babel/types";
import NodeCompiler from "../NodeCompiler.js";
import type Compiler from "../../Compiler.js";
import { OperationCode } from "../../bytecode/OperationCode.js";

export default class ThisExpressionCompiler extends NodeCompiler<ThisExpression> {
  constructor(compiler: Compiler) {
    super(compiler);
  };

  public override compile(_node: ThisExpression): void {
    this.compiler.bytecode.writeOperationCode(OperationCode.LOAD_THIS);
  };
};
