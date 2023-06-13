declare const self: Worker;

interface WorkerContext extends Worker {
  wrapper?: any;
  Module?: any;
}

interface Version {
  default: string;
}

interface EventData {
  type: string;
  compilerInput?: string;
  importCallback?: any;
  version?: Version;
  COMPILED_LIB?: any; // added this
}

interface FunctionParam {
  args: string[];
  body: string;
}

class Compiler {
  private ctx: WorkerContext;
  private solc: any;

  constructor() {
    this.ctx = self;
    this.registerMessageHandler();
  }

  init(version: Version) {
    const buildVersion = this.getVersionScript(version);
    importScripts(`https://binaries.soliditylang.org/bin/${buildVersion}`);
    importScripts(
      "https://unpkg.com/solc-wrapper-bundle@latest/dist/bundle.js",
    );
    const wrapper = this.ctx.wrapper;
    const module = this.ctx.Module;
    this.solc = wrapper(module);
    this.ready();
  }

  ready() {
    const event = {
      type: "ready",
      status: true,
    };
    this.ctx.postMessage(event);
  }

  getVersionScript(version: Version): string {
    const api = new XMLHttpRequest();
    api.open("GET", "https://binaries.soliditylang.org/bin/list.json", false);
    api.send(null);
    const response = JSON.parse(api.response);
    return response.releases[version.default];
  }

  registerMessageHandler() {
    this.ctx.onmessage = (event: MessageEvent) => {
      const data = event.data as EventData;
      switch (data.type) {
        case "compile":
          this.compile(data.compilerInput!, data.importCallback);
          break;
        case "init":
          this.init(data.version!);
          break;
        default:
          console.log("invalid message type: " + event.data);
      }
    };
  }

  compile(input: string, fn?: FunctionParam) {
    let output;
    if (fn === undefined) {
      output = this.solc.compile(input);
    } else {
      const callback = this.constructFn(fn);
      output = this.solc.compile(input, { import: callback });
    }
    const event = { type: "out", output };
    this.ctx.postMessage(event);
  }

  constructFn(fn: FunctionParam): Function {
    return new Function(...fn.args, fn.body);
  }
}

// function placeholder for TypeScript
function importScripts(_arg0: string): void {
  throw new Error("Function not implemented.");
}

export { Compiler };
