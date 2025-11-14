import type { NewExpression } from "@babel/types";
import NodeCompiler from "../NodeCompiler.js";
import type Compiler from "../../Compiler.js";
import { OperationCode } from "../../bytecode/OperationCode.js";

export default class NewExpressionCompiler extends NodeCompiler<NewExpression> {
  constructor(compiler: Compiler) {
    super(compiler);
  };
  
  public override compile(node: NewExpression): void {
    const args = node.arguments.reverse();

    for(const arg of args) {
      this.compiler.compileNode(arg);
    };

    if(node.callee.type === "MemberExpression") {
      this.compiler.compileNode(node.callee.object);
      node.callee.property.type === "Identifier"
        ? this.compiler.compileAsStringLiteral(node.callee.property.name)
        : this.compiler.compileNode(node.callee.property);
    } else {
      this.compiler.compileNode(node.callee);
    };

    this.compiler.bytecode.writeOperationCode(OperationCode.CONSTRUCT);
    this.compiler.bytecode.writeDword(args.length);
  };
};