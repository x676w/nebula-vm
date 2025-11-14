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
        // TODO
        break;
      };
    };
  };
};