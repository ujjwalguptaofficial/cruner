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
        // const extract = Extract({ path: appinstallDir })
        return new Promise(async (res, rej) => {
            const zip = createReadStream(path as string)
                .pipe(
                    Parse({ forceStream: true })
                    // promise()
                    // .then(() => { console.log('done'); res() }, rej)
                );
            for await (const entry of zip) {
                const split = entry.path.split("/");
                split.shift();
                const path = join(appinstallDir, split.join("/"));
                if (entry.type === "File") {
                    entry.pipe(createWriteStream(path));
                }
                else {
                    await ensureDir(path);
                }
            }
            res();
            // .on("entry", function (entry) {
            //         const split = entry.path.split("/");
            //         split.shift();
            //         const path = split.join("/");
            //         console.log("enttry", path);
            //         if (entry.type === "File") {

            //         }
            //         else {
            //             await ensureDir(join(appinstallDir, path));
            //         }
            //     }).on("end", res);
            // extract.promise().then(() => { console.log('done'); res() }, rej)
            // });
        })

    }
    else {
        console.log("Invalid repo")
    }
}