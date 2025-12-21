import type { Identifier, UpdateExpression } from "@babel/types";
import NodeCompiler from "../NodeCompiler.js";
import type Compiler from "../../Compiler.js";
import { OperationCode } from "../../bytecode/OperationCode.js";

export default class UpdateExpressionCompiler extends NodeCompiler<UpdateExpression> {
  constructor(compiler: Compiler) {
    super(compiler);
  };
  
  public override compile(node: UpdateExpression): void {
    switch(node.argument.type) {
      case "Identifier": {
        const {name} = node.argument;
        const definition = this.compiler.scopeManager.getVariable(name);

        this.compiler.bytecode.writeOperationCode(
          node.operator === "++" ? OperationCode.UPDATE_PLUS : OperationCode.UPDATE_MINUS
        );
        this.compiler.bytecode.writeInstruction(node.prefix ? 1 : 0);
        this.compiler.bytecode.writeDword(definition.scope.id);
        this.compiler.bytecode.writeDword(definition.destination);
        break;
      };

      case "MemberExpression": {
        const {object, property, computed} = node.argument;

        this.compiler.compileNode(object);

        if(computed && property.type !== "Identifier") {
          this.compiler.compileNode(property);
        } else {
          this.compiler.compileAsStringLiteral((property as Identifier).name);
        };

        if(object.type === "Identifier" && this.compiler.scopeManager.hasVariable(object.name)) {
          const definition = this.compiler.scopeManager.getVariable(object.name);
          this.compiler.bytecode.writeOperationCode(
            node.operator === "++" ? OperationCode.PROP_UPDATE_PLUS : OperationCode.PROP_UPDATE_MINUS
          );
          this.compiler.bytecode.writeInstruction(node.prefix ? 1 : 0);
          this.compiler.bytecode.writeDword(definition.scope.id);
          this.compiler.bytecode.writeDword(definition.destination);
        } else {
          this.compiler.bytecode.writeOperationCode(
            node.operator === "++" ? OperationCode.COMPLEX_PROP_UPDATE_PLUS : OperationCode.COMPLEX_PROP_UPDATE_MINUS
          );
          this.compiler.bytecode.writeInstruction(node.prefix ? 1 : 0);
        };

        break;
      };
    };
  };
};