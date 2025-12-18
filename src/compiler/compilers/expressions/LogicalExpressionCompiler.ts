import type { LogicalExpression } from "@babel/types";
import type Compiler from "../../Compiler.js";
import NodeCompiler from "../NodeCompiler.js";
import { OperationCode } from "../../bytecode/OperationCode.js";

export default class LogicalExpressionCompiler extends NodeCompiler<LogicalExpression> {
  constructor(compiler: Compiler) {
    super(compiler);
  };
  
  public override compile(node: LogicalExpression): void {
    this.compiler.compileNode(node.left);

    const endLabel = this.compiler.bytecode.createLabel("logical_end");

    switch (node.operator) {
      case "&&": {
        this.compiler.bytecode.writeOperationCode(OperationCode.STACK_PUSH_DUPLICATE);
        this.compiler.bytecode.writeOperationCode(OperationCode.JUMP_IF_FALSE);
        this.compiler.bytecode.writeLabelReference(endLabel);

        this.compiler.bytecode.writeOperationCode(OperationCode.STACK_POP);
        this.compiler.compileNode(node.right);

        this.compiler.bytecode.markLabel(endLabel);
        break;
      }

      case "||": {
        this.compiler.bytecode.writeOperationCode(OperationCode.STACK_PUSH_DUPLICATE);
        this.compiler.bytecode.writeOperationCode(OperationCode.JUMP_IF_TRUE);
        this.compiler.bytecode.writeLabelReference(endLabel);

        this.compiler.bytecode.writeOperationCode(OperationCode.STACK_POP);
        this.compiler.compileNode(node.right);

        this.compiler.bytecode.markLabel(endLabel);
        break;
      }
    }
  };
};