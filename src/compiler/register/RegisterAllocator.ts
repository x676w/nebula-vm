import Register from "./Register.js";

export default class RegisterAllocator {
  public pointer: number;
  public registers: Register[];

  constructor() {
    this.pointer = 0;
    this.registers = [];
  };

  public allocateRegister(): Register {
    if(this.registers.length) {
      return this.registers.pop()!;
    } else {
      return new Register(this.pointer++);
    };
  };

  public disposeRegister(register: Register) {
    this.registers.push(register);
  };
};