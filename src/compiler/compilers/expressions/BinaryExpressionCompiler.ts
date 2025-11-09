import type { BinaryExpression } from "@babel/types";
import type Compiler from "../../Compiler.js";
import type Register from "../../register/Register.js";
import NodeCompiler from "../NodeCompiler.js";
import { OperationCode } from "../../bytecode/OperationCode.js";

export default class BinaryExpressionCompiler extends NodeCompiler<BinaryExpression> {
  constructor(compiler: Compiler) {
    super(compiler);
  };
  
  public override compile(node: BinaryExpression): Register | void {
    const leftRegister = this.compiler.compileNode(node.left)!;
    const rightRegister = this.compiler.compileNode(node.right)!;

    switch(node.operator) {
      case "+":
        this.compiler.bytecode.writeOperationCode(OperationCode.ARITHMETIC_ADD);
        break;
      case "-":
        this.compiler.bytecode.writeOperationCode(OperationCode.ARITHMETIC_SUB);
        break;
      case "*":
        this.compiler.bytecode.writeOperationCode(OperationCode.ARITHMETIC_MUL);
        break;
      case "/":
        this.compiler.bytecode.writeOperationCode(OperationCode.ARITHMETIC_DIV);
        break;
      case "%":
        this.compiler.bytecode.writeOperationCode(OperationCode.ARITHMETIC_MOD);
        break;
      case "==":
        this.compiler.bytecode.writeOperationCode(OperationCode.COMPARISON_EQUAL);
        break;
      case "===":
        this.compiler.bytecode.writeOperationCode(OperationCode.COMPARISON_STRICT_EQUAL);
        break;
      case "!=":
        this.compiler.bytecode.writeOperationCode(OperationCode.COMPARISON_NOT_EQUAL);
        break;
      case "!==":
        this.compiler.bytecode.writeOperationCode(OperationCode.COMPARISON_STRICT_NOT_EQUAL);
        break;
      case "<":
        this.compiler.bytecode.writeOperationCode(OperationCode.COMPARISON_LESS);
        break;
      case "<=":
        this.compiler.bytecode.writeOperationCode(OperationCode.COMPARISON_LESS_OR_EQUAL);
        break;
      case ">":
        this.compiler.bytecode.writeOperationCode(OperationCode.COMPARISON_GREATER);
        break;
      case ">=":
        this.compiler.bytecode.writeOperationCode(OperationCode.COMPARISON_GREATER_OR_EQUAL);
        break;
      case "<<":
        this.compiler.bytecode.writeOperationCode(OperationCode.BINARY_BIT_SHIFT_LEFT);
        break;
      case ">>":
        this.compiler.bytecode.writeOperationCode(OperationCode.BINARY_BIT_SHIFT_RIGHT);
        break;
      case ">>>":
        this.compiler.bytecode.writeOperationCode(OperationCode.BINARY_UNSIGNED_BIT_SHIFT_RIGHT);
        break;
      case "^":
        this.compiler.bytecode.writeOperationCode(OperationCode.BINARY_BIT_XOR);
        break;
      case "&":
        this.compiler.bytecode.writeOperationCode(OperationCode.BINARY_BIT_AND);
        break;
      case "|":
        this.compiler.bytecode.writeOperationCode(OperationCode.BINARY_BIT_OR);
        break;
    };

    const resultRegister = leftRegister;

    this.compiler.bytecode.linkRegister(resultRegister);
    this.compiler.bytecode.linkRegister(rightRegister);
    this.compiler.bytecode.linkRegister(leftRegister);

    this.compiler.registerAllocator.disposeRegister(rightRegister);

    return resultRegister;
  };
};