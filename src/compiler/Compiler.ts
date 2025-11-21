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
import VariableDeclarationCompiler from "./compilers/others/VariableDeclarationCompiler.js";
import VariableDeclaratorCompiler from "./compilers/others/VariableDeclaratorCompiler.js";
import ExpressionStatementCompiler from "./compilers/statements/ExpressionStatementCompiler.js";
import IdentifierCompiler from "./compilers/others/IdentifierCompiler.js";
import IfStatementCompiler from "./compilers/statements/IfStatementCompiler.js";
import BlockStatementCompiler from "./compilers/statements/BlockStatementCompiler.js";
import DebuggerStatementCompiler from "./compilers/statements/DebuggerStatementCompiler.js";
import ReturnStatementCompiler from "./compilers/statements/ReturnStatementCompiler.js";

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
  private variableDeclarationCompiler: VariableDeclarationCompiler;
  private variableDeclaratorCompiler: VariableDeclaratorCompiler;
  private expressionStatementCompiler: ExpressionStatementCompiler;
  private identifierCompiler: IdentifierCompiler;
  private ifStatementCompiler: IfStatementCompiler;
  private returnStatement: ReturnStatementCompiler;
  private blockStatementCompiler: BlockStatementCompiler;
  private debuggerStatementCompiler: DebuggerStatementCompiler;

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
    this.variableDeclarationCompiler = new VariableDeclarationCompiler(this);
    this.variableDeclaratorCompiler = new VariableDeclaratorCompiler(this);
    this.expressionStatementCompiler = new ExpressionStatementCompiler(this);
    this.identifierCompiler = new IdentifierCompiler(this);
    this.ifStatementCompiler = new IfStatementCompiler(this);
    this.returnStatement = new ReturnStatementCompiler(this);
    this.blockStatementCompiler = new BlockStatementCompiler(this);
    this.debuggerStatementCompiler = new DebuggerStatementCompiler(this);

    this.bytecode = new Bytecode();
    this.scopeManager = new ScopeManager();
    this.astTree = parseCode(sourceCode);
    this.sourceCode = sourceCode;
    this.verbose = verbose ?? false;
  };

  private debug(message: string) {
    if(this.verbose) {
      console.log("[compiler debug] ::: " + message);
    };
  };

  public compileNode(node: Node) {
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
      case "VariableDeclaration":
        this.variableDeclarationCompiler.compile(node);
        break;
      case "VariableDeclarator":
        this.variableDeclaratorCompiler.compile(node);
        break;
      case "ExpressionStatement":
        this.expressionStatementCompiler.compile(node);
        break;
      case "Identifier":
        this.identifierCompiler.compile(node);
        break;
      case "IfStatement":
        this.ifStatementCompiler.compile(node);
        break;
      case "ReturnStatement":
        this.returnStatement.compile(node);
        break;
      case "BlockStatement":
        this.blockStatementCompiler.compile(node);
        break;
      case "DebuggerStatement":
        this.debuggerStatementCompiler.compile();
        break;
    };
  };

  public compileAsStringLiteral(value: string) {
    this.stringLiteralCompiler.compile(stringLiteral(value));
  };

  public compile(compress?: boolean) {
    let elapsedTime = performance.now();
    this.debug("starting compilation, source code size: " + this.sourceCode.length);
    
    this.bytecode.writeInstruction(compress ? 1 : 0);

    for(const node of this.astTree.body) {
      this.compileNode(node);
    };

    elapsedTime = performance.now() - elapsedTime;
    this.debug("compiled in " + (elapsedTime / 1e3).toFixed(2) + "s");

    return this.bytecode;
  };
};