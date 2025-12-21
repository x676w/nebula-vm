import { getRandomInteger } from "../utils/Random.js";
import { OperationCode } from "./bytecode/OperationCode.js";
import { stringLiteral, type Node, type Program } from "@babel/types";
import parseCode from "../utils/Parse.js";
import Bytecode from "./bytecode/Bytecode.js";
import ScopeManager from "./ScopeManager.js";

/**
 * Ast node compilers import
 */
import StringLiteralCompiler from "./compilers/literals/StringLiteralCompiler.js";
import NumericLiteralCompiler from "./compilers/literals/NumericLiteralCompiler.js";
import BooleanLiteralCompiler from "./compilers/literals/BooleanLiteralCompiler.js";
import NullLiteralCompiler from "./compilers/literals/NullLiteralCompiler.js";
import BinaryExpressionCompiler from "./compilers/expressions/BinaryExpressionCompiler.js";
import LogicalExpressionCompiler from "./compilers/expressions/LogicalExpressionCompiler.js";
import UnaryExpressionCompiler from "./compilers/expressions/UnaryExpressionCompiler.js";
import MemberExpressionCompiler from "./compilers/expressions/MemberExpressionCompiler.js";
import NewExpressionCompiler from "./compilers/expressions/NewExpressionCompiler.js";
import CallExpressionCompiler from "./compilers/expressions/CallExpressionCompiler.js";
import ArrayExpressionCompiler from "./compilers/expressions/ArrayExpressionCompiler.js";
import ObjectExpressionCompiler from "./compilers/expressions/ObjectExpressionCompiler.js";
import AssignmentExpressionCompiler from "./compilers/expressions/AssignmentExpressionCompiler.js";
import FunctionExpressionCompiler from "./compilers/expressions/FunctionExpressionCompiler.js";
import UpdateExpressionCompiler from "./compilers/expressions/UpdateExpressionCompiler.js";
import ThisExpressionCompiler from "./compilers/expressions/ThisExpressionCompiler.js";
import VariableDeclarationCompiler from "./compilers/others/VariableDeclarationCompiler.js";
import VariableDeclaratorCompiler from "./compilers/others/VariableDeclaratorCompiler.js";
import FunctionDeclarationCompiler from "./compilers/others/FunctionDeclarationCompiler.js";
import ExpressionStatementCompiler from "./compilers/statements/ExpressionStatementCompiler.js";
import ForStatementCompiler from "./compilers/statements/ForStatementCompiler.js";
import IdentifierCompiler from "./compilers/others/IdentifierCompiler.js";
import IfStatementCompiler from "./compilers/statements/IfStatementCompiler.js";
import ReturnStatementCompiler from "./compilers/statements/ReturnStatementCompiler.js";
import SwitchStatementCompiler from "./compilers/statements/SwitchStatementCompiler.js";
import ThrowStatementCompiler from "./compilers/statements/ThrowStatementCompiler.js";
import BlockStatementCompiler from "./compilers/statements/BlockStatementCompiler.js";
import WhileStatementCompiler from "./compilers/statements/WhileStatementCompiler.js";
import DebuggerStatementCompiler from "./compilers/statements/DebuggerStatementCompiler.js";
import BreakStatementCompiler from "./compilers/statements/BreakStatementCompiler.js";
import ContinueStatementCompiler from "./compilers/statements/ContinueStatementCompiler.js";

/**
 * Main compiler
 */
