import { Command } from "commander";
import shelljs, { ShellString } from "shelljs";
import { build } from "../build";
import { getJsonSchema } from "../build/schemabuilder";

export function registerCommandSchema(cli: Command) {
  const schemabuilder = cli.command("schema")
    .description("Create a JSON schema for use with autocomplete/validation of .nzentity files")
    .argument("[project]", 'Path to the project file', "./project.nzproj.toml")
    .option("--output,-o", "Path to the output file", ".nzschema.json")

  schemabuilder.action(async (project: string) => {
    const opts = schemabuilder.opts();

    const outdir = "./dist"

    const proj = await build({ project, writeToDisk: outdir })

    const schema = getJsonSchema(proj, outdir)
    ShellString(JSON.stringify(schema, null, 4)).to(opts.output);
  })
}