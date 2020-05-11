import { Config } from "../config";
import { join } from "path";
import { unlink, remove } from "fs-extra";
export async function removeApp(appName: string) {
    const installDir = Config.installDir;
    const appinstallDir = join(installDir, appName);
    const appBinDir = join(Config.binDir, appName);
    await unlink(appBinDir);
    await remove(appinstallDir);
}