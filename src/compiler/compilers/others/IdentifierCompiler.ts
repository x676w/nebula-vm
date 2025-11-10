import type { Identifier } from "@babel/types";
import NodeCompiler from "../NodeCompiler.js";
import type Compiler from "../../Compiler.js";
import { OperationCode } from "../../bytecode/OperationCode.js";

export default class IdentifierCompiler extends NodeCompiler<Identifier> {
  constructor(compiler: Compiler) {
    super(compiler);
  };

  public override compile(node: Identifier): void {
    const { name } = node;
    const currentScope = this.compiler.scopeManager.getCurrentScope();
    
    if(this.compiler.scopeManager.hasVariable(name, currentScope)) {
      const definition = this.compiler.scopeManager.getVariable(name, currentScope);
      this.compiler.bytecode.writeOperationCode(OperationCode.LOAD_VARIABLE);
      this.compiler.bytecode.writeDword(definition.scope.id);
      this.compiler.bytecode.writeDword(definition.destination);
    } else {
      this.compiler.compileAsStringLiteral(name);
      this.compiler.bytecode.writeOperationCode(OperationCode.LOAD_GLOBAL);
    };
  };
};