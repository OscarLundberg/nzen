import { Command } from "commander";
import shelljs, { ShellString } from "shelljs";
import { build } from "../build";
import { getJsonSchema } from "../build/schemabuilder";
import inquirer from "inquirer";
import { compilers } from "../build/compilers";
import { templateByLanguageType } from "../createModule/langTemplates";

export function registerCommandCreate(cli: Command) {
  const create = cli.command("create")
    .description("Create a new module")
    .argument("[name]", "Name for the module")
    .option("--language", "Programming language for the module")

  create.action(async (name?: string) => {
    const opts = await inquirer.prompt(
      [
        {
          type: "input",
          name: "name",
          message: "Name for the module"
        },
        {
          type: "select",
          choices: Object.keys(compilers),
          name: "language",
          message: "Programming language for the module"
        },
      ],
      {
        name,
        language: <string>create.opts().language
      }
    );

    const moduleName = opts.name;
    const template = templateByLanguageType[opts.language];

    shelljs.mkdir("-p", moduleName);

    ShellString(template.contents).to(template.fileName(moduleName))

  })
}