import { addApp, isArgsSupplied } from "./helpers";
import { COMMAND_RESULT } from "./enums/index";
export const processCommand = function (commander) {
    console.log(commander);
    if (!isArgsSupplied()) {
        return COMMAND_RESULT.NoCommand;
    }

    if (commander.add) {
        addApp(commander.add);
    }
    else {
        console.log('invalid command');
        return COMMAND_RESULT.InvalidCommand;
    }
    return COMMAND_RESULT.Ok
}