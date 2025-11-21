import type { MemberExpression } from "@babel/types";
import NodeCompiler from "../NodeCompiler.js";
import type Compiler from "../../Compiler.js";
import { OperationCode } from "../../bytecode/OperationCode.js";

export default class MemberExpressionCompiler extends NodeCompiler<MemberExpression> {
  constructor(compiler: Compiler) {
    super(compiler);
  };
  
  public override compile(node: MemberExpression): void {
    this.compiler.compileNode(node.object);

    if(node.property.type === "Identifier" && !node.computed) {
      this.compiler.compileAsStringLiteral(node.property.name);
    } else {
      this.compiler.compileNode(node.property);
    };

    this.compiler.bytecode.writeOperationCode(OperationCode.GET_PROPERTY);
  };
};