import { NzProjectConfig, NzCompiledModuleCtr } from "@nzen/core";
import { compile } from "../compiler";
import { SchemaBuilderEngine } from "./engine";
import path from "path";
import { NzJsModuleConfig } from "../modules";

function requireFromString(src: string, filename = "unknownmodule") {
  const Module = module.constructor;
  // @ts-ignore
  const m = new Module();
  m._compile(src, filename);
  return m.exports;
}

/**
 * Returns a full JSON schema with type information for every module in the project
 * @param nzproj 
 * @returns   
 */
export async function getJsonSchema(nzproj: NzProjectConfig) {
  const globalSchema = {
    type: "object",
    properties: {} as Record<string, any>
  };

  const rootPath = path.join(process.cwd(), nzproj.rootDir);

  for (let mod in nzproj.modules) {
    const module = nzproj.modules[mod] as NzJsModuleConfig;
    const engine = new SchemaBuilderEngine();

    const compiledModule = requireFromString(module.sourceCode!)
    const compiledMod: NzCompiledModuleCtr = compiledModule.default;
    engine.register(compiledMod)
    globalSchema.properties = {
      ...globalSchema.properties,
      [mod]: engine.schema
    }
  }

  return globalSchema;
}