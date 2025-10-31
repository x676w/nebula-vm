import type { LogicalExpression } from "@babel/types";
import type Compiler from "../../Compiler.js";
import type Register from "../../register/Register.js";
import NodeCompiler from "../NodeCompiler.js";

export default class LogicalExpressionCompiler extends NodeCompiler<LogicalExpression> {
  constructor(compiler: Compiler) {
    super(compiler);
  };
  
  public override compile(node: LogicalExpression): Register | void {
    this.compiler.compileNode(node.left);
    this.compiler.compileNode(node.right);

    switch(node.operator) {
      
    };
  };
};