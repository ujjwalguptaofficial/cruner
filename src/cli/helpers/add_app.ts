import { createReadStream, exists, existsSync, mkdir, mkdirSync, createWriteStream } from "fs-extra";
import { join, resolve } from "path";
import { Github } from "./github";
import { isAppInstalled } from "./is_app_installed";
import { Config } from "../config";
import { ensureDir } from "./ensure_dir";
import { Parse } from "unzipper";

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
    }
    else {
        console.log("Invalid repo")
    }
}