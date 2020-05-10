import Axios from "axios";
import { createWriteStream } from "fs-extra";
const ProgressBar = require('progress');
import { tmpdir } from "os";
import * as Path from "path";
import { Logger } from "../../commons";
import { Spinner } from "./spinner";
import { IGitHubRepoReleaseInfo } from "../interfaces";

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
                const shouldInstall = await onInfoFetched(response.data);
                if (!shouldInstall) {
                    return;
                }
                const tarBallUrl = response.data["zipball_url"];
                Spinner.start('Downloading app');
                const { data, headers } = await Axios.get(tarBallUrl, {
                    responseType: 'stream'
                })
                const totalLength = headers['content-length'];
                const fileDownloadPath = Path.resolve(tmpdir(), headers["content-disposition"].split(";")[1].split("=")[1]);
                const writer = createWriteStream(fileDownloadPath);
                data.pipe(writer);
                return new Promise((resolve, reject) => {
                    writer.on('finish', () => {
                        Spinner.succeed();
                        resolve(fileDownloadPath);
                    })
                    writer.on('error', () => {
                        Spinner.fail();
                        reject();
                    })
                })
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