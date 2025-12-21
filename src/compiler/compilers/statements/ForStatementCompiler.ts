import type { ForStatement } from "@babel/types";
import NodeCompiler from "../NodeCompiler.js";
import type Compiler from "../../Compiler.js";
import { OperationCode } from "../../bytecode/OperationCode.js";

export default class ForStatementCompiler extends NodeCompiler<ForStatement> {
  constructor(compiler: Compiler) {
    super(compiler);
  };
  
  public override compile(node: ForStatement): void {
    const { init, test, update, body } = node;
    
    this.compiler.scopeManager.enterNewScope();

    if(init) {
      this.compiler.compileNode(init);
      if(init.type === "VariableDeclaration") {
        this.compiler.bytecode.writeOperationCode(OperationCode.STACK_POP);
      };
    };
    
    const testLabel = this.compiler.bytecode.createLabel("for_test");
    const bodyLabel = this.compiler.bytecode.createLabel("for_body");
    const updateLabel = this.compiler.bytecode.createLabel("for_update");
    const endLabel = this.compiler.bytecode.createLabel("for_end");

    this.compiler.pushLoop(endLabel, updateLabel);
    
    this.compiler.bytecode.writeOperationCode(OperationCode.JUMP);
    this.compiler.bytecode.writeLabelReference(testLabel);
    
    this.compiler.bytecode.markLabel(bodyLabel);
    
    this.compiler.compileNode(body);
    
    this.compiler.bytecode.markLabel(updateLabel);
    
    if(update) {
      this.compiler.compileNode(update);
      this.compiler.bytecode.writeOperationCode(OperationCode.STACK_POP);
    };
    
    this.compiler.bytecode.markLabel(testLabel);
    
    if(test) {
      this.compiler.compileNode(test);
      
      this.compiler.bytecode.writeOperationCode(OperationCode.JUMP_IF_TRUE);
      this.compiler.bytecode.writeLabelReference(bodyLabel);
    } else {
      this.compiler.bytecode.writeOperationCode(OperationCode.JUMP);
      this.compiler.bytecode.writeLabelReference(bodyLabel);
    };
    
    this.compiler.bytecode.markLabel(endLabel);

    this.compiler.popLoop();

    this.compiler.scopeManager.exitScope();
  };
};