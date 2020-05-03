import { createReadStream, remove, symlink, createWriteStream, pathExists, copy } from "fs-extra";
import { join } from "path";
import { Github } from "./github";
import { isAppInstalled } from "./is_app_installed";
import { Config } from "../config";
import { ensureDir } from "./ensure_dir";
import { Parse } from "unzipper";
import { IAppInfo } from "../interfaces";
import { getAppInfo } from "./get_app_info";

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
        const localPath = join(Config.currentWorkingDirectory, url);
        console.log("localPath", localPath);
        if (await pathExists(localPath)) {
            console.log("pathexist");
            const packageInfo = await getAppInfo(localPath);
            console.log("packageInfo", packageInfo);
            const installDir = join(Config.installDir, packageInfo.name);
            console.log("installDir", installDir);
            await copy(localPath, installDir);
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

    // if (await pathExists(source)) {
    //     console.log("file found")
    //     await remove(source);
    // }
    await symlink(source, join(Config.binDir, appInfo.name), "junction")
}