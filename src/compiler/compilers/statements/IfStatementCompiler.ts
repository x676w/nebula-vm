import type { IfStatement } from "@babel/types";
import NodeCompiler from "../NodeCompiler.js";
import type Compiler from "../../Compiler.js";
import { OperationCode } from "../../bytecode/OperationCode.js";

export default class IfStatementCompiler extends NodeCompiler<IfStatement> {
  constructor(compiler: Compiler) {
    super(compiler);
  };

  public override compile(node: IfStatement): void {
    this.compiler.compileNode(node.test);
    this.compiler.bytecode.writeOperationCode(OperationCode.JUMP_IF_FALSE);
    
    const addrPos = this.compiler.bytecode.program.length;
    this.compiler.bytecode.writeDword(0);

    this.compiler.compileNode(node.consequent);

    let jumpOverElsePos = null;
    if(node.alternate) {
      this.compiler.bytecode.writeOperationCode(OperationCode.JUMP);
      jumpOverElsePos = this.compiler.bytecode.program.length;
      this.compiler.bytecode.writeDword(0);
    };

    const elsePos = this.compiler.bytecode.program.length;
    if(node.alternate) {
      this.compiler.compileNode(node.alternate);
    };
    
    const endPos = this.compiler.bytecode.program.length;
    this.compiler.bytecode.writeDwordAt(addrPos, elsePos);
    if(jumpOverElsePos !== null) {
      this.compiler.bytecode.writeDwordAt(jumpOverElsePos, endPos);
    };
  };
};