export default class Compiler {
  private stringLiteralCompiler: StringLiteralCompiler;
  private numericLiteralCompiler: NumericLiteralCompiler;
  private booleanLiteralCompiler: BooleanLiteralCompiler;
  private nullLiteralCompiler: NullLiteralCompiler;
  private binaryExpressionCompiler: BinaryExpressionCompiler;
  private logicalExpressionCompiler: LogicalExpressionCompiler;
  private unaryExpressionCompiler: UnaryExpressionCompiler;
  private memberExpressionCompiler: MemberExpressionCompiler;
  private newExpressionCompiler: NewExpressionCompiler;
  private callExpressionCompiler: CallExpressionCompiler;
  private arrayExpressionCompiler: ArrayExpressionCompiler;
  private objectExpressionCompiler: ObjectExpressionCompiler;
  private assignmentExpressionCompiler: AssignmentExpressionCompiler;
  private functionExpressionCompiler: FunctionExpressionCompiler;
  private updateExpressionCompiler: UpdateExpressionCompiler;
  private thisExpressionCompiler: ThisExpressionCompiler;
  private variableDeclarationCompiler: VariableDeclarationCompiler;
  private variableDeclaratorCompiler: VariableDeclaratorCompiler;
  private functionDeclarationCompiler: FunctionDeclarationCompiler;
  private expressionStatementCompiler: ExpressionStatementCompiler;
  private forStatementCompiler: ForStatementCompiler;
  private identifierCompiler: IdentifierCompiler;
  private ifStatementCompiler: IfStatementCompiler;
  private returnStatementCompiler: ReturnStatementCompiler;
  private switchStatementCompiler: SwitchStatementCompiler;
  private throwStatementCompiler: ThrowStatementCompiler;
  private blockStatementCompiler: BlockStatementCompiler;
  private whileStatementCompiler: WhileStatementCompiler;
  private debuggerStatementCompiler: DebuggerStatementCompiler;
  private breakStatementCompiler: BreakStatementCompiler;
  private continueStatementCompiler: ContinueStatementCompiler;
  private loopStack: Array<{ breakLabel: string; continueLabel: string }>;

  public bytecode: Bytecode;
  public scopeManager: ScopeManager;
  public astTree: Program;
  public sourceCode: string;
  public verbose: boolean;

  constructor(sourceCode: string, verbose?: boolean) {
    this.stringLiteralCompiler = new StringLiteralCompiler(this);
    this.numericLiteralCompiler = new NumericLiteralCompiler(this);
    this.booleanLiteralCompiler = new BooleanLiteralCompiler(this);
    this.nullLiteralCompiler = new NullLiteralCompiler(this);
    this.binaryExpressionCompiler = new BinaryExpressionCompiler(this);
    this.logicalExpressionCompiler = new LogicalExpressionCompiler(this);
    this.unaryExpressionCompiler = new UnaryExpressionCompiler(this);
    this.memberExpressionCompiler = new MemberExpressionCompiler(this);
    this.newExpressionCompiler = new NewExpressionCompiler(this);
    this.callExpressionCompiler = new CallExpressionCompiler(this);
    this.arrayExpressionCompiler = new ArrayExpressionCompiler(this);
    this.objectExpressionCompiler = new ObjectExpressionCompiler(this);
    this.assignmentExpressionCompiler = new AssignmentExpressionCompiler(this);
    this.functionExpressionCompiler = new FunctionExpressionCompiler(this);
    this.updateExpressionCompiler = new UpdateExpressionCompiler(this);
    this.thisExpressionCompiler = new ThisExpressionCompiler(this);
    this.variableDeclarationCompiler = new VariableDeclarationCompiler(this);
    this.variableDeclaratorCompiler = new VariableDeclaratorCompiler(this);
    this.functionDeclarationCompiler = new FunctionDeclarationCompiler(this);
    this.expressionStatementCompiler = new ExpressionStatementCompiler(this);
    this.forStatementCompiler = new ForStatementCompiler(this);
    this.identifierCompiler = new IdentifierCompiler(this);
    this.ifStatementCompiler = new IfStatementCompiler(this);
    this.returnStatementCompiler = new ReturnStatementCompiler(this);
    this.switchStatementCompiler = new SwitchStatementCompiler(this);
    this.throwStatementCompiler = new ThrowStatementCompiler(this);
    this.blockStatementCompiler = new BlockStatementCompiler(this);
    this.whileStatementCompiler  = new WhileStatementCompiler(this);
    this.debuggerStatementCompiler = new DebuggerStatementCompiler(this);
    this.breakStatementCompiler = new BreakStatementCompiler(this);
    this.continueStatementCompiler = new ContinueStatementCompiler(this);
    this.loopStack = [];

    this.bytecode = new Bytecode();
    this.scopeManager = new ScopeManager();
    this.astTree = parseCode(sourceCode);
    this.sourceCode = sourceCode;
    this.verbose = verbose ?? false;
  };
  
  private randomiseOpcodes() {
    const isNumRegex = /^[0-9]+$/;
    const opCodeValues: number[] = [];
    const keyValues: string[] = [];
    
    for(const key in OperationCode) {
      if(!isNumRegex.test(key)) {
        opCodeValues.push(OperationCode[key as keyof typeof OperationCode]);
        keyValues.push(key);
      };
    };

    while(opCodeValues.length) {
      const idx = getRandomInteger(0, opCodeValues.length - 1);
      const opCode = opCodeValues[idx];
      opCodeValues.splice(idx, 1);
      const key = keyValues.pop();

      // @ts-ignore
      OperationCode[key] = opCode;
      // @ts-ignore
      OperationCode[opCode] = key;
    };
  };

