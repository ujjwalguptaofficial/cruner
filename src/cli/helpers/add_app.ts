import { createReadStream, exists, existsSync, mkdir } from "fs-extra";
import { join, resolve } from "path";
import { Github } from "./github";
import { isAppInstalled } from "./is_app_installed";
import { Config } from "../config";
import { ensureDir } from "./ensure_dir";
import { Extract } from "unzipper";

export const addApp = async (url: string) => {
    if (url.includes("github")) {
        const repo = url.split("https://github.com/")[1];
        const repoSplittedBySlash = repo.split("/");
        const repoName = repoSplittedBySlash[repoSplittedBySlash.length - 1];
        const path = await Github.downloadRepo(repo);
        console.log("download path", path);
        // if (isAppInstalled(repoName)) {


        // }
        const installDir = Config.installDir;
        console.log("Config.installDir", installDir, 'exec path', process.execPath);
        await ensureDir(installDir);
        const appinstallDir = join(installDir, repoName)
        await ensureDir(appinstallDir);
        const extract = Extract({ path: appinstallDir })
        return new Promise((res, rej) => {
            createReadStream(path as string)
                .pipe(
                    extract
                    // promise()
                    // .then(() => { console.log('done'); res() }, rej)
                );
            extract.promise().then(() => { console.log('done'); res() }, rej)
            // });
        })

    }
    else {
        console.log("Invalid repo")
    }
}