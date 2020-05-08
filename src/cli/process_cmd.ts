import { addApp, isArgsSupplied } from "./helpers";
import { COMMAND_RESULT } from "./enums/index";
import { Command } from "commander";
import { Logger } from "../commons";
export async function processCommand(program, shouldExecute = false) {
    if (program.add) {
        if (shouldExecute) {
            await addApp(program.add);
        }
    }
    else if (program.remove) {
        if (shouldExecute) {
            await addApp(program.add);
        }
    }
    else {
        Logger.log('invalid command');
        return COMMAND_RESULT.InvalidCommand;
    }
    return COMMAND_RESULT.Ok
}