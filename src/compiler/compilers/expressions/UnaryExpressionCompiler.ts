import type { UnaryExpression } from "@babel/types";
import type Compiler from "../../Compiler.js";
import NodeCompiler from "../NodeCompiler.js";
import { OperationCode } from "../../bytecode/OperationCode.js";

export default class UnaryExpressionCompiler extends NodeCompiler<UnaryExpression> {
  constructor(compiler: Compiler) {
    super(compiler);
  };
  
  public override compile(node: UnaryExpression): void {
    this.compiler.compileNode(node.argument);

    switch(node.operator) {
      case "+":
        this.compiler.bytecode.writeOperationCode(OperationCode.UNARY_PLUS);
        break;
      case "-":
        this.compiler.bytecode.writeOperationCode(OperationCode.UNARY_MINUS);
        break;
      case "!":
        this.compiler.bytecode.writeOperationCode(OperationCode.UNARY_NOT);
        break;
      case "~":
        this.compiler.bytecode.writeOperationCode(OperationCode.UNARY_BIT_NOT);
        break;
      case "typeof":
        this.compiler.bytecode.writeOperationCode(OperationCode.UNARY_TYPEOF);
        break;
      case "void":
        this.compiler.bytecode.writeOperationCode(OperationCode.UNARY_VOID);
        break;
      case "throw":
        this.compiler.bytecode.writeOperationCode(OperationCode.UNARY_THROW);
        break;
      default:
        throw new Error("Unsupported unary operator: " + node.operator);
    };
  };
};