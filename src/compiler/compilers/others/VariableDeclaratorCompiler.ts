import type { VariableDeclarator } from "@babel/types";
import NodeCompiler from "../NodeCompiler.js";
import type Register from "../../register/Register.js";
import type Compiler from "../../Compiler.js";
import { OperationCode } from "../../bytecode/OperationCode.js";

export default class VariableDeclaratorCompiler extends NodeCompiler<VariableDeclarator> {
  constructor(compiler: Compiler) {
    super(compiler);
  };
  
  public override compile(node: VariableDeclarator): Register | void {
    if(node.id.type !== 'Identifier') return;

    const variableName = node.id.name;

    let initRegister: Register;

    if(node.init) {
      initRegister = this.compiler.compileNode(node.init)!;
    } else {
      initRegister = this.compiler.registerAllocator.allocateRegister();

      this.compiler.bytecode.writeOperationCode(OperationCode.STACK_PUSH_UNDEFINED);
      this.compiler.bytecode.writeOperationCode(OperationCode.MOVE_TO_REGISTER);
      this.compiler.bytecode.linkRegister(initRegister);
    };
    
    const currentScope = this.compiler.scopeManager.getCurrentScope();
    const definition = this.compiler.scopeManager.defineVariable(variableName, currentScope);

    this.compiler.bytecode.writeOperationCode(OperationCode.STORE_VARIABLE);
    this.compiler.bytecode.linkRegister(initRegister);
    this.compiler.bytecode.writeDword(currentScope.id);
    this.compiler.bytecode.writeDword(definition.destination);
  
    this.compiler.registerAllocator.disposeRegister(initRegister);
  };
};