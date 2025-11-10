import type { CallExpression } from "@babel/types";
import NodeCompiler from "../NodeCompiler.js";
import type Compiler from "../../Compiler.js";
import { OperationCode } from "../../bytecode/OperationCode.js";

export default class CallExpressionCompiler extends NodeCompiler<CallExpression> {
  constructor(compiler: Compiler) {
    super(compiler);
  };
  
  public override compile(node: CallExpression): void {
    const args = node.arguments.reverse();

    for(const arg of args) {
      this.compiler.compileNode(arg);
    };

    if(node.callee.type === "MemberExpression") {
      this.compiler.compileNode(node.callee.object);

      if(node.callee.property.type === "Identifier") {
        this.compiler.compileAsStringLiteral(node.callee.property.name);
      } else {
        this.compiler.compileNode(node.callee.property);
      };

      this.compiler.bytecode.writeOperationCode(OperationCode.CALL_METHOD);
    } else {
      this.compiler.compileNode(node.callee);
      this.compiler.bytecode.writeOperationCode(OperationCode.CALL_FUNCTION);
    };

    this.compiler.bytecode.writeDword(args.length);
  };
};