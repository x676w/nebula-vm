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
    
    if(node.name === "arguments") {
      this.compiler.bytecode.writeOperationCode(OperationCode.LOAD_ARGUMENTS);
      return;
    };

    if(node.name === "window") {
      this.compiler.bytecode.writeOperationCode(OperationCode.LOAD_GLOBAL);
      return;
    };

    if(this.compiler.scopeManager.hasVariable(name)) {
      const definition = this.compiler.scopeManager.getVariable(name);
      this.compiler.bytecode.writeOperationCode(OperationCode.LOAD_VARIABLE);
      this.compiler.bytecode.writeDword(definition.scope.id);
      this.compiler.bytecode.writeDword(definition.destination);
    } else {
      this.compiler.compileAsStringLiteral(name);
      this.compiler.bytecode.writeOperationCode(OperationCode.LOAD_GLOBAL_PROP);
    };
  };
};