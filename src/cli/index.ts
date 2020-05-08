import * as commander from "commander";
import { processCommand } from "./process_cmd";
import { getPackageVersion, isArgsSupplied } from "./helpers";
import { COMMAND_RESULT } from "./enums";
import { Logger } from "../commons";

export async function initCli(shouldExecute = false) {

    if (!isArgsSupplied()) {
        return COMMAND_RESULT.NoCommand;
    }
    if (process.argv0.includes("cruner")) {
        if ((process as any).defaultApp != true) {
            process.argv.unshift('electron');
        }
    }
    Logger.debug("initCli called ,commander", commander);
    commander.version(getPackageVersion(), '-v, --version').
        // option('new [folderName]', 'Create new project & put the content inside the specified folder').
        // option('.', 'start application').
        // option('deploy [deploymentFolderName]', 'create build for deployment').
        option('add [appUrl]', 'add application').
        option('remove [appName]', 'remove application').
        parse(process.argv);

    return await processCommand(commander, shouldExecute);
}

if (process.env.IS_MANUAL == "true") {
    Logger.debug("runing manually", process.argv);
    initCli(true);
}