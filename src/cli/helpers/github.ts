import Axios from "axios";
import { createWriteStream } from "fs-extra";
const ProgressBar = require('progress');
import { tmpdir } from "os";
import * as Path from "path";
const ora = require('ora');

const request = Axios.create({
    validateStatus: function (status) {
        return true; // status >= 200 && status < 300; // default
    }
})
export class Github {
    static async getRepoInfo(repo: string) {
        // https://api.github.com/repos/ujjwalguptaofficial/fortjs
        return request.get(`https://api.github.com/repos/${repo}`);
    }
    static async downloadRepo(repo: string, tag: string = "latest"): Promise<string> {
        const repoInforesponse = await Github.getRepoInfo(repo);
        if (repoInforesponse.status === 200 || repoInforesponse.status === 201) {
            let response = await request.get(`https://api.github.com/repos/${repo}/releases/${tag}`);
            console.log("release", response.data);
            if (response.status === 200) {
                const tarBallUrl = response.data["zipball_url"];
                const spinner = ora('Downloading app');
                spinner.start();
                const { data, headers } = await Axios.get(tarBallUrl, {
                    responseType: 'stream'
                })
                const totalLength = headers['content-length'];
                const fileDownloadPath = Path.resolve(tmpdir(), headers["content-disposition"].split(";")[1].split("=")[1]);
                const writer = createWriteStream(fileDownloadPath);
                data.pipe(writer);
                return new Promise((resolve, reject) => {
                    writer.on('finish', () => {
                        spinner.succeed();
                        resolve(fileDownloadPath);
                    })
                    writer.on('error', () => {
                        spinner.fail();
                        reject();
                    })
                })
            }
        }
        else {
            console.log(`Invalid repo - repo ${repo} does not exist`);
        }
        return Promise.reject("Invalid repo");
    }

}