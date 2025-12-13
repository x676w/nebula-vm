import type { VariableDeclarator } from "@babel/types";
import NodeCompiler from "../NodeCompiler.js";
import type Compiler from "../../Compiler.js";
import { OperationCode } from "../../bytecode/OperationCode.js";

export default class VariableDeclaratorCompiler extends NodeCompiler<VariableDeclarator> {
  constructor(compiler: Compiler) {
    super(compiler);
  };
  
  public override compile(node: VariableDeclarator): void {
    if(node.id.type !== 'Identifier') return;

    const variableName = node.id.name;
    const definition = this.compiler.scopeManager.defineVariable(variableName);

    if(node.init) {
      this.compiler.compileNode(node.init)!;
    } else {
      this.compiler.bytecode.writeOperationCode(OperationCode.STACK_PUSH_UNDEFINED);
    };

    this.compiler.bytecode.writeOperationCode(OperationCode.STORE_VARIABLE);
    this.compiler.bytecode.writeDword(definition.scope.id);
    this.compiler.bytecode.writeDword(definition.destination);  
  };
};