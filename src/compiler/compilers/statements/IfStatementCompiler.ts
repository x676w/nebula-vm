import type { IfStatement } from "@babel/types";
import NodeCompiler from "../NodeCompiler.js";
import type Compiler from "../../Compiler.js";
import { OperationCode } from "../../bytecode/OperationCode.js";

export default class IfStatementCompiler extends NodeCompiler<IfStatement> {
  constructor(compiler: Compiler) {
    super(compiler);
  };

  public override compile(node: IfStatement): void {
    const { test, consequent, alternate } = node;
    
    this.compiler.compileNode(test);
    
    const elseLabel = this.compiler.bytecode.createLabel("if_else");
    const endLabel = this.compiler.bytecode.createLabel("if_end");
    
    this.compiler.bytecode.writeOperationCode(OperationCode.JUMP_IF_FALSE);
    this.compiler.bytecode.writeLabelReference(elseLabel);
    
    this.compiler.compileNode(consequent);
    
    if(alternate) {
      this.compiler.bytecode.writeOperationCode(OperationCode.JUMP);
      this.compiler.bytecode.writeLabelReference(endLabel);
    };
    
    this.compiler.bytecode.markLabel(elseLabel);
    
    if(alternate) {
      this.compiler.compileNode(alternate);
      this.compiler.bytecode.markLabel(endLabel);
    } else {
      this.compiler.bytecode.markLabel(elseLabel);
      this.compiler.bytecode.markLabel(endLabel);
    };
  };
};