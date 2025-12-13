import type { SwitchStatement } from "@babel/types";
import NodeCompiler from "../NodeCompiler.js";
import type Compiler from "../../Compiler.js";
import { OperationCode } from "../../bytecode/OperationCode.js";

export default class SwitchStatementCompiler extends NodeCompiler<SwitchStatement> {
  constructor(compiler: Compiler) {
    super(compiler);
  };

  public override compile(node: SwitchStatement): void {
    this.compiler.compileNode(node.discriminant);
    this.compiler.bytecode.writeOperationCode(OperationCode.JUMP_IF_FALSE);
  };
};