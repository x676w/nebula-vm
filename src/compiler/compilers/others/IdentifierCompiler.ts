import type { Identifier } from "@babel/types";
import NodeCompiler from "../NodeCompiler.js";
import type Compiler from "../../Compiler.js";
import type Register from "../../register/Register.js";

export default class IdentifierCompiler extends NodeCompiler<Identifier> {
  constructor(compiler: Compiler) {
    super(compiler);
  };

  public override compile(node: Identifier): Register | void {
    node;
  };
};