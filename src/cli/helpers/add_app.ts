import { ensureDir } from "fs-extra";
import { join } from "path";
import { Github } from "./github";

export const addApp = async (url: string) => {
    // const currentDirectory = process.cwd();
    ensureDir(join(__dirname, "../apps"));
    if (url.includes("github")) {
        const repo = url.split("https://github.com/")[1];
        Github.downloadRepo(repo);
    }
    else {
        console.log("Invalid repo")
    }
}