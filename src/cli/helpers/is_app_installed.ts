// import { pathExists } from "fs-extra";
// import { Config } from "../config";
// import * as Path from "path";
import commandExists from 'command-exists';
export async function isCommandExist(appName: string) {
    let result = await new Promise((res) => {
        commandExists(appName)
            .then(function (command) {
                res(true);
            }).catch(function () {
                res(false);
            });
    })
    return result;
}