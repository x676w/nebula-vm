(function(bytecode, stringsBytes) {
  const u8 = new Uint8Array(8);
  const f64 = new Float64Array(u8.buffer);

  const Context = {
    Bytecode: null,
    Stack: null,
    Arguments: null,
    Scopes: null,
    Strings: null,
    Global: null,
    This: null,
  };
  
  let Pointer = 0;

  const Handlers = {
    __STACK_PUSH_STRING__: function() {
      stackPush(Context.Strings[readDword()]);
    },
    __STACK_PUSH_DWORD__: function() {
      stackPush(readDword());
    },
    __STACK_PUSH_DOUBLE__: function() {
      stackPush(readDouble());
    },
    __STACK_PUSH_BOOLEAN__: function() {
      stackPush(readInstruction() === 1);
    },
    __STACK_PUSH_NULL__: function() {
      stackPush(null);
    },
    __STACK_PUSH_UNDEFINED__: function() {
      stackPush(undefined);
    },
    __STACK_PUSH_DUPLICATE__: function() {
      stackPush(stackPeek());
    },
    __LOAD_THIS__: function() {
      stackPush(Context.This);
    },
    __STACK_POP__: function() {
      stackPop();
    },
    __ARITHMETIC_ADD__: function() {
      const left = stackPop();
      const right = stackPop();
      stackPush(left + right);
    },
    __ARITHMETIC_SUB__: function() {
      const left = stackPop();
      const right = stackPop();
      stackPush(left - right);
    },
    __ARITHMETIC_MUL__: function() {
      const left = stackPop();
      const right = stackPop();
      stackPush(left * right);
    },
    __ARITHMETIC_DIV__: function() {
      const left = stackPop();
      const right = stackPop();
      stackPush(left / right);
    },
    __ARITHMETIC_MOD__: function() {
      const left = stackPop();
      const right = stackPop();
      stackPush(left % right);
    },
    __COMPARISON_EQUAL__: function() {
      const left = stackPop();
      const right = stackPop();
      stackPush(left == right);
    },
    __COMPARISON_STRICT_EQUAL__: function() {
      const left = stackPop();
      const right = stackPop();
      stackPush(left === right);
    },
    __COMPARISON_NOT_EQUAL__: function() {
      const left = stackPop();
      const right = stackPop();
      stackPush(left != right);
    },
    __COMPARISON_STRICT_NOT_EQUAL__: function() {
      const left = stackPop();
      const right = stackPop();
      stackPush(left !== right);
    },
    __COMPARISON_LESS__: function() {
      const left = stackPop();
      const right = stackPop();
      stackPush(left < right);
    },
    __COMPARISON_LESS_OR_EQUAL__: function() {
      const left = stackPop();
      const right = stackPop();
      stackPush(left <= right);
    },
    __COMPARISON_GREATER__: function() {
      const left = stackPop();
      const right = stackPop();
      stackPush(left > right);
    },
    __COMPARISON_GREATER_OR_EQUAL__: function() {
      const left = stackPop();
      const right = stackPop();
      stackPush(left >= right);
    },

    __BINARY_BIT_SHIFT_LEFT__: function() {
      const left = stackPop();
      const right = stackPop();
      stackPush(left << right);
    },
    __BINARY_BIT_SHIFT_RIGHT__: function() {
      const left = stackPop();
      const right = stackPop();
      stackPush(left >> right);
    },
    __BINARY_UNSIGNED_BIT_SHIFT_RIGHT__: function() {
      const left = stackPop();
      const right = stackPop();
      stackPush(left >>> right);
    },
    __BINARY_BIT_XOR__: function() {
      const left = stackPop();
      const right = stackPop();
      stackPush(left ^ right);
    },
    __BINARY_BIT_AND__: function() {
      const left = stackPop();
      const right = stackPop();
      stackPush(left & right);
    }, 
    __BINARY_BIT_OR__: function() {
      const left = stackPop();
      const right = stackPop();
      stackPush(left | right);
    },
    __BINARY_IN__: function() {
      const left = stackPop();
      const right = stackPop();
      stackPush(left in right);
    },
    __BINARY_INSTANCEOF__: function() {
      const left = stackPop();
      const right = stackPop();
      stackPush(left instanceof right);
    },
    __UNARY_PLUS__: function() {
      const arg = stackPop();
      stackPush(+arg);
    },
    __UNARY_MINUS__: function() {
      const arg = stackPop();
      stackPush(-arg);
    },
    __UNARY_NOT__: function() {
      const arg = stackPop();
      stackPush(!arg);
    },
    __UNARY_BIT_NOT__: function() {
      const arg = stackPop();
      stackPush(~arg);
    },
    __UNARY_TYPEOF__: function() {
      const arg = stackPop();
      stackPush(typeof arg);
    },
    __UNARY_VOID__: function() {
      const arg = stackPop();
      stackPush(void arg);
    },
    __UNARY_THROW__: function() {
      const err = stackPop();
      throw err;
    },
    __UPDATE_PLUS__: function() {
      const isPrefix = readInstruction() === 1;
      const scopeId = readDword();
      const destination = readDword();
      stackPush(isPrefix ? (++Context.Scopes[scopeId][destination]) : (Context.Scopes[scopeId][destination]++));
    },
    __UPDATE_MINUS__: function() {
      const isPrefix = readInstruction() === 1;
      const scopeId = readDword();
      const destination = readDword();
      stackPush(isPrefix ? (--Context.Scopes[scopeId][destination]) : (Context.Scopes[scopeId][destination]--));
    },
    __PROP_UPDATE_PLUS__: function() {
      const prop = stackPop();
      const isPrefix = readInstruction() === 1;
      const scopeId = readDword();
      const destination = readDword();
      stackPush(isPrefix ? (++Context.Scopes[scopeId][destination][prop]) : (Context.Scopes[scopeId][destination][prop]++));
    },
    __PROP_UPDATE_MINUS__: function() {
      const prop = stackPop();
      const isPrefix = readInstruction() === 1;
      const scopeId = readDword();
      const destination = readDword();
      stackPush(isPrefix ? (--Context.Scopes[scopeId][destination][prop]) : (Context.Scopes[scopeId][destination][prop]--));
    },
    __COMPLEX_PROP_UPDATE_PLUS__: function() {
      const prop = stackPop();
      const obj = stackPop();
      const isPrefix = readInstruction() === 1;
      stackPush(isPrefix ? ++obj[prop] : obj[prop]++);
    },
    __COMPLEX_PROP_UPDATE_MINUS__: function() {
      const prop = stackPop();
      const obj = stackPop();
      const isPrefix = readInstruction() === 1;
      stackPush(isPrefix ? --obj[prop] : obj[prop]--);
    },
    __LOAD_VARIABLE__: function() {
      const scopeId = readDword();
      const destination = readDword();
      const scope = Context.Scopes[scopeId];
      const variable = scope[destination];
      stackPush(variable);
    },
    __STORE_VARIABLE__: function() {
      const value = stackPop();
      const scopeId = readDword();
      const destination = readDword();
      Context.Scopes[scopeId] ??= {};
      Context.Scopes[scopeId][destination] = value;
    },
    __ASSIGN_VARIABLE__: function() {
      const value = stackPop();
      const isOperation = readInstruction();
      const scopeId = readDword();
      const destination = readDword();
      if(!(destination in Context.Scopes[scopeId])) {
        throw new Error("???");
      };
      if(!isOperation) {
        stackPush(Context.Scopes[scopeId][destination] = value);
        return;
      };
      const assignOpcode = readInstruction();
      switch(assignOpcode) {
        case __ADD_ASSIGN_VARIABLE__:
          stackPush(Context.Scopes[scopeId][destination] += value);
          break;
        case __SUB_ASSIGN_VARIABLE__:
          stackPush(Context.Scopes[scopeId][destination] -= value);
          break;
        case __MUL_ASSIGN_VARIABLE__:
          stackPush(Context.Scopes[scopeId][destination] *= value);
          break;
        case __DIV_ASSIGN_VARIABLE__:
          stackPush(Context.Scopes[scopeId][destination] /= value);
          break;
        case __MOD_ASSIGN_VARIABLE__:
          stackPush(Context.Scopes[scopeId][destination] %= value);
          break;
        case __BIT_SHIFT_LEFT_ASSIGN_VARIABLE__:
          stackPush(Context.Scopes[scopeId][destination] <<= value);
          break;
        case __BIT_SHIFT_RIGHT_ASSIGN_VARIABLE__:
          stackPush(Context.Scopes[scopeId][destination] >>= value);
          break;
        case __UNSIGNED_BIT_SHIFT_RIGHT_ASSIGN_VARIABLE__:
          stackPush(Context.Scopes[scopeId][destination] >>>= value);
          break;
        case __BIT_XOR_ASSIGN_VARIABLE__:
          stackPush(Context.Scopes[scopeId][destination] ^= value);
          break;
        case __BIT_AND_ASSIGN_VARIABLE__:
          stackPush(Context.Scopes[scopeId][destination] &= value);
          break;
        case __BIT_OR_ASSIGN_VARIABLE__:
          stackPush(Context.Scopes[scopeId][destination] |= value);
          break;
      };
    },
    __LOAD_GLOBAL__: function() {
      stackPush(Context.Global);
    },
    __LOAD_GLOBAL_PROP__: function() {
      const name = stackPop();
      
      try {
        const value = Reflect.get(Context.Global, name);
        stackPush(value);
      } catch (error) {
        stackPush(undefined);
      };
    },
    __LOAD_ARGUMENT__: function() {
      const index = readDword();
      const arg = Context.Arguments[index];
      stackPush(arg);
    },
    __LOAD_ARGUMENTS__: function() {
      stackPush(Context.Arguments);
    },
    __CALL_FUNCTION__: function() {
      const fn = stackPop();
      const argsAmount = readDword();
      const args = new Array(argsAmount);
      for(let i = 0; i < argsAmount; i++) {
        args[i] = stackPop();
      };
      stackPush(fn(...args));
    },
    __CALL_METHOD__: function() {
      const key = stackPop();
      const obj = stackPop();
      const argsAmount = readDword();
      const args = new Array(argsAmount);
      for(let i = 0; i < argsAmount; i++) {
        args[i] = stackPop();
      };
      stackPush(obj[key].apply(obj, args));
    },
    __CONSTRUCT__: function() {
      const cl = stackPop();
      const argsAmount = readDword();
      const args = new Array(argsAmount);
      for(let i = 0; i < argsAmount; i++) {
        args[i] = stackPop();
      };
      stackPush(new cl(...args));
    },
    __GET_PROPERTY__: function() {
      const key = stackPop();
      const obj = stackPop();
      stackPush(obj[key]);
    },
    __SET_PROPERTY__: function() {
      const value = stackPop();
      const key = stackPop();
      const obj = stackPop();
      obj[key] = value;
      stackPush(obj);
    },
    __BUILD_ARRAY__: function() {
      const length = readDword();
      const arr = new Array(length);
      for(let i = 0; i < length; i++) {
        arr[i] = stackPop();
      };
      stackPush(arr);
    },
    __BUILD_OBJECT__: function() {
      const length = readDword();
      const obj = {};
      for(let i = 0; i < length; i++) {
        const value = stackPop();
        const key = stackPop();
        obj[key] = value;
      };
      stackPush(obj);
    },
    __BUILD_FUNCTION__: function() {
      const fnBodyLength = readDword();
      const fnBody = new Array(fnBodyLength);

      for(let i = 0; i < fnBodyLength; i++) {
        fnBody[i] = readInstruction();
      };

      stackPush(function() {
        let result;
        const args = arguments;

        const oldBytecode = Context.Bytecode;
        const oldStack = Context.Stack;
        const oldArguments = Context.Arguments;
        const oldThis = Context.This;
        const oldBytecodePointer = Pointer;

        try {
          Context.Bytecode = u8.constructor.from(fnBody);
          Context.Stack = [];
          Context.Arguments = [...args];
          Context.This = this;
          Pointer = 0;

          result = runVM();
        } finally {
          Context.Bytecode = oldBytecode;
          Context.Stack = oldStack;
          Context.Arguments = oldArguments;
          Context.This = oldThis;
          Pointer = oldBytecodePointer;
        };

        return result;
      });
    },
    __JUMP__: function() {
      const addr = readDword();
      Pointer = addr;
    },
    __JUMP_IF_TRUE__: function() {
      const addr = readDword();
      const value = stackPop();
      if(value) {
        Pointer = addr;
      };
    },
    __JUMP_IF_FALSE__: function() {
      const addr = readDword();
      const value = stackPop();
      if(!value) {
        Pointer = addr;
      };
    },
    __DEBUGGER__: function() {
      debugger;
    },
  };
  
  function readInstruction() {
    return Context.Bytecode[Pointer++];
  };
  
  function readDword() {
    return Context.Bytecode[Pointer++]
      | Context.Bytecode[Pointer++] << 8
      | Context.Bytecode[Pointer++] << 16
      | Context.Bytecode[Pointer++] << 24;
  };

  function readDouble() {
    for(let i = 0; i < 8; i++) {
      u8[i] = readInstruction();    
    };
    const double = f64[0];
    return double;
  };

  function stackPush(value) {
    return Context.Stack.push(value);
  };
  
  function stackPop() {
    return Context.Stack.pop();
  };
  
  function stackPeek() {
    return Context.Stack[Context.Stack.length - 1];
  };

  function decodeBase64(encodedString) {
    const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    const encodedChars = encodedString.split("");
  
    let decodedString = "";
    let binaryBuffer = "";
  
    for(let i = 0; i < encodedChars.length; i++) {
      const currentChar = encodedChars[i];
      const base64Index = BASE64_CHARS.indexOf(currentChar);
      if(base64Index === -1) continue;
      
      const binaryRepresentation = base64Index.toString(2).padStart(6, '0');
      binaryBuffer += binaryRepresentation;
    };
  
    const byteGroups = [];
  
    for(let i = 0; i < binaryBuffer.length; i += 8) {
      const byteChunk = binaryBuffer.substring(i, i + 8);
      if(byteChunk.length < 8) break;
      byteGroups.push(byteChunk);
    };
  
    decodedString = byteGroups
      .map((byteChunk) => String.fromCharCode(parseInt(byteChunk, 2)))
      .join('');
  
    return decodedString;
  };
  
  function string2Uint8(string) {
    let charIndex = 0;
    const len = string.length;
    const u8 = new Uint8Array(len);
  
    while(charIndex < len) {
      const charCode = string.charCodeAt(charIndex);
      u8[charIndex++] = charCode;
    };
  
    return u8;
  };
  
  function runVM() {
    while(Pointer < Context.Bytecode.length) {
      const operationCode = readInstruction();
  
      if(operationCode === __RETURN__) {
        return readInstruction() ? stackPop() : undefined;
      };

      const handler = Handlers[operationCode];

      if(!handler) {
        throw new Error("???");
      };

      handler();
    };
  };

  function decompressBytecode(compressedBytecode) {
    return compressedBytecode;
  };
  
  function initVM() {
    Context.Bytecode = string2Uint8(
      decodeBase64(bytecode).split('').map(
        (char) => String.fromCharCode(char.charCodeAt(0) ^ 0x80)
      ).join('')
    );
    Context.Stack = [];
    Context.Arguments = [];
    Context.Scopes = [{}];
    Context.Strings = [];
    Context.This = null;
    Context.Global = typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : new Function('return this')();

    Pointer = 0;

    if(stringsBytes.length) {
      for(let i = 0; i < stringsBytes.length;) {
        let string = "";
        
        const length = stringsBytes[i + 0] |
          stringsBytes[i + 1] << 8 |
          stringsBytes[i + 2] << 16 |
          stringsBytes[i + 3] << 24;
        i += 4;
  
        for(let j = 0; j < length; j++) {
          const code = (stringsBytes[i + 0])
            | (stringsBytes[i + 1] << 8);
          i += 2;
  
          const char = String.fromCharCode(code ^ 0x80);
          string += char;
        };
  
        Context.Strings.push(string);
      };
    };

    const isCompressed = readInstruction();
  
    if(isCompressed) {
      Context.Bytecode = decompressBytecode(Context.Bytecode.slice(1));
    };

    return runVM;
  };

  return initVM();
}(
  __BYTECODE__,
  __STRINGS_BYTES__
))();