import { addApp, isAppInstalled, removeApp } from "./helpers";
import { COMMAND_RESULT } from "./enums/index";
import { Command } from "commander";
import { Logger } from "../commons";
import { Spinner } from "./helpers/spinner";
export async function processCommand(program, shouldExecute = false) {
    if (program.add) {
        if (shouldExecute) {
            await addApp(program.add);
        }
    }
    else if (program.remove) {
        if (shouldExecute) {
            const appName = program.remove;
            Spinner.start("Checking if app installed")
            const isProvidedAppInstalled = await isAppInstalled(appName);
            if (isProvidedAppInstalled) {
                Spinner.succeed();
                Spinner.start("Removing app")
                await removeApp(program.remove);
                Spinner.succeed();
            }
            else {
                Logger.log(`App ${appName} is not installed`);
            }
        }
    }
    else {
        Logger.log('invalid command');
        return COMMAND_RESULT.InvalidCommand;
    }
    return COMMAND_RESULT.Ok
}