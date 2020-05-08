import { addApp, isArgsSupplied } from "./helpers";
import { COMMAND_RESULT } from "./enums/index";
import { Command } from "commander";
export async function processCommand(program, shouldExecute = false) {
    console.log(program);
    if (program.add) {
        if (shouldExecute) {
            await addApp(program.add);
        }
    }
    else if (program.start) {

    }
    else {
        console.log('invalid command');
        return COMMAND_RESULT.InvalidCommand;
    }
    return COMMAND_RESULT.Ok
}