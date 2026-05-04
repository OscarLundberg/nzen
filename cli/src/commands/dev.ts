import { Command } from "commander";
import path, { dirname } from "path";
import { performBuild } from "./build";
import chokidar from "chokidar";
import httpServer from "http-server";
import { glob } from "fs";

export function registerCommandDev(cli: Command) {
  const devCmd = cli.command("dev")
    .description("Start the development tool")
    .argument("[project]", 'Path to the project file', "./project.nzproj.toml")
    .option("--port,-p", "Which port the server should listen on", "8080")
    .option("--host", "Which host the server should listen on", "localhost")
    .option("--output,-o", "Path to the output directory", "./dist")


  devCmd.action(async (project: string) => {
    const opts = devCmd.opts();


    const watcher = chokidar.watch(".", {
      ignored: (file, _stats) => {
        const isFile = _stats?.isFile() || false;
        if (!isFile) { return false; }
        if (file.startsWith("node_modules") || file.startsWith("dist")) { return true; }
        return !file.includes(".nz")
      },
      persistent: true,
      awaitWriteFinish: true,
      usePolling: true
    });


    await watcher.unwatch('dist');
    await watcher.unwatch('node_modules');

    const rebuild = async (msg: string) => {
      console.clear();
      console.log(msg);
      performBuild(project, opts.output);
    }

    watcher
      .on('add', (path) => rebuild(`Rebuilding: File ${path} has been added`))
      .on('change', (path) => rebuild(`Rebuilding: File ${path} has been changed`))
      .on('unlink', (path) => rebuild(`Rebuilding: File ${path} has been removed`));

    const host = opts.host ?? "localhost";
    const port = opts.port ?? 8080;
    // @ts-ignore
    await performBuild(project, opts.output);
    const server = httpServer.createServer({
      root: opts.output, cache: -1, showDir: true
    })
    server.listen(port, host, () => {
      console.log("Server listening on " + host + ":" + port)
    })
  });
}