import { Config } from "../config";
import { join } from "path";
import { unlink, remove, pathExists } from "fs-extra";
import { Logger } from "../../commons";
export async function removeApp(appName: string) {
    const installDir = Config.installDir;
    const appinstallDir = join(installDir, appName);
    const appBinDir = join(Config.binDir, appName);
    const isAppExist = await pathExists(appBinDir);
    if (isAppExist) {
        await unlink(appBinDir);
    }
    await remove(appinstallDir);
    Logger.debug(`Installed app ${appName} removed`)
}