  private debug(message: string) {
    if(this.verbose) {
      console.log("[compiler debug] ::: " + message);
    };
  };

  public pushLoop(breakLabel: string, continueLabel: string) {
    this.loopStack.push({ breakLabel, continueLabel });
  };

  public popLoop() {
    return this.loopStack.pop();
  };

  public getCurrentLoop() {
    return this.loopStack[this.loopStack.length - 1];
  };

  public compileNode(node: Node) {
    if(!node) return;
    this.debug("compiling " + node.type + " node");

    switch (node.type) {
      case "StringLiteral":
        this.stringLiteralCompiler.compile(node);
        break;
      case "NumericLiteral":
        this.numericLiteralCompiler.compile(node);
        break;
      case "BooleanLiteral":
        this.booleanLiteralCompiler.compile(node);
        break;
      case "NullLiteral":
        this.nullLiteralCompiler.compile();
        break;
      case "BinaryExpression":
        this.binaryExpressionCompiler.compile(node);
        break;
      case "LogicalExpression":
        this.logicalExpressionCompiler.compile(node);
        break;
      case "UnaryExpression":
        this.unaryExpressionCompiler.compile(node);
        break;
      case "MemberExpression":
        this.memberExpressionCompiler.compile(node);
        break;
      case "NewExpression":
        this.newExpressionCompiler.compile(node);
        break;
      case "CallExpression":
        this.callExpressionCompiler.compile(node);
        break;
      case "ArrayExpression":
        this.arrayExpressionCompiler.compile(node);
        break;
      case "ObjectExpression":
        this.objectExpressionCompiler.compile(node);
        break;
      case "AssignmentExpression":
        this.assignmentExpressionCompiler.compile(node);
        break;
      case "FunctionExpression":
        this.functionExpressionCompiler.compile(node);
        break;
      case "UpdateExpression":
        this.updateExpressionCompiler.compile(node);
        break;
      case "ThisExpression":
        this.thisExpressionCompiler.compile(node);
        break;
      case "VariableDeclaration":
        this.variableDeclarationCompiler.compile(node);
        break;
      case "VariableDeclarator":
        this.variableDeclaratorCompiler.compile(node);
        break;
      case "FunctionDeclaration":
        this.functionDeclarationCompiler.compile(node);
        break;
      case "ExpressionStatement":
        this.expressionStatementCompiler.compile(node);
        break;
      case "ForStatement":
        this.forStatementCompiler.compile(node);
        break;
      case "SwitchStatement":
        this.switchStatementCompiler.compile(node);
        break;
      case "BreakStatement":
        this.breakStatementCompiler.compile(node);
        break;
      case "ContinueStatement":
        this.continueStatementCompiler.compile(node);
        break;
      case "Identifier":
        this.identifierCompiler.compile(node);
        break;
      case "IfStatement":
        this.ifStatementCompiler.compile(node);
        break;
      case "ReturnStatement":
        this.returnStatementCompiler.compile(node);
        break;
      case "ThrowStatement":
        this.throwStatementCompiler.compile(node);
        break;
      case "BlockStatement":
        this.blockStatementCompiler.compile(node);
        break;
      case "WhileStatement":
        this.whileStatementCompiler.compile(node);
        break;
      case "DebuggerStatement":
        this.debuggerStatementCompiler.compile();
        break;
      case "EmptyStatement": break;
      // default:
      //   throw new Error("Unsupported node type: " + node.type);
    };
  };

  public compileAsStringLiteral(value: string) {
    this.stringLiteralCompiler.compile(stringLiteral(value));
  };

  public compile(compress?: boolean) {
    let elapsedTime = performance.now();
    this.debug("starting compilation, source code size: " + this.sourceCode.length);
    
    if(!this.verbose) this.randomiseOpcodes();
    this.bytecode.writeInstruction(compress ? 1 : 0);

    for(const node of this.astTree.body) {
      this.compileNode(node);
    };

    this.bytecode.resolveLabels();

    elapsedTime = performance.now() - elapsedTime;
    this.debug("compiled in " + (elapsedTime / 1e3).toFixed(2) + "s");

    return {
      bytecode : this.bytecode,
      opcodes  : OperationCode
    };
  };
};