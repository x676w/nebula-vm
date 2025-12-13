import type { OperationCode } from "./OperationCode.js";

export default class Bytecode {
  public program: number[];
  public strings: string[];
  public usedOpcodes: OperationCode[];

  private labels: Map<string, number>;
  private labelReferences: Map<string, number[]>;
  private nextLabelId: number;

  constructor() {
    this.program = [];
    this.strings = [];
    this.usedOpcodes = [];
    this.labels = new Map();
    this.labelReferences = new Map();
    this.nextLabelId = 0;
  };

  public createLabel(prefix: string = "label") {
    const labelName = `${prefix}_${this.nextLabelId++}`;
    this.labels.set(labelName, -1);
    this.labelReferences.set(labelName, []);
    return labelName;
  };
  
  public markLabel(labelName: string) {
    if(!this.labels.has(labelName)) {
      throw new Error(`Label ${labelName} does not exist`);
    };
    this.labels.set(labelName, this.program.length);
  
    const references = this.labelReferences.get(labelName);
    if(references) {
      for(const refPos of references) {
        this.writeDwordAt(refPos, this.program.length);
      };
      this.labelReferences.set(labelName, []);
    };
  };

  public writeLabelReference(labelName: string) {
    if(!this.labels.has(labelName)) {
      this.labels.set(labelName, -1);
      this.labelReferences.set(labelName, []);
    };

    const labelPos = this.labels.get(labelName);

    if(labelPos === -1) {
      const references = this.labelReferences.get(labelName) || [];
      references.push(this.program.length);
      this.labelReferences.set(labelName, references);
      this.writeDword(0);
    } else {
      this.writeDword(labelPos!);
    };
  };

  public resolveLabels() {
    for(const [labelName, references] of this.labelReferences.entries()) {
      if(references.length === 0) continue;

      const labelPos = this.labels.get(labelName);
      if(labelPos === -1) {
        throw new Error(`Unresolved label references '${labelName}'`);
      };

      for(const refPos of references) {
        this.writeDwordAt(refPos, labelPos!);
      };

      this.labelReferences.clear();
    };
  };

  public hasUnresolvedLabels() {
    for(const labelPos of this.labels.values()) {
      if(labelPos === -1) return true;
    };

    for(const references of this.labelReferences.values()) {
      if(references.length > 0) return true;
    };

    return false;
  };

  public getLabelPosition(labelName: string) {
    const pos = this.labels.get(labelName);
    if(pos === undefined) {
      throw new Error(`Label '${labelName}' not found`);
    };
    if(pos === -1) {
      throw new Error(`Label '${labelName}' has not been marked`);
    };
    return pos;
  };

  public createLabelHere(prefix: string = "label") {
    const labelName = this.createLabel(prefix);
    this.markLabel(labelName);
    return labelName;
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
  
  public writeDouble(double: number) {
    const f64 = new Float64Array([double]);
    const u8 = new Uint8Array(f64.buffer);
    const bytes = Array.from(u8);

    for(const byte of bytes) {
      this.writeInstruction(byte);
    };
  };

  public writeDwordAt(pos: number, value: number) {
    this.program[pos] = value & 0xFF;
    this.program[pos + 1] = (value >> 8) & 0xFF;
    this.program[pos + 2] = (value >> 16) & 0xFF;
    this.program[pos + 3] = (value >> 24) & 0xFF;
  };

  public readDwordAt(pos: number) {
    if(pos < 0 || pos + 3 >= this.program.length) {
      throw new Error("Invalid dword read position: " + pos);
    };

    return this.program[pos]! |
      (this.program[pos + 1]! << 8) |
      (this.program[pos + 2]! << 16) |
      (this.program[pos + 3]! << 24);
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

  public flushProgram() {
    const oldProgram = this.program;
    this.program = [];
    return oldProgram;
  };

  public replaceProgram(newProgram: number[]) {
    const oldProgram = this.program;
    this.program = newProgram;
    return oldProgram;
  };

  public getPosition() {
    return this.program.length;
  };

  public getBase64() {
    const encodedProgram = this.program.map(
      (instruction) => instruction ^ 0x80
    );

    const bytecode = Buffer
      .from(encodedProgram)
      .toString('base64');
    
    return bytecode;
  };
};
