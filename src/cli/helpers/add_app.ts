import { createReadStream, remove, symlink, createWriteStream, pathExists, copy, unlink } from "fs-extra";
import { join } from "path";
import { Github } from "./github";
import { isAppInstalled } from "./is_app_installed";
import { Config } from "../config";
import { ensureDir } from "./ensure_dir";
import { Parse } from "unzipper";
import { IAppInfo } from "../interfaces";
import { getAppInfo } from "./get_app_info";
import { chmod } from "fs-extra";

export const addApp = async (url: string) => {

    if (url.includes("github")) {
        const repo = url.split("https://github.com/")[1];
        const repoSplittedBySlash = repo.split("/");
        const path = await Github.downloadRepo(repo);
        console.log("download path", path);
        const appName = repoSplittedBySlash[repoSplittedBySlash.length - 1];
        // if (isAppInstalled(repoName)) {


        // }
        const installDir = Config.installDir;
        console.log("Config.installDir", installDir, 'exec path', process.execPath);
        await ensureDir(installDir);
        const appinstallDir = join(installDir, appName)
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
    }
    else {
        const pathOfCrunerApp = join(Config.currentWorkingDirectory, url);
        console.log("localPath", pathOfCrunerApp);
        if (await pathExists(pathOfCrunerApp)) {
            console.log("pathexist");
            const packageInfo = await getAppInfo(pathOfCrunerApp);
            console.log("packageInfo", packageInfo);
            const installDir = join(Config.installDir, packageInfo.name);
            console.log("installDir", installDir);
            if ((await pathExists(installDir)) === true) {
                await remove(installDir);
            }
            await copy(pathOfCrunerApp, installDir);
            console.log("copied");
            await createSoftLink(packageInfo, installDir);
        }
        else {
            console.log("Invalid repo")
        }
    }
}

async function createSoftLink(appInfo: IAppInfo, appinstallDir: string) {
    const source = join(appinstallDir, appInfo.main);
    console.log("source", source);
    const command = join(Config.binDir, appInfo.name);
    console.log("command", command);
    if ((await pathExists(source)) === false) {
        await symlink(source, command, "junction")
    }
    await chmod(command, "755");
}