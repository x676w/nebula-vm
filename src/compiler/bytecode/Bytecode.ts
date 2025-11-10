import type { OperationCode } from "./OperationCode.js";

export default class Bytecode {
  public program: number[];
  public strings: string[];
  public usedOpcodes: OperationCode[];

  constructor() {
    this.program = [];
    this.strings = [];
    this.usedOpcodes = [];
  };

  public registerString(str: string) {
    if(!this.strings.includes(str)) this.strings.push(str);
    const index = this.strings.indexOf(str);
    return index;
  };

  public writeOperationCode(opcode: OperationCode) {
    if(!this.usedOpcodes.includes(opcode)) {
      this.usedOpcodes.push(opcode);
    };

    this.writeInstruction(opcode);
  };

  public writeInstruction(instruction: number) {
    this.program.push(instruction & 0xFF);
  };

  public writeUShort(ushort: number) {
    this.writeInstruction(ushort);
    this.writeInstruction(ushort >> 8);
  };

  public writeDword(dword: number) {
    this.writeInstruction(dword);
    this.writeInstruction(dword >> 8);
    this.writeInstruction(dword >> 16);
    this.writeInstruction(dword >> 24);
  };
  
  public getStringsBytes() {
    const output = [];

    for(const string of this.strings) {
      output.push(string.length & 0xFF);
      output.push((string.length >> 8) & 0xFF);
      output.push((string.length >> 16) & 0xFF);
      output.push((string.length >> 24) & 0xFF);
    
      for(const char of string.split('')) {
        const xorCharCode = char.charCodeAt(0) ^ 0x80;

        output.push(xorCharCode & 0xFF);
        output.push((xorCharCode >> 8) & 0xFF);
      };
    };

    return output;
  };

  public getBase64() {
    return Buffer
      .from(this.program)
      .toString('base64');
  };
};