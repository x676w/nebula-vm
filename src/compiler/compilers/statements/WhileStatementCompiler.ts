import type { WhileStatement } from "@babel/types";
import NodeCompiler from "../NodeCompiler.js";
import type Compiler from "../../Compiler.js";
import { OperationCode } from "../../bytecode/OperationCode.js";

export default class WhileStatementCompiler extends NodeCompiler<WhileStatement> {
  constructor(compiler: Compiler) {
    super(compiler);
  };
  
  public override compile(node: WhileStatement): void {
    const { test, body } = node;
    
    const loopStart = this.compiler.bytecode.createLabel("while_start");
    const loopEnd = this.compiler.bytecode.createLabel("while_end");
    
    this.compiler.bytecode.markLabel(loopStart);
    
    this.compiler.compileNode(test);
    
    this.compiler.bytecode.writeOperationCode(OperationCode.JUMP_IF_FALSE);
    this.compiler.bytecode.writeLabelReference(loopEnd);
    
    this.compiler.compileNode(body);
    
    this.compiler.bytecode.writeOperationCode(OperationCode.JUMP);
    this.compiler.bytecode.writeLabelReference(loopStart);
    
    this.compiler.bytecode.markLabel(loopEnd);
  };
};