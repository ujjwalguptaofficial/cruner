import { addApp, isArgsSupplied } from "./helpers";

export const processCommand = async function (commander) {
    if (!isArgsSupplied()) {
        return;
    }
    console.log(commander);
    if (commander.add) {
        addApp(commander.add);
    }
    else {
        console.log('invalid command');
    }
}