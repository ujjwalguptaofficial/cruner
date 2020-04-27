import * as commander from "commander";
import { processCommand } from "./process_cmd";
import { getPackageVersion } from "./helpers";

export function initCli() {
    commander.version(getPackageVersion(), '-v, --version').
        // option('new [folderName]', 'Create new project & put the content inside the specified folder').
        // option('start', 'start development server').
        // option('deploy [deploymentFolderName]', 'create build for deployment').
        option('add [appUrl]', 'add the components').
        parse(process.argv);

    processCommand(commander);
}