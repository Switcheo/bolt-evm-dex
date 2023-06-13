import { _version } from "./constant";
import { CompilerHelpers, FnTransform } from "./helpers";
import { CompilerCallback, ImportCallback } from "./types";
import { _Worker } from "./worker";

export class Solc {
  worker: Worker;
  callback: CompilerCallback | undefined;

  constructor(callback?: CompilerCallback) {
    this.callback = callback;
    this.worker = this.createCompilerWebWorker();
    this.onready();
    this.initWorker();
  }

  onready() {
    this.worker.onmessage = (_event: MessageEvent) => {
      const event = _event.data;
      if (this.callback === undefined) {
        return;
      }
      if (event.type === "ready") {
        this.callback(this);
      }
    };
  }

  initWorker() {
    const event = {
      type: "init",
      version: _version,
    };
    this.worker.postMessage(event);
  }

  async compile(
    sources: { [key: string]: { content: string } },
    importCallback?: ImportCallback,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const message = this.createCompilerInput(sources, importCallback);
      this.worker.postMessage(message);
      this.worker.onmessage = (event: MessageEvent) => {
        if (event.data.type === "out") {
          resolve(JSON.parse(event.data.output));
        }
        if (event.data.type === "ready") {
          if (this.callback !== undefined) {
            this.callback(this);
          }
        }
      };
      this.worker.onerror = (err) => {
        reject(err);
      };
    });
  }

  createCompilerWebWorker(): Worker {
    return new Worker(
      URL.createObjectURL(new Blob([`(new ${_Worker})`], { type: "module" })),
    );
  }

  createCompilerInput(
    sources: { [key: string]: { content: string } },
    importCallback?: ImportCallback,
  ) {
    const compilerInput = CompilerHelpers.createCompileInput(sources);
    const fnStr =
      importCallback !== undefined
        ? FnTransform.stringify(importCallback)
        : undefined;
    const event = {
      type: "compile",
      compilerInput,
      importCallback: fnStr,
    };
    return event;
  }
}
