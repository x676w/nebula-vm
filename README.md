# NebulaVM

JavaScript code obfuscator based on virtualization. Transforms your JavaScript code into a virtualized stack-based representation, making it harder to understand while maintaining functionality.

# Features

- Converts JavaScript code to stack-based virtual machine instructions
- Preserves original program functionality
- Lightweight obfuscation solution
- Focus on core JavaScript features
- REST API for easy integration

# Installation
```bash
git clone https://github.com/x676w/nebula-vm

cd nebula-vm

npm install
```

# Usage - File Method
1. Create resources folder if its not exist
2. Create `input.js` file
3. Edit `resources/input.js`
```js
console.log("Hello, World!");
```
4. Run obfuscation
```bash
npm run obfuscate
```
5. Check `resources/output.js`
```js
(e=>{let r=new Uint8Array(8),l=(new Float64Array(r.buffer),{t:null,l:null,o:null,i:null,u:null}),n={t:null},t={27:function(){var r=a(),n=a(),t=i(),e=new Array(t);for(let r=0;r<t;r++)e[r]=a();u(n[r].apply(n,e))},47:function(){u(l.u[i()])},34:function(){var r=a(),n=globalThis;try{u(Reflect.get(n,r))}catch(r){u(void 0)}}};function o(){return l.t[n.t++]}function i(){return l.t[n.t++]|l.t[n.t++]<<8|l.t[n.t++]<<16|l.t[n.t++]<<24}function u(r){l.l.push(r)}function a(){return l.l.pop()}function f(){for(;n.t<l.t.length;){var r=o();if(1===r)return o()?a():void 0;r=t[r];if(!r)throw new Error("???");r()}}if(l.t=(r=>{let n=0;for(var t=r.length,e=new Uint8Array(t);n<t;){var l=r.charCodeAt(n);e[n++]=l}return e})((r=>{var n=r.split("");let t="";for(let r=0;r<n.length;r++){var e=n[r],e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(e);-1!==e&&(e=e.toString(2).padStart(6,"0"),t+=e)}var l=[];for(let r=0;r<t.length;r+=8){var o=t.substring(r,r+8);if(o.length<8)break;l.push(o)}return l.map(r=>String.fromCharCode(parseInt(r,2))).join("")})("gK+AgICAr4GAgICir4KAgICbgYCAgA==").split("").map(r=>String.fromCharCode(128^r.charCodeAt(0))).join("")),l.l=[],l.o=[],l.i=[{}],l.u=[],n.t=0,e.length)for(let t=0;t<e.length;){let n="";var c=e[t+0]|e[t+1]<<8|e[t+2]<<16|e[t+3]<<24;t+=4;for(let r=0;r<c;r++){var v=e[t+0]|e[t+1]<<8,v=(t+=2,String.fromCharCode(128^v));n+=v}l.u.push(n)}return o()&&(l.t=l.t.slice(1)),f})([13,0,0,0,200,0,229,0,236,0,236,0,239,0,172,0,160,0,215,0,239,0,242,0,236,0,228,0,161,0,7,0,0,0,227,0,239,0,238,0,243,0,239,0,236,0,229,0,3,0,0,0,236,0,239,0,231,0])();
```
# Usage - Server Method
1. Start the obfuscation server:
```bash
npm start
```
2. Server will start at `http://localhost:3003`
3. Send `POST` requests to obfuscate your code:

### Using curl
```bash
curl -X POST http://localhost:3003/ \
  -H "Content-Type: application/json" \
  -d '{"code": "console.log(\"Hello, World!\");"}'
```

### Using JavaScript (fetch):
```js
const response = await fetch('http://localhost:3003/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    code: 'console.log("Hello from API!");'
  })
});

const data = await response.json();
console.log(data.result);
```

### Response format:
```json
{
  "result": "obfuscated_code_here"
}
```

# Supported Features
- Arithmetic	          `100%`
- Unary Expressions	    `100%`
- Logical Expressions	  `100%`
- Call Expressions	    `100%`
- Arrays	              `100%`
- Objects	              `100%`
- Variables	            `80%`
- Functions	            `70%`
- Conditions	          `50%`
- Loops                 `50%`

# How It Works
`NebulaVM` transforms your JavaScript code into a series of stack operations executed by a virtual machine. The original code structure is replaced with:

A stack-based instruction set

A virtual machine interpreter

Obfuscated data storage

This approach makes reverse engineering more difficult while keeping the runtime behavior identical.

# Limitations
Currently only supports a subset of JavaScript features

Not a strong obfuscation solution for security-critical applications

May impact performance for complex operations

# License
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)]()