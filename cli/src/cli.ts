#!/usr/bin/env node

import packageJson from "../package.json"
import { program } from "commander";
import { registerCommandBuild } from "./commands/build";
import { registerCommandSchema } from "./commands/schema";
import { registerCommandInit } from "./commands/init";
import { registerCommandCreate } from "./commands/create";
import { registerCommandDev } from "./commands/dev";

const cli = program
  .name(packageJson.name)
  .description(packageJson.description)
  .version(packageJson.version)


registerCommandBuild(cli);
registerCommandSchema(cli);
registerCommandInit(cli);
registerCommandCreate(cli);
registerCommandDev(cli);


cli.parse(process.argv)