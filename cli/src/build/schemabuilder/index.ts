import { NzProjectConfig, NzCompiledModuleCtr } from "@nzen/core";
import { compile } from "../compiler";
import { SchemaBuilderEngine } from "./engine";
import path from "path";
import { NzJsModuleConfig } from "../modules";
import requireFromString from "require-from-string";

/**
 * Returns a full JSON schema with type information for every module in the project
 * @param nzproj 
 * @returns   
 */
export async function getJsonSchema(nzproj: NzProjectConfig, outDir: string) {
  const globalSchema = {
    type: "object",
    properties: {} as Record<string, any>
  };

  const rootPath = path.join(process.cwd(), outDir);
  for (let mod in nzproj.modules) {
    const module = nzproj.modules[mod] as NzJsModuleConfig;
    const engine = new SchemaBuilderEngine();
    const p = path.join(rootPath, module.entrypoint)
    const compiledModule = await import(p);
    const compiledMod: NzCompiledModuleCtr = compiledModule.default;
    engine.register(compiledMod)
    globalSchema.properties = {
      ...globalSchema.properties,
      [mod]: engine.schema
    }
  }

  return globalSchema;
}