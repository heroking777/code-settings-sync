// Minimal `vscode` stub so `npm test` (plain mocha) can run outside the
// VS Code extension host. The real `vscode` module is only provided at
// runtime by VS Code; the `vscode` npm package ships typings but no
// runtime entry point, so `require("vscode")` throws MODULE_NOT_FOUND.
// This file is loaded via `mocha --require ./test/vscode-mock.js` and
// intercepts `require("vscode")` before any compiled `out/` test loads.
"use strict";

const path = require("path");
const Module = require("module");

const extensionPath = path.resolve(__dirname, "..");

if (!process.env.VSCODE_NLS_CONFIG) {
  process.env.VSCODE_NLS_CONFIG = JSON.stringify({ locale: "en" });
}

const vscodeStub = {
  extensions: {
    getExtension: () => ({ extensionPath })
  },
  workspace: {
    getConfiguration: () => ({
      get: () => undefined
    })
  },
  window: {},
  commands: {},
  env: {},
  Uri: {
    parse: s => s,
    file: s => s
  },
  ViewColumn: {
    One: 1
  }
};

const originalLoad = Module._load;
Module._load = function(request, parent, isMain) {
  if (request === "vscode") {
    return vscodeStub;
  }
  return originalLoad.apply(this, arguments);
};
