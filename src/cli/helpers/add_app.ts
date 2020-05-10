import { createReadStream, remove, symlink, createWriteStream, pathExists, copy, unlink } from "fs-extra";
import { join } from "path";
import { Github } from "./github";
import { isCommandExist } from "./is_app_installed";
import { Config } from "../config";
import { ensureDir } from "./ensure_dir";
import { Parse } from "unzipper";
import { IAppInfo } from "../interfaces";
import { getAppInfo } from "./get_app_info";
import { chmod } from "fs-extra";
import { Logger } from "../../commons";
import { Spinner } from "./spinner";
import * as semver from "semver";

export const addApp = async (url: string) => {

    if (url.includes("github")) {
        try {
            let shouldInstall = true;
            const repo = url.split("https://github.com/")[1];
            const repoSplittedBySlash = repo.split("/");
            const installDir = Config.installDir;
            const appName = repoSplittedBySlash[repoSplittedBySlash.length - 1];
            const appinstallDir = join(installDir, appName)
            const path = await Github.downloadRepo(repo, async (info) => {
                if (await isCommandExist(appName)) {
                    Logger.debug("app exist");
                    const installedAppInfo = await getAppInfo(appinstallDir);
                    // if installing version is less than installed version
                    if (semver.lt(info.tag_name, installedAppInfo.version)) {
                        Logger.log("Skipping install - App is already installed & provided version is less than or equal to installed app version.")
                        shouldInstall = false;
                    }
                }
                return shouldInstall;
            });
            if (!shouldInstall) {
                return;
            }
            Logger.debug("download path", path);
            Spinner.start('Installing app');

            Logger.debug("Config.installDir", installDir, 'exec path', process.execPath);
            await ensureDir(installDir);

            await ensureDir(appinstallDir);

            const zip = createReadStream(path as string)
                .pipe(Parse({ forceStream: true }));

            for await (const entry of zip) {
                const split = entry.path.split("/");
                split.shift();
                const path = join(appinstallDir, split.join("/"));
                if (entry.type === "File") {
                    entry.pipe(createWriteStream(path))
                    //.promise();
                }
                else {
                    await ensureDir(path);
                }
            }

            await symlink(appinstallDir, join(Config.binDir, appName), "file")
            Spinner.succeed();
        }
        catch (error) {
            Logger.debug("error", error);
            Spinner.fail(error.message || "error occured while installing app form github");
            // allow to process other task if any like logging etc
            setTimeout(() => {
                process.exit(1);
            }, 1000);
        }
    }
    else {
        Spinner.start('Installing app');
        const pathOfCrunerApp = join(Config.currentWorkingDirectory, url);
        Logger.debug("localPath", pathOfCrunerApp);
        if (await pathExists(pathOfCrunerApp)) {
            Logger.debug("local app path exist");
            const packageInfo = await getAppInfo(pathOfCrunerApp);
            Logger.debug("packageInfo", packageInfo);
            const installDir = join(Config.installDir, packageInfo.name);
            Logger.debug("installDir", installDir);
            if ((await pathExists(installDir)) === true) {
                Logger.debug("local app exist, so removing")
                await remove(installDir);
                Logger.debug("Installed app removed")
            }
            await copy(pathOfCrunerApp, installDir);
            Logger.debug("application copied");
            await createSoftLink(packageInfo, installDir);
            Spinner.succeed("App installed successfully");
        }
        else {
            Spinner.fail("Invalid application - path not found")
        }
    }
}

async function createSoftLink(appInfo: IAppInfo, appinstallDir: string) {
    const source = join(appinstallDir, appInfo.main);
    Logger.debug("source", source);
    const command = join(Config.binDir, appInfo.name);
    Logger.debug("command", command);
    if ((await pathExists(source)) === false) {
        await symlink(source, command, "junction")
    }
    await chmod(command, "755");
}