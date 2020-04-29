import * as commander from "commander";
import { processCommand } from "./process_cmd";
import { getPackageVersion, isArgsSupplied } from "./helpers";
import { COMMAND_RESULT } from "./enums";

export async function initCli() {
    if (!isArgsSupplied()) {
        return COMMAND_RESULT.NoCommand;
    }
    if (process.argv0.includes("cruner")) {
        if ((process as any).defaultApp != true) {
            process.argv.unshift('electron');
        }
    }

    commander.version(getPackageVersion(), '-v, --version').
        // option('new [folderName]', 'Create new project & put the content inside the specified folder').
        // option('.', 'start application').
        // option('deploy [deploymentFolderName]', 'create build for deployment').
        option('add [appUrl]', 'add app').
        parse(process.argv);

    return await processCommand(commander);
}

if (process.env.IS_MANUAL == "true") {
    initCli();
}