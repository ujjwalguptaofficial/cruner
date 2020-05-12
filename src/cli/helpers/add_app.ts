import { createReadStream, remove, symlink, createWriteStream, pathExists, copy, unlink } from "fs-extra";
import { join } from "path";
import { Github } from "./github";
import { Config } from "../config";
import { ensureDir } from "./ensure_dir";
import { IAppInfo } from "../interfaces";
import { getAppInfo } from "./get_app_info";
import { chmod } from "fs-extra";
import { Logger, isCmdExist } from "../../commons";
import { Spinner } from "./spinner";
import * as semver from "semver";
import { removeApp } from "./remove_app";
import { exitApp } from "./exit_app";

export const addApp = async (url: string) => {

    if (url.includes("github")) {
        try {

            const repo = url.split("https://github.com/")[1];
            const repoSplittedBySlash = repo.split("/");
            const installDir = Config.installDir;

            // const appBinDir = join(Config.binDir, appName);

            const downloadDir = await Github.downloadRepo(repo, async (info) => {
                return true;
            });

            const downloadAppInfo = await getAppInfo(downloadDir);
            const appName = downloadAppInfo.name;
            const appinstallDir = join(installDir, appName);
            const isPathExist = await pathExists(appinstallDir);
            if (isPathExist) {
                Logger.debug("app exist");
                const installedAppInfo = await getAppInfo(appinstallDir);

                // if cmd doesn't exist which means there was some problem while installing app
                if (isCmdExist(downloadAppInfo.name)) {
                    await removeApp(appName);
                }
                // if installing version is less than installed version
                else if (semver.lte(downloadAppInfo.version, installedAppInfo.version)) {
                    Logger.log("Skipping install - App is already installed & provided version is less than or equal to installed app version.");
                    return exitApp();
                }
                else {
                    await removeApp(appName);
                }
            }
            Logger.debug("download path", downloadDir);
            Spinner.start('Installing app');

            Logger.debug("Config.installDir", installDir, 'exec path', process.execPath);
            await ensureDir(installDir);

            await ensureDir(appinstallDir);
            await copy(downloadDir, appinstallDir);
            await createSoftLink(appinstallDir, (isCreated) => {
                if (isCreated) {
                    Spinner.succeed();
                    Logger.log("App Installed successfully");
                }
                else {
                    Spinner.fail();
                }
            })
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
            try {
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
                await createSoftLink(installDir, (isCreated) => {
                    if (isCreated) {
                        Spinner.succeed();
                        Logger.log("App Installed successfully");
                    }
                    else {
                        Spinner.fail();
                    }

                });

            } catch (error) {
                Logger.debug("error", error);
                Spinner.fail(error.message || "error occured while installing app form github");
                // allow to process other task if any like logging etc
                setTimeout(() => {
                    process.exit(1);
                }, 1000);
            }
        }
        else {
            Spinner.fail("Invalid application - path not found")
        }
    }
}

async function createSoftLink(appinstallDir: string, onCreated: (isCreated: boolean) => void) {
    const appInfo = await getAppInfo(appinstallDir);
    const source = join(appinstallDir, appInfo.main);
    Logger.debug("source", source);
    const commandLocation = join(Config.binDir, appInfo.name);
    Logger.debug("command location", commandLocation);
    const isSymLinkExist = await pathExists(commandLocation);
    const isSourceExist = await pathExists(source);
    if (isSourceExist === false) {
        onCreated(false);
        Logger.error(`App main '${appInfo.main}' doesn't exist.`);
        return exitApp();
    }
    if (isSymLinkExist === false) {
        Logger.debug("creating symlink")
        await symlink(source, commandLocation, "junction")
        Logger.debug("symlink created")
    }
    await chmod(commandLocation, "755");
    onCreated(true);;
}