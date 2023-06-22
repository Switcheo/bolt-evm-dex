export class CompilerHelpers {
  static createCompileInput(sources: { [key: string]: { content: string } }, options: object = {}): string {
    const CompileInput = {
      language: "Solidity",
      sources: {
        ...sources,
      },
      settings: {
        ...options,
        outputSelection: {
          "*": {
            "*": ["abi", "evm.bytecode.object"],
          },
        },
      },
    };
    return JSON.stringify(CompileInput);
  }
}

export class FnTransform {
  // eslint-disable-next-line @typescript-eslint/ban-types
  static stringify(fn: Function): { name: string; args: string; body: string } {
    const name = fn.name;
    const _fn = fn.toString();
    const args = _fn.substring(_fn.indexOf("(") + 1, _fn.indexOf(")"));
    const body = _fn.substring(_fn.indexOf("{") + 1, _fn.lastIndexOf("}"));
    return {
      name,
      args,
      body,
    };
  }
}
