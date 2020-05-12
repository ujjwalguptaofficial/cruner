import Axios from "axios";
import { createWriteStream, createReadStream } from "fs-extra";
const ProgressBar = require('progress');
import { tmpdir } from "os";
import { join, resolve } from "path";
import { Logger, getUniqId } from "../../commons";
import { Spinner } from "./spinner";
import { IGitHubRepoReleaseInfo } from "../interfaces";
import { Parse } from "unzipper";
import { ensureDir } from "./ensure_dir";

const request = Axios.create({
    validateStatus: function (status) {
        return true; // status >= 200 && status < 300; // default
    }
})
export class Github {
    static async getRepoInfo(repo: string) {
        // https://api.github.com/repos/ujjwalguptaofficial/fortjs
        return await request.get(`https://api.github.com/repos/${repo}`);
    }
    static async downloadRepo(repo: string, onInfoFetched: (info: IGitHubRepoReleaseInfo) => Promise<boolean>, tag: string = "latest"): Promise<string> {
        let repoInforesponse;
        try {
            Spinner.start("fetching app info from github");
            repoInforesponse = await Github.getRepoInfo(repo);
            Spinner.succeed();
            Logger.debug("repoInfo", repoInforesponse.data);
        } catch (error) {
            throw `Unable to fetch github repo information for repo ${repo}`;
        }
        if (repoInforesponse.status === 200 || repoInforesponse.status === 201) {
            const releaseUrl = `https://api.github.com/repos/${repo}/releases/${tag}`;
            Logger.debug('releaseUrl', releaseUrl);
            let response = await request.get(releaseUrl);
            Logger.debug("release", response.data);
            if (response.status === 200) {
                // const shouldInstall = await onInfoFetched(response.data);
                // if (!shouldInstall) {
                //     Spinner.succeed();
                //     Logger.log("Skipping install - App is already installed & provided version is less than or equal to installed app version.")
                //     return;
                // }
                const tarBallUrl = response.data["zipball_url"];
                Spinner.start('Downloading app');
                const { data, headers } = await Axios.get(tarBallUrl, {
                    responseType: 'stream'
                })
                const totalLength = headers['content-length'];
                const fileDownloadPath = resolve(tmpdir(), headers["content-disposition"].split(";")[1].split("=")[1]);
                const writer = createWriteStream(fileDownloadPath);
                data.pipe(writer);
                await new Promise((resolve, reject) => {
                    writer.on('finish', () => {
                        Spinner.succeed();
                        resolve();
                    })
                    writer.on('error', () => {
                        Spinner.fail();
                        reject();
                    })
                })
                const zip = createReadStream(fileDownloadPath)
                    .pipe(Parse({ forceStream: true }));
                const extractPath = resolve(tmpdir(), getUniqId());
                for await (const entry of zip) {
                    const split = entry.path.split("/");
                    split.shift();
                    const path = join(extractPath, split.join("/"));
                    if (entry.type === "File") {
                        entry.pipe(createWriteStream(path))
                        //.promise();
                    }
                    else {
                        await ensureDir(path);
                    }
                }
                return extractPath;
            }
            else if (response.status === 404) {
                throw new Error(`No release found for repo ${repo}`);
            }
        }
        else {
            Logger.log(`Invalid repo - repo ${repo} does not exist`);
        }
        return Promise.reject("Invalid repo");
    }

}