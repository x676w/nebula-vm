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
    
    switch(node.operator) {
      case "&&": {
        this.compiler.bytecode.writeOperationCode(OperationCode.STACK_PUSH_DUPLICATE);
        this.compiler.bytecode.writeOperationCode(OperationCode.JUMP_IF_FALSE);
        
        const jumpPos = this.compiler.bytecode.program.length;
        this.compiler.bytecode.writeDword(0);

        this.compiler.bytecode.writeOperationCode(OperationCode.STACK_POP);
        this.compiler.compileNode(node.right);

        const endPos = this.compiler.bytecode.program.length;
        this.compiler.bytecode.writeDwordAt(jumpPos, endPos);
        break;
      };
    
      case "||": {
        this.compiler.bytecode.writeOperationCode(OperationCode.STACK_PUSH_DUPLICATE);
        this.compiler.bytecode.writeOperationCode(OperationCode.JUMP_IF_TRUE);
          
        const jumpPos = this.compiler.bytecode.program.length;
        this.compiler.bytecode.writeDword(0);

        this.compiler.bytecode.writeOperationCode(OperationCode.STACK_POP);
        this.compiler.compileNode(node.right);

        const endPos = this.compiler.bytecode.program.length;
        this.compiler.bytecode.writeDwordAt(jumpPos, endPos);
        break;
      };
    };
  };
};