import { pathExists } from "fs-extra";
import { Config } from "../config";
import * as Path from "path";
export async function isAppInstalled(appName: string) {
    return await pathExists(Path.join(Config.installDir, appName));
}