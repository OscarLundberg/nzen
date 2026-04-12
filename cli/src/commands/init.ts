import { Command } from "commander";
import inquirer from "inquirer";
import shelljs, { ShellString } from "shelljs";
import path from "path";


export function registerCommandInit(cli: Command) {
  const create = cli.command("init")
    .description("Initialize a new project")
    .argument("[path]", 'Name or path to the project')

  create.action(async (projectName?: string) => {
    const opts = await inquirer.prompt(
      [{
        type: "input",
        name: "projectName",
        message: "Enter project name or path (a new folder will be created with the specified name)"
      }],
      {
        projectName
      }
    );

    const projectPath = opts.projectName;
    const projectBaseName = path.basename(projectPath);

    shelljs.mkdir("-p", projectPath);
    ShellString(`name = "${projectBaseName}"\n\n`).to(path.join(projectPath, `${projectBaseName}.nzproj.toml`))
  });
}