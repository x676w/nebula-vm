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

    this.compiler.scopeManager.enterNewScope();

    const currentScope = this.compiler.scopeManager.getCurrentScope();
    
    for(let i = 0; i < node.params.length; i++) {
      const param = node.params[i]!;

      if(param.type !== 'Identifier') continue;

      const definition = this.compiler.scopeManager.defineVariable(
        param.name, currentScope
      );

      this.compiler.bytecode.writeOperationCode(OperationCode.LOAD_ARGUMENT);
      this.compiler.bytecode.writeDword(i);
      
      this.compiler.bytecode.writeOperationCode(OperationCode.STORE_VARIABLE);
      this.compiler.bytecode.writeDword(definition.scope.id);
      this.compiler.bytecode.writeDword(definition.destination);
    };

    for(const statement of node.body.body) {
      this.compiler.compileNode(statement);
    };

    this.compiler.scopeManager.exitScope();

    const fnProgram = this.compiler.bytecode.replaceProgram(oldProgram);

    this.compiler.bytecode.writeOperationCode(OperationCode.BUILD_FUNCTION);
    this.compiler.bytecode.writeDword(fnProgram.length);

    for(let i = 0; i < fnProgram.length; i++) {
      const fnInstruction = fnProgram[i]!;
      this.compiler.bytecode.writeInstruction(fnInstruction);
    };
  };
};