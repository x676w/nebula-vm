import type { SwitchStatement } from "@babel/types";
import NodeCompiler from "../NodeCompiler.js";
import type Compiler from "../../Compiler.js";
import { OperationCode } from "../../bytecode/OperationCode.js";

export default class SwitchStatementCompiler extends NodeCompiler<SwitchStatement> {
  constructor(compiler: Compiler) {
    super(compiler);
  };

  public override compile(node: SwitchStatement): void {
    const { discriminant, cases } = node;

    this.compiler.compileNode(discriminant);
    const tempName = "__switch_temp_" + Math.random().toString(36).slice(2, 9);
    const def = this.compiler.scopeManager.defineVariable(tempName);

    this.compiler.bytecode.writeOperationCode(OperationCode.STORE_VARIABLE);
    this.compiler.bytecode.writeDword(def.scope.id);
    this.compiler.bytecode.writeDword(def.destination);

    const caseLabels: string[] = [];
    let defaultLabel: string | null = null;

    for(let i = 0; i < cases.length; i++) {
      const lbl = this.compiler.bytecode.createLabel("switch_case");
      caseLabels.push(lbl);
      if(cases[i]?.test === null) defaultLabel = lbl;
    };

    const endLabel = this.compiler.bytecode.createLabel("switch_end");

    this.compiler.pushLoop(endLabel, endLabel);

    for(let i = 0; i < cases.length; i++) {
      const cs = cases[i]!;
      if(cs.test === null) continue;

      this.compiler.bytecode.writeOperationCode(OperationCode.LOAD_VARIABLE);
      this.compiler.bytecode.writeDword(def.scope.id);
      this.compiler.bytecode.writeDword(def.destination);

      this.compiler.compileNode(cs.test!);

      this.compiler.bytecode.writeOperationCode(OperationCode.COMPARISON_STRICT_EQUAL);
      this.compiler.bytecode.writeOperationCode(OperationCode.JUMP_IF_TRUE);
      this.compiler.bytecode.writeLabelReference(caseLabels[i]!);
    };

    if(defaultLabel) {
      this.compiler.bytecode.writeOperationCode(OperationCode.JUMP);
      this.compiler.bytecode.writeLabelReference(defaultLabel);
    } else {
      this.compiler.bytecode.writeOperationCode(OperationCode.JUMP);
      this.compiler.bytecode.writeLabelReference(endLabel);
    };

    for(let i = 0; i < cases.length; i++) {
      const cs = cases[i];
      this.compiler.bytecode.markLabel(caseLabels[i]!);

      for(const stmt of cs!.consequent) {
        this.compiler.compileNode(stmt);
      };
    };

    this.compiler.bytecode.markLabel(endLabel);

    this.compiler.popLoop();
  };
};