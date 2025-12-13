import type { AssignmentExpression } from "@babel/types";
import NodeCompiler from "../NodeCompiler.js";
import type Compiler from "../../Compiler.js";
import { OperationCode } from "../../bytecode/OperationCode.js";

export default class AssignmentExpressionCompiler extends NodeCompiler<AssignmentExpression> {
  constructor(compiler: Compiler) {
    super(compiler);
  };
  
  public override compile(node: AssignmentExpression): void {
    switch(node.left.type) {
      // Property assignment compilation
      case "MemberExpression": {
        // Value compilation
        this.compiler.compileNode(node.left.object);

        node.left.property.type === "Identifier" && !node.left.computed
          ? this.compiler.compileAsStringLiteral(node.left.property.name)
          : this.compiler.compileNode(node.left.property);

        this.compiler.compileNode(node.right);
        this.compiler.bytecode.writeOperationCode(OperationCode.SET_PROPERTY);
        break;
      };

      // Variable assignment compilation
      case "Identifier": {
        // Value compilation
        this.compiler.compileNode(node.right);

        const variableName = node.left.name;
        const definition = this.compiler.scopeManager.getVariable(variableName);
        const isOperation = node.operator !== "=";

        this.compiler.bytecode.writeOperationCode(OperationCode.ASSIGN_VARIABLE);
        this.compiler.bytecode.writeInstruction(isOperation ? 1 : 0);
        this.compiler.bytecode.writeDword(definition.scope.id);
        this.compiler.bytecode.writeDword(definition.destination);

        if(isOperation) {
          switch(node.operator) {
            case "=": break;
            case "+=":
              this.compiler.bytecode.writeOperationCode(OperationCode.ADD_ASSIGN_VARIABLE);
              break;
            case "-=":
              this.compiler.bytecode.writeOperationCode(OperationCode.SUB_ASSIGN_VARIABLE);
              break;
            case "*=":
              this.compiler.bytecode.writeOperationCode(OperationCode.MUL_ASSIGN_VARIABLE);
              break;
            case "/=":
              this.compiler.bytecode.writeOperationCode(OperationCode.DIV_ASSIGN_VARIABLE);
              break;
            case "%=":
              this.compiler.bytecode.writeOperationCode(OperationCode.MOD_ASSIGN_VARIABLE);
              break;
            case "<<=":
              this.compiler.bytecode.writeOperationCode(OperationCode.BIT_SHIFT_LEFT_ASSIGN_VARIABLE);
              break;
            case ">>=":
              this.compiler.bytecode.writeOperationCode(OperationCode.BIT_SHIFT_RIGHT_ASSIGN_VAIRABLE);
              break;
            case ">>>=":
              this.compiler.bytecode.writeOperationCode(OperationCode.UNSIGNED_BIT_SHIFT_RIGHT_ASSIGN_VARIABLE);
              break;
            case "^=":
              this.compiler.bytecode.writeOperationCode(OperationCode.BIT_XOR_ASSIGN_VARIABLE);
              break;
            case "&=":
              this.compiler.bytecode.writeOperationCode(OperationCode.BIT_AND_ASSIGN_VARIABLE);
              break;
            case "|=":
              this.compiler.bytecode.writeOperationCode(OperationCode.BIT_OR_ASSIGN_VARIABLE);
              break;
            default:
              throw new Error("Unsupported assignment operator: " + node.operator);
          };
        };
        
        break;
      };
    };
  };
};