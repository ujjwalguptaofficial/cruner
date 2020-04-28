import { ensureDir } from "fs-extra";
import { join } from "path";
import { Github } from "./github";
import { isAppInstalled } from "./is_app_installed";

export const addApp = async (url: string) => {
    if (url.includes("github")) {
        const repo = url.split("https://github.com/")[1];
        const repoSplittedBySlash = repo.split("/");
        const repoName = repoSplittedBySlash[repoSplittedBySlash.length - 1];
        const path = await Github.downloadRepo(repo);
        console.log("download path", path);
        if (isAppInstalled(repoName)) {

        }
    }
    else {
        console.log("Invalid repo")
    }
}