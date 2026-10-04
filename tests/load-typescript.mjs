import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import ts from "typescript";

// Exercise the real source without adding a separate test bundler.
export async function loadTypeScript(path, imports = {}) {
  const url = new URL(path, import.meta.url);
  const source = await readFile(url, "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2019,
      esModuleInterop: true,
    },
  }).outputText;
  const exports = {};
  const require = createRequire(url);
  const load = (name) => imports[name] ?? require(name);
  new Function("exports", "require", compiled)(exports, load);
  return exports;
}
