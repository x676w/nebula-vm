import type { ArrayExpression } from "@babel/types";
import NodeCompiler from "../NodeCompiler.js";
import type Compiler from "../../Compiler.js";
import { OperationCode } from "../../bytecode/OperationCode.js";

export default class ArrayExpressionCompiler extends NodeCompiler<ArrayExpression> {
  constructor(compiler: Compiler) {
    super(compiler);
  };
  
  public override compile(node: ArrayExpression): void {
    const elements = node.elements.reverse();

    for(const element of elements) {
      this.compiler.compileNode(element!);
    };

    this.compiler.bytecode.writeOperationCode(OperationCode.BUILD_ARRAY);
    this.compiler.bytecode.writeDword(elements.length);
  };
};