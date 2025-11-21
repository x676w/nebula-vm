import type { ObjectExpression } from "@babel/types";
import NodeCompiler from "../NodeCompiler.js";
import type Compiler from "../../Compiler.js";
import { OperationCode } from "../../bytecode/OperationCode.js";

export default class ObjectExpressionCompiler extends NodeCompiler<ObjectExpression> {
  constructor(compiler: Compiler) {
    super(compiler);
  };
  
  public override compile(node: ObjectExpression): void {
    const {properties} = node;
    
    for(const property of properties) {
      switch(property.type) {
        case "ObjectProperty": {
          if(property.key.type !== "Identifier" || property.computed) {
            this.compiler.compileNode(property.key);
          } else {
            this.compiler.compileAsStringLiteral(property.key.name);
          };
          this.compiler.compileNode(property.value);
          break;
        };
      };
    };

    this.compiler.bytecode.writeOperationCode(OperationCode.BUILD_OBJECT);
    this.compiler.bytecode.writeDword(properties.length);
  };
};