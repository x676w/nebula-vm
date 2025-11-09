import { type Node, type Program } from "@babel/types";
import parseCode from "../utils/Parse.js";
import Bytecode from "./bytecode/Bytecode.js";
import ScopeManager from "./ScopeManager.js";
import RegisterAllocator from "./register/RegisterAllocator.js";

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
import VariableDeclarationCompiler from "./compilers/others/VariableDeclarationCompiler.js";
import VariableDeclaratorCompiler from "./compilers/others/VariableDeclaratorCompiler.js";
import ExpressionStatementCompiler from "./compilers/statements/ExpressionStatementCompiler.js";
import IdentifierCompiler from "./compilers/others/IdentifierCompiler.js";
import BlockStatementCompiler from "./compilers/statements/BlockStatementCompiler.js";

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
  private variableDeclarationCompiler: VariableDeclarationCompiler;
  private variableDeclaratorCompiler: VariableDeclaratorCompiler;
  private expressionStatementCompiler: ExpressionStatementCompiler;
  private identifierCompiler: IdentifierCompiler;
  private blockStatementCompiler: BlockStatementCompiler;

  public bytecode: Bytecode;
  public scopeManager: ScopeManager;
  public registerAllocator: RegisterAllocator;
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
    this.variableDeclarationCompiler = new VariableDeclarationCompiler(this);
    this.variableDeclaratorCompiler = new VariableDeclaratorCompiler(this);
    this.expressionStatementCompiler = new ExpressionStatementCompiler(this);
    this.identifierCompiler = new IdentifierCompiler(this);
    this.blockStatementCompiler = new BlockStatementCompiler(this);

    this.bytecode = new Bytecode();
    this.scopeManager = new ScopeManager();
    this.registerAllocator = new RegisterAllocator();
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
    
    switch(node.type) {
      case "StringLiteral": return this.stringLiteralCompiler.compile(node);
      case "NumericLiteral": return this.numericLiteralCompiler.compile(node);
      case "BooleanLiteral": return this.booleanLiteralCompiler.compile(node);
      case "NullLiteral": return this.nullLiteralCompiler.compile();
      case "BinaryExpression": return this.binaryExpressionCompiler.compile(node);
      case "LogicalExpression": return this.logicalExpressionCompiler.compile(node);
      case "UnaryExpression": return this.unaryExpressionCompiler.compile(node);
      case "VariableDeclaration": return this.variableDeclarationCompiler.compile(node);
      case "VariableDeclarator": return this.variableDeclaratorCompiler.compile(node);
      case "ExpressionStatement": return this.expressionStatementCompiler.compile(node);
      case "Identifier": return this.identifierCompiler.compile(node);
      case "BlockStatement": return this.blockStatementCompiler.compile(node);
    };
  };

  public compile() {
    let elapsedTime = performance.now();
    this.debug("starting compilation, source code size: " + this.sourceCode.length);
    
    for(const node of this.astTree.body) {
      this.compileNode(node);
    };

    elapsedTime = performance.now() - elapsedTime;
    this.debug("compiled in " + (elapsedTime / 1e3).toFixed(2) + "s");

    return this.bytecode;
  };
};