import { parse } from "@babel/parser"

export default function parseCode(code: string) {
  const astTree = parse(code, {
    attachComment: false,
    sourceType: 'script'
  });

  return astTree.program;
};