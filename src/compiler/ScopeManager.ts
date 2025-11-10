export interface Definition {
  scope: Scope;
  destination: number;
};

export interface Scope {
  id: number;
  parent: Scope | null;
  variables: Map<string, Definition>;
};

export default class ScopeManager {
  private globalScope: Scope;
  private currentScope: Scope;
  
  constructor() {
    this.globalScope = { id: 0, parent: null, variables: new Map() };
    this.currentScope = this.globalScope;
  };

  public getCurrentScope() {
    return this.currentScope;
  };

  public enterNewScope() {
    const newScope: Scope = {
      id: this.currentScope.id + 1,
      parent : this.currentScope,
      variables: new Map(),
    };

    this.currentScope = newScope;
  };

  public exitScope() {
    if(!this.currentScope.parent) return;
    this.currentScope = this.currentScope.parent;
  };
  
  public defineVariable(name: string, scope: Scope = this.currentScope) {
    const definition: Definition = {
      scope: scope,
      destination: scope.variables.size
    };
    scope.variables.set(name, definition);
    return definition;
  };

  public hasVariable(name: string, scope: Scope = this.currentScope): boolean {
    if(scope.variables.has(name)) {
      return true;
    };

    if(scope.parent) {
      return this.hasVariable(name, scope.parent);
    };

    return false;
  };

  public getVariable(name: string, scope: Scope = this.currentScope): Definition {
    if(scope.variables.has(name)) {
      return scope.variables.get(name)!;
    };

    if(scope.parent) {
      return this.getVariable(name, scope.parent);
    };

    throw new Error(name + " is not defined");
  };
};