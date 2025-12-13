import { functionExpression, variableDeclarator, type FunctionDeclaration } from "@babel/types";
import NodeCompiler from "../NodeCompiler.js";
import type Compiler from "../../Compiler.js";

export default class FunctionDeclarationCompiler extends NodeCompiler<FunctionDeclaration> {
  constructor(compiler: Compiler) {
    super(compiler);
  };
  
  public override compile(node: FunctionDeclaration): void {
    if(node.id?.type !== "Identifier") return;

    this.compiler.compileNode(variableDeclarator(
      node.id,
      functionExpression(
        null,
        node.params,
        node.body,
        node.generator,
        node.async
      )
    ));
  };
};