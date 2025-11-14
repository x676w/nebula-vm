import type { FunctionExpression } from "@babel/types";
import NodeCompiler from "../NodeCompiler.js";
import type Compiler from "../../Compiler.js";
import { OperationCode } from "../../bytecode/OperationCode.js";

export default class FunctionExpressionCompiler extends NodeCompiler<FunctionExpression> {
  constructor(compiler: Compiler) {
    super(compiler);
  };
  
  public override compile(node: FunctionExpression): void {
    const oldProgram = this.compiler.bytecode.flushProgram();

    this.compiler.compileNode(node.body);

    const fnProgram = this.compiler.bytecode.replaceProgram(oldProgram);

    this.compiler.bytecode.writeOperationCode(OperationCode.BUILD_FUNCTION);
    this.compiler.bytecode.writeDword(fnProgram.length);

    for(let i = 0; i < fnProgram.length; i++) {
      const fnInstruction = fnProgram[i]!;
      this.compiler.bytecode.writeInstruction(fnInstruction);
    };
  };
};