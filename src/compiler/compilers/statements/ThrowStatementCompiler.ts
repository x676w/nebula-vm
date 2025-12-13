import type { ThrowStatement } from "@babel/types";
import NodeCompiler from "../NodeCompiler.js";
import type Compiler from "../../Compiler.js";
import { OperationCode } from "../../bytecode/OperationCode.js";

export default class ThrowStatementCompiler extends NodeCompiler<ThrowStatement> {
  constructor(compiler: Compiler) {
    super(compiler);
  };

  public override compile(node: ThrowStatement): void {
    this.compiler.compileNode(node.argument);
    this.compiler.bytecode.writeOperationCode(OperationCode.UNARY_THROW);
  };